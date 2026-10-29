import type {
  GTELCommodityId,
  GTELCommodityQuote,
  GTELExportCapacitySnapshot,
  GTELMarketDiversificationSnapshot,
  GTELPartnerMarket,
  GTELPersisted,
  GTELPreferentialUtilizationSnapshot,
  GTELTradeReconciliationSnapshot,
  GTELTurnResult,
  TradeAgreementRecord,
} from './types.ts';
import { GTEL_COMMODITIES } from './constants.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELPreferentialUtilizationBand = GTELPreferentialUtilizationSnapshot['band'];

function utilizationBand(rate: number): GTELPreferentialUtilizationBand {
  if (rate >= 0.82) return 'saturated';
  if (rate >= 0.62) return 'high';
  if (rate >= 0.38) return 'balanced';
  return 'underused';
}

export function sanitizePreferentialUtilizationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.48), 0.18, 0.92);
}

export function createEmptyPreferentialUtilizationSnapshot(): GTELPreferentialUtilizationSnapshot {
  return {
    utilizationRate: 0.48,
    band: 'balanced',
    activeAgreementCount: 0,
    boostedCommodities: [],
    summary: 'Preferential FTA lanes are lightly used relative to headline access.',
  };
}

export function advancePreferentialUtilizationSmoothing(
  persisted: GTELPersisted,
  rawRate: number,
): GTELPersisted {
  const prev = sanitizePreferentialUtilizationSmoothing(persisted.preferentialUtilizationSmoothing);
  const next = gtelClamp(prev * 0.73 + gtelClamp(rawRate, 0.18, 0.92) * 0.27, 0.18, 0.92);
  return { ...persisted, preferentialUtilizationSmoothing: Math.round(next * 1000) / 1000 };
}

function activeRatifiedAgreements(persisted: GTELPersisted, turn: number): TradeAgreementRecord[] {
  return persisted.agreements.filter(
    a => a.status === 'ratified' && (a.expiresTurn == null || turn <= a.expiresTurn),
  );
}

export function computePreferentialUtilizationSnapshot(input: {
  turn: number;
  partners: GTELPartnerMarket[];
  persisted: GTELPersisted;
  tradeReconciliation: GTELTradeReconciliationSnapshot;
  marketDiversification: GTELMarketDiversificationSnapshot;
  exportCapacity: GTELExportCapacitySnapshot;
}): { snapshot: GTELPreferentialUtilizationSnapshot; persisted: GTELPersisted } {
  const active = activeRatifiedAgreements(input.persisted, input.turn);
  const preferredPartners = input.partners.filter(
    p => p.id !== 'domestic_premium' && (p.access === 'preferred' || p.access === 'normal'),
  );
  const accessLift =
    preferredPartners.length > 0
      ? preferredPartners.reduce((acc, p) => acc + p.accessScore, 0) / preferredPartners.length
      : 0.45;
  const agreementLift = gtelClamp(active.length * 0.09, 0, 0.28);
  const reconciliationLift =
    input.tradeReconciliation.band === 'settled'
      ? 0.12
      : input.tradeReconciliation.band === 'substantive'
        ? 0.08
        : input.tradeReconciliation.band === 'procedural'
          ? 0.04
          : 0;
  const capacityDrag =
    input.exportCapacity.band === 'saturated'
      ? 0.1
      : input.exportCapacity.band === 'tight'
        ? 0.06
        : 0.02;
  const concentrationDrag =
    input.marketDiversification.band === 'critical'
      ? 0.08
      : input.marketDiversification.band === 'concentrated'
        ? 0.05
        : 0.02;
  const rawRate = gtelClamp(
    0.32 + accessLift * 0.35 + agreementLift + reconciliationLift - capacityDrag - concentrationDrag,
    0.18,
    0.92,
  );
  const persisted = advancePreferentialUtilizationSmoothing(input.persisted, rawRate);
  const utilizationRate = sanitizePreferentialUtilizationSmoothing(persisted.preferentialUtilizationSmoothing);
  const band = utilizationBand(utilizationRate);

  const boostedSet = new Set<GTELCommodityId>();
  active.forEach(a => {
    a.tariffLines.forEach(line => {
      if (GTEL_COMMODITIES.includes(line.commodity)) boostedSet.add(line.commodity);
    });
  });
  const boostedCommodities = [...boostedSet].slice(0, 5);

  const summary =
    band === 'saturated'
      ? 'FTA preferential lanes are running hot — quota clerks are prioritising ratified tariff lines.'
      : band === 'high'
        ? 'Exporters are actively filling preferential access windows under ratified agreements.'
        : band === 'underused'
          ? 'Headline FTA access is under-utilised; paperwork and partner friction are leaving quota on the table.'
          : 'Preferential lane usage is broadly aligned with ratified agreement coverage.';

  return {
    snapshot: {
      utilizationRate: Math.round(utilizationRate * 1000) / 1000,
      band,
      activeAgreementCount: active.length,
      boostedCommodities,
      summary,
    },
    persisted,
  };
}

export function applyPreferentialUtilizationToCommodityQuotes(
  commodities: GTELCommodityQuote[],
  snapshot: GTELPreferentialUtilizationSnapshot,
): GTELCommodityQuote[] {
  if (snapshot.band === 'balanced' || snapshot.band === 'underused') return commodities;
  const boost =
    snapshot.band === 'saturated' ? 0.016 : snapshot.band === 'high' ? 0.01 : 0;
  const boosted = new Set(snapshot.boostedCommodities);
  return commodities.map(c => {
    if (!boosted.has(c.commodity)) return c;
    const effectiveIndex = gtelClamp(Math.round(c.effectiveIndex * (1 + boost)) * 10 / 10, 45, 175);
    return {
      ...c,
      effectiveIndex,
      evidence: [...c.evidence, 'Preferential FTA utilisation lifted this commodity quote'],
    };
  });
}

export function preferentialUtilizationExportScale(snapshot: GTELPreferentialUtilizationSnapshot): number {
  if (snapshot.band === 'underused') return gtelClamp(0.97 + snapshot.utilizationRate * 0.02, 0.96, 0.99);
  if (snapshot.band === 'saturated') return gtelClamp(1.02 + snapshot.utilizationRate * 0.03, 1, 1.05);
  if (snapshot.band === 'high') return gtelClamp(1 + snapshot.utilizationRate * 0.02, 0.99, 1.04);
  return gtelClamp(0.99 + snapshot.utilizationRate * 0.015, 0.98, 1.02);
}

export function preferentialUtilizationWorldEvent(
  snapshot: GTELPreferentialUtilizationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'high' && snapshot.band !== 'saturated') return null;
  if (snapshot.activeAgreementCount < 1) return null;
  return {
    id: `gtel_preferential_${turn}`,
    turn,
    kind: 'trade',
    title: 'Preferential FTA lanes filling',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function preferentialUtilizationGiNotes(
  utilization: GTELPreferentialUtilizationSnapshot | null | undefined,
): string[] {
  if (!utilization) return [];
  return [
    `Preferential FTA utilisation: ${utilization.band.replace(/_/g, ' ')} (${Math.round(utilization.utilizationRate * 100)}%).`,
    utilization.summary,
  ];
}
