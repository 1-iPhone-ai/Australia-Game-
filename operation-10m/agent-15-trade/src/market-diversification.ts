import { GTEL_ACCESS_RANK, GTEL_PARTNER_DEFS } from './constants.ts';
import type {
  GTELMarketDiversificationSnapshot,
  GTELPartnerId,
  GTELPartnerMarket,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELDiversificationBand = GTELMarketDiversificationSnapshot['band'];

function diversificationBand(concentrationIndex: number): GTELDiversificationBand {
  if (concentrationIndex >= 0.78) return 'critical';
  if (concentrationIndex >= 0.58) return 'concentrated';
  if (concentrationIndex >= 0.38) return 'moderate';
  return 'well_spread';
}

export function sanitizePartnerMixSmoothing(raw: unknown): Partial<Record<GTELPartnerId, number>> {
  const out: Partial<Record<GTELPartnerId, number>> = {};
  if (!raw || typeof raw !== 'object') return out;
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const v = gtelNum((raw as Record<string, number>)[p.id], 0.2);
    out[p.id] = gtelClamp(v, 0.02, 0.85);
  });
  return out;
}

export function advancePartnerMixMemory(
  partners: GTELPartnerMarket[],
  persisted: GTELPersisted,
): GTELPersisted {
  const prev = sanitizePartnerMixSmoothing(persisted.partnerMixSmoothing);
  const external = partners.filter(p => p.id !== 'domestic_premium');
  const weightSum = external.reduce((a, p) => a + GTEL_ACCESS_RANK[p.access] * p.accessScore, 0) || 1;
  const next: Partial<Record<GTELPartnerId, number>> = { ...prev };
  external.forEach(p => {
    const share = (GTEL_ACCESS_RANK[p.access] * p.accessScore) / weightSum;
    const smoothed = gtelClamp(gtelNum(prev[p.id], share) * 0.75 + share * 0.25, 0.02, 0.85);
    next[p.id] = Math.round(smoothed * 1000) / 1000;
  });
  return { ...persisted, partnerMixSmoothing: next };
}

function effectivePartnerCount(mix: Partial<Record<GTELPartnerId, number>>): number {
  const shares = GTEL_PARTNER_DEFS.filter(p => p.id !== 'domestic_premium').map(p => gtelNum(mix[p.id], 0.2));
  const sumSq = shares.reduce((a, s) => a + s * s, 0);
  return sumSq > 0 ? Math.round((1 / sumSq) * 10) / 10 : 4;
}

export function computeMarketDiversificationSnapshot(input: {
  partners: GTELPartnerMarket[];
  persisted: GTELPersisted;
}): GTELMarketDiversificationSnapshot {
  const mix = sanitizePartnerMixSmoothing(input.persisted.partnerMixSmoothing);
  let dominantPartnerId: GTELPartnerId | null = null;
  let dominantShare = 0;
  GTEL_PARTNER_DEFS.forEach(p => {
    if (p.id === 'domestic_premium') return;
    const share = gtelNum(mix[p.id], 0.2);
    if (share > dominantShare) {
      dominantShare = share;
      dominantPartnerId = p.id;
    }
  });

  const hhi = GTEL_PARTNER_DEFS.filter(p => p.id !== 'domestic_premium').reduce(
    (acc, p) => acc + gtelNum(mix[p.id], 0.2) ** 2,
    0,
  );
  const concentrationIndex = gtelClamp(hhi * 1.35 + (dominantShare > 0.45 ? (dominantShare - 0.45) * 0.6 : 0), 0.08, 0.95);
  const band = diversificationBand(concentrationIndex);
  const blockedDominant =
    dominantPartnerId &&
    input.partners.find(p => p.id === dominantPartnerId && (p.access === 'blocked' || p.access === 'restricted'));
  const summary =
    band === 'well_spread'
      ? 'Export demand is spread across multiple partner basins.'
      : band === 'critical' || blockedDominant
        ? `Partner concentration is acute${dominantPartnerId ? ` (${dominantPartnerId.replace(/_/g, ' ')})` : ''}; diversification risk is elevated.`
        : 'Export receipts lean on a narrow set of partner lanes.';

  return {
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    band,
    dominantPartnerId,
    effectivePartnerCount: effectivePartnerCount(mix),
    summary,
  };
}

export function deriveDiversificationPartnerModifiers(snapshot: GTELMarketDiversificationSnapshot): {
  partnerDeltas: Partial<Record<GTELPartnerId, number>>;
  domesticStress: number;
} {
  const partnerDeltas: Partial<Record<GTELPartnerId, number>> = {};
  if (snapshot.band === 'well_spread') {
    return { partnerDeltas, domesticStress: 0 };
  }
  const penalty = snapshot.band === 'critical' ? -0.06 : snapshot.band === 'concentrated' ? -0.035 : -0.015;
  if (snapshot.dominantPartnerId) {
    partnerDeltas[snapshot.dominantPartnerId] = penalty;
  }
  const domesticStress =
    snapshot.band === 'critical' ? 0.06 : snapshot.band === 'concentrated' ? 0.035 : 0.015;
  return { partnerDeltas, domesticStress };
}

export function diversificationWorldEvent(
  snapshot: GTELMarketDiversificationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'critical') return null;
  return {
    id: `gtel_diversification_${turn}`,
    turn,
    kind: 'trade',
    title: 'Export partner concentration alarm',
    summary: snapshot.summary,
    regionIds: ['WA', 'QLD', 'NSW'],
  };
}

export function marketDiversificationGiNotes(
  diversification: GTELMarketDiversificationSnapshot | null | undefined,
): string[] {
  if (!diversification) return [];
  return [
    `Market diversification: ${diversification.band.replace(/_/g, ' ')} (concentration ${Math.round(diversification.concentrationIndex * 100)}%).`,
    diversification.summary,
  ];
}
