import type {
  GTELDiplomaticTradeCoherenceSnapshot,
  GTELExportInsuranceStackSnapshot,
  GTELPersisted,
  GTELSupplyChainResilienceSnapshot,
  GTELTradeFxHedgingSnapshot,
  GTELTradeShockAbsorptionSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeShockAbsorptionBand = GTELTradeShockAbsorptionSnapshot['band'];

function absorptionBand(capacity: number): GTELTradeShockAbsorptionBand {
  if (capacity >= 0.74) return 'deep';
  if (capacity >= 0.52) return 'moderate';
  if (capacity >= 0.32) return 'thin';
  return 'exhausted';
}

export function sanitizeTradeShockAbsorptionSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.54), 0.18, 0.92);
}

export function createEmptyTradeShockAbsorptionSnapshot(): GTELTradeShockAbsorptionSnapshot {
  return {
    capacity: 0.54,
    band: 'moderate',
    resilienceBuffer: 0.12,
    hedgingBuffer: 0.1,
    summary: 'Trade shock buffers are moderately stocked across finance and logistics layers.',
  };
}

export function advanceTradeShockAbsorptionSmoothing(
  persisted: GTELPersisted,
  rawCapacity: number,
): GTELPersisted {
  const prev = sanitizeTradeShockAbsorptionSmoothing(persisted.tradeShockAbsorptionSmoothing);
  const next = gtelClamp(prev * 0.72 + gtelClamp(rawCapacity, 0.18, 0.92) * 0.28, 0.18, 0.92);
  return { ...persisted, tradeShockAbsorptionSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeShockAbsorptionSnapshot(input: {
  supplyChainResilience: GTELSupplyChainResilienceSnapshot;
  tradeFxHedging: GTELTradeFxHedgingSnapshot;
  exportInsuranceStack: GTELExportInsuranceStackSnapshot;
  diplomaticTradeCoherence: GTELDiplomaticTradeCoherenceSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeShockAbsorptionSnapshot; persisted: GTELPersisted } {
  const resilienceLift = gtelClamp(input.supplyChainResilience.score * 0.28, 0.06, 0.22);
  const hedgingLift = gtelClamp((input.tradeFxHedging.effectiveness - 0.45) * 0.22, -0.04, 0.14);
  const insuranceLift =
    input.exportInsuranceStack.band === 'robust'
      ? 0.12
      : input.exportInsuranceStack.band === 'impaired'
        ? -0.1
        : 0.04;
  const coherenceLift =
    input.diplomaticTradeCoherence.band === 'aligned'
      ? 0.1
      : input.diplomaticTradeCoherence.band === 'divergent'
        ? -0.08
        : 0.03;
  const rawCapacity = gtelClamp(0.4 + resilienceLift + hedgingLift + insuranceLift + coherenceLift, 0.18, 0.92);
  const persisted = advanceTradeShockAbsorptionSmoothing(input.persisted, rawCapacity);
  const capacity = sanitizeTradeShockAbsorptionSmoothing(persisted.tradeShockAbsorptionSmoothing);
  const band = absorptionBand(capacity);
  const resilienceBuffer = gtelClamp(input.supplyChainResilience.redundancyIndex * 0.18 + resilienceLift, 0.04, 0.22);
  const hedgingBuffer = gtelClamp(input.tradeFxHedging.passThroughBuffer + hedgingLift * 0.5, 0.03, 0.2);

  const summary =
    band === 'deep'
      ? 'Layered hedges and redundancy are absorbing external trade shocks without rationing exports.'
      : band === 'exhausted'
        ? 'Shock buffers are exhausted — the next disruption will pass straight into quotes and partner gates.'
        : band === 'thin'
          ? 'Shock absorption capacity is thin; planners should expect volatile export outcomes.'
          : 'Trade shock buffers are moderately stocked across finance and logistics layers.';

  return {
    snapshot: {
      capacity: Math.round(capacity * 1000) / 1000,
      band,
      resilienceBuffer: Math.round(resilienceBuffer * 1000) / 1000,
      hedgingBuffer: Math.round(hedgingBuffer * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeShockAbsorptionDomesticStressRelief(snapshot: GTELTradeShockAbsorptionSnapshot): number {
  if (snapshot.band === 'deep') return gtelClamp(snapshot.capacity * 0.05, 0.02, 0.04);
  if (snapshot.band === 'moderate') return gtelClamp(snapshot.capacity * 0.03, 0, 0.025);
  return 0;
}

export function tradeShockAbsorptionExportScale(snapshot: GTELTradeShockAbsorptionSnapshot): number {
  if (snapshot.band === 'deep') return gtelClamp(1 + snapshot.capacity * 0.025, 1, 1.03);
  if (snapshot.band === 'exhausted') return gtelClamp(0.9 + snapshot.capacity * 0.06, 0.86, 0.94);
  if (snapshot.band === 'thin') return gtelClamp(0.94 + snapshot.capacity * 0.04, 0.9, 0.98);
  return gtelClamp(0.97 + snapshot.capacity * 0.02, 0.94, 1.02);
}

export function tradeShockAbsorptionWorldEvent(
  snapshot: GTELTradeShockAbsorptionSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'thin' && snapshot.band !== 'exhausted') return null;
  if (snapshot.capacity > 0.38) return null;
  return {
    id: `gtel_shock_absorb_${turn}`,
    turn,
    kind: 'trade',
    title: 'Trade shock buffers thinning',
    summary: snapshot.summary,
    regionIds: ['NSW', 'QLD', 'WA'],
  };
}

export function tradeShockAbsorptionGiNotes(
  absorption: GTELTradeShockAbsorptionSnapshot | null | undefined,
): string[] {
  if (!absorption) return [];
  return [
    `Trade shock absorption: ${absorption.band} (${Math.round(absorption.capacity * 100)}% capacity).`,
    absorption.summary,
  ];
}
