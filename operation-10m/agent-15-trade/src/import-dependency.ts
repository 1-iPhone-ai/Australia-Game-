import { GTEL_ACCESS_RANK, GTEL_COMMODITIES, GTEL_COMMODITY_LABEL, GTEL_PARTNER_DEFS } from './constants.ts';
import type {
  GTELCommodityId,
  GTELCommodityQuote,
  GTELImportDependencyLine,
  GTELImportDependencySnapshot,
  GTELImportRiskBand,
  GTELPartnerId,
  GTELPartnerMarket,
  GTELPersisted,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

/** Commodities where Australia is structurally import-exposed (inputs / manufactured goods). */
export const GTEL_IMPORT_EXPOSURE_WEIGHT: Partial<Record<GTELCommodityId, number>> = {
  manufacturing: 0.92,
  services: 0.35,
  aluminium: 0.28,
  coal: 0.12,
  lng: 0.18,
  iron_ore: 0.08,
  wheat: 0.15,
  beef: 0.1,
};

function riskBandFromScore(score: number): GTELImportRiskBand {
  if (score >= 0.72) return 'critical';
  if (score >= 0.52) return 'elevated';
  if (score >= 0.32) return 'moderate';
  return 'low';
}

export function createEmptyImportDependencySnapshot(): GTELImportDependencySnapshot {
  return {
    aggregateRisk: 0.25,
    band: 'moderate',
    lines: [],
    summary: 'Import exposure baseline.',
  };
}

export function sanitizeImportDependencySmoothing(raw: unknown): Partial<Record<GTELCommodityId, number>> {
  const out: Partial<Record<GTELCommodityId, number>> = {};
  if (!raw || typeof raw !== 'object') return out;
  GTEL_COMMODITIES.forEach(c => {
    const v = gtelNum((raw as Record<string, number>)[c], 0.25);
    out[c] = gtelClamp(v, 0.05, 0.95);
  });
  return out;
}

function partnerImportStress(partners: GTELPartnerMarket[]): Partial<Record<GTELPartnerId, number>> {
  const stress: Partial<Record<GTELPartnerId, number>> = {};
  partners.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const accessStress = 1 - GTEL_ACCESS_RANK[p.access] / 4;
    stress[p.id] = gtelClamp(accessStress * 0.85 + (1 - p.accessScore) * 0.35, 0, 1);
  });
  return stress;
}

export function computeImportDependencySnapshot(input: {
  partners: GTELPartnerMarket[];
  commodities: GTELCommodityQuote[];
  persisted: GTELPersisted;
}): { snapshot: GTELImportDependencySnapshot; persisted: GTELPersisted } {
  const partnerStress = partnerImportStress(input.partners);
  const smoothing = sanitizeImportDependencySmoothing(input.persisted.importDependencySmoothing);
  const lines: GTELImportDependencyLine[] = [];

  GTEL_COMMODITIES.forEach(commodity => {
    const baseExposure = gtelNum(GTEL_IMPORT_EXPOSURE_WEIGHT[commodity], 0.2);
    let weightedPartnerStress = 0;
    let weightSum = 0;
    let dominantPartnerId: GTELPartnerId | null = null;
    let dominantStress = -1;

    input.partners.forEach(p => {
      if (p.id === 'domestic_premium') return;
      const w = gtelNum(p.demandWeights[commodity], 0.45) * p.priceSensitivity;
      const stress = gtelNum(partnerStress[p.id], 0.3);
      weightedPartnerStress += stress * w;
      weightSum += w;
      if (stress > dominantStress) {
        dominantStress = stress;
        dominantPartnerId = p.id;
      }
    });

    const partnerComponent = weightSum > 0 ? weightedPartnerStress / weightSum : 0.35;
    const blockedPartners = input.partners.filter(
      p => p.id !== 'domestic_premium' && (p.access === 'blocked' || p.access === 'restricted'),
    ).length;
    const accessPenalty = gtelClamp(blockedPartners * 0.06, 0, 0.18);
    const quote = input.commodities.find(c => c.commodity === commodity);
    const priceStress = quote ? gtelClamp((quote.effectiveIndex - 100) / 90, -0.15, 0.35) : 0;
    const rawExposure = gtelClamp(
      baseExposure * 0.55 + partnerComponent * 0.35 + Math.max(0, priceStress) * 0.25 + accessPenalty,
      0.08,
      0.95,
    );
    const prev = gtelNum(smoothing[commodity], rawExposure);
    const importExposure = gtelClamp(prev * 0.65 + rawExposure * 0.35, 0.08, 0.95);
    smoothing[commodity] = Math.round(importExposure * 1000) / 1000;

    const band = riskBandFromScore(importExposure);
    const partnerLabel = dominantPartnerId
      ? GTEL_PARTNER_DEFS.find(p => p.id === dominantPartnerId)?.label || dominantPartnerId
      : 'external partners';
    const narrative =
      band === 'critical'
        ? `${GTEL_COMMODITY_LABEL[commodity]} import channels are fragile via ${partnerLabel}.`
        : band === 'elevated'
          ? `${GTEL_COMMODITY_LABEL[commodity]} faces elevated import reliance on ${partnerLabel}.`
          : `${GTEL_COMMODITY_LABEL[commodity]} import exposure is ${band}.`;

    lines.push({ commodity, importExposure, band, dominantPartnerId, narrative });
  });

  const aggregateRisk =
    lines.reduce((acc, l) => acc + l.importExposure, 0) / Math.max(1, lines.length);
  const band = riskBandFromScore(aggregateRisk);
  const hot = lines.filter(l => l.band === 'critical' || l.band === 'elevated').slice(0, 2);
  const summary =
    hot.length === 0
      ? 'Import dependency is manageable across major commodity lanes.'
      : `Import vulnerability concentrates on ${hot.map(h => GTEL_COMMODITY_LABEL[h.commodity]).join(' and ')}.`;

  return {
    snapshot: {
      aggregateRisk: Math.round(aggregateRisk * 1000) / 1000,
      band,
      lines,
      summary,
    },
    persisted: { ...input.persisted, importDependencySmoothing: smoothing },
  };
}

export function importDependencyConsumerPressure(snapshot: GTELImportDependencySnapshot): number {
  const base = gtelClamp(snapshot.aggregateRisk * 0.22, 0, 0.18);
  const criticalLines = snapshot.lines.filter(l => l.band === 'critical').length;
  return gtelClamp(base + criticalLines * 0.025, 0, 0.28);
}

export function importDependencyGiNotes(snapshot: GTELImportDependencySnapshot | null | undefined): string[] {
  if (!snapshot) return [];
  const lines = [snapshot.summary];
  if (snapshot.band === 'elevated' || snapshot.band === 'critical') {
    lines.push(`Import risk band: ${snapshot.band} (aggregate ${Math.round(snapshot.aggregateRisk * 100)}%).`);
  }
  return lines;
}
