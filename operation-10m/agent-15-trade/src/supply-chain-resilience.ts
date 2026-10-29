import type {
  GTELImportDependencySnapshot,
  GTELLogisticsStress,
  GTELMarketDiversificationSnapshot,
  GTELPersisted,
  GTELSupplyChainResilienceSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELSupplyChainBand = GTELSupplyChainResilienceSnapshot['band'];

function resilienceBand(score: number): GTELSupplyChainBand {
  if (score >= 0.72) return 'robust';
  if (score >= 0.52) return 'adaptive';
  if (score >= 0.32) return 'fragile';
  return 'brittle';
}

export function sanitizeSupplyChainResilienceSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.58), 0.15, 0.95);
}

export function createEmptySupplyChainResilienceSnapshot(): GTELSupplyChainResilienceSnapshot {
  return {
    score: 0.58,
    band: 'adaptive',
    chokepointCount: 0,
    redundancyIndex: 0.55,
    summary: 'Supply chains retain baseline redundancy.',
  };
}

export function advanceSupplyChainResilienceSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeSupplyChainResilienceSmoothing(persisted.supplyChainResilienceSmoothing);
  const next = gtelClamp(prev * 0.74 + gtelClamp(rawScore, 0.12, 0.92) * 0.26, 0.15, 0.95);
  return { ...persisted, supplyChainResilienceSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeSupplyChainResilienceSnapshot(input: {
  logistics: GTELLogisticsStress;
  marketDiversification: GTELMarketDiversificationSnapshot;
  importDependency: GTELImportDependencySnapshot;
  openDisputeCount: number;
  persisted: GTELPersisted;
}): { snapshot: GTELSupplyChainResilienceSnapshot; persisted: GTELPersisted } {
  const logisticsScore =
    input.logistics.band === 'fluid'
      ? 0.82
      : input.logistics.band === 'watch'
        ? 0.68
        : input.logistics.band === 'tight'
          ? 0.48
          : 0.28;
  const diversificationScore =
    input.marketDiversification.band === 'well_spread'
      ? 0.85
      : input.marketDiversification.band === 'moderate'
        ? 0.62
        : input.marketDiversification.band === 'concentrated'
          ? 0.38
          : 0.22;
  const importScore = gtelClamp(1 - input.importDependency.aggregateRisk * 0.95, 0.15, 0.88);
  const disputePenalty = gtelClamp(input.openDisputeCount * 0.06, 0, 0.22);
  const redundancyIndex = gtelClamp(
    logisticsScore * 0.38 + diversificationScore * 0.32 + importScore * 0.3 + input.logistics.redundancyScore * 0.12,
    0.12,
    0.92,
  );
  const rawScore = gtelClamp(redundancyIndex - disputePenalty, 0.1, 0.9);
  const persisted = advanceSupplyChainResilienceSmoothing(input.persisted, rawScore);
  const score = sanitizeSupplyChainResilienceSmoothing(persisted.supplyChainResilienceSmoothing);
  const band = resilienceBand(score);
  const chokepointCount =
    (input.logistics.band === 'congested' || input.logistics.band === 'tight' ? 1 : 0) +
    (input.marketDiversification.band === 'critical' || input.marketDiversification.band === 'concentrated' ? 1 : 0) +
    (input.importDependency.band === 'critical' || input.importDependency.band === 'elevated' ? 1 : 0) +
    (input.openDisputeCount >= 2 ? 1 : 0);
  const summary =
    band === 'robust'
      ? 'Multiple lanes and partner basins absorb shocks without systemic chokepoints.'
      : band === 'brittle'
        ? 'Supply chains are one disruption away from cascading delays across import-exposed sectors.'
        : band === 'fragile'
          ? 'Redundancy is thin — logistics or partner shocks will propagate quickly.'
          : 'Supply chains are coping but lack deep buffers.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      chokepointCount,
      redundancyIndex: Math.round(redundancyIndex * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function supplyChainResilienceExportScale(
  snapshot: GTELSupplyChainResilienceSnapshot | null | undefined,
): number {
  if (!snapshot) return 1;
  return gtelClamp(0.82 + snapshot.score * 0.22, 0.78, 1.06);
}

export function supplyChainResilienceDomesticStress(
  snapshot: GTELSupplyChainResilienceSnapshot | null | undefined,
): number {
  if (!snapshot) return 0;
  return gtelClamp((0.62 - snapshot.score) * 0.18, 0, 0.1);
}

export function supplyChainResilienceWorldEvent(
  snapshot: GTELSupplyChainResilienceSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'brittle' || snapshot.chokepointCount < 2) return null;
  return {
    id: `gtel_supply_chain_${turn}`,
    turn,
    kind: 'trade',
    title: 'Supply chain redundancy alarm',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'VIC'],
  };
}

export function supplyChainResilienceGiNotes(
  resilience: GTELSupplyChainResilienceSnapshot | null | undefined,
): string[] {
  if (!resilience) return [];
  return [
    `Supply chain resilience: ${resilience.band.replace(/_/g, ' ')} (score ${Math.round(resilience.score * 100)}%).`,
    resilience.summary,
  ];
}
