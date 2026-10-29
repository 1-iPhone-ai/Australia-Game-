import type {
  GTELBilateralSettlementReconciliationSnapshot,
  GTELForwardSlotRolloverSnapshot,
  GTELPersisted,
  GTELTradeSettlementContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELTradeSettlementContinuityBand = GTELTradeSettlementContinuitySnapshot['band'];

function continuityBand(score: number): GTELTradeSettlementContinuityBand {
  if (score >= 0.77) return 'anchored';
  if (score >= 0.57) return 'tracking';
  if (score >= 0.39) return 'drifting';
  return 'broken';
}

export function sanitizeTradeSettlementContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyTradeSettlementContinuitySnapshot(): GTELTradeSettlementContinuitySnapshot {
  return {
    score: 0.52,
    band: 'tracking',
    settlementCarry: 0.12,
    rolloverSupport: 0.08,
    summary: 'Settlement continuity is tracking rollover carry into the next book window.',
  };
}

export function advanceTradeSettlementContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeTradeSettlementContinuitySmoothing(persisted.tradeSettlementContinuitySmoothing);
  const next = gtelClamp(prev * 0.64 + gtelClamp(rawScore, 0.16, 0.92) * 0.36, 0.16, 0.92);
  return { ...persisted, tradeSettlementContinuitySmoothing: Math.round(next * 1000) / 1000 };
}

export function computeTradeSettlementContinuitySnapshot(input: {
  bilateralSettlementReconciliation: GTELBilateralSettlementReconciliationSnapshot;
  forwardSlotRollover: GTELForwardSlotRolloverSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELTradeSettlementContinuitySnapshot; persisted: GTELPersisted } {
  const settlementCarry = gtelClamp(
    input.bilateralSettlementReconciliation.rolloverAlignment * 0.55 +
      input.forwardSlotRollover.openSlotCarry * 0.35,
    0.1,
    0.72,
  );
  const rolloverSupport =
    input.forwardSlotRollover.band === 'seamless'
      ? 0.15
      : input.forwardSlotRollover.band === 'partial'
        ? 0.07
        : input.forwardSlotRollover.band === 'lumpy'
          ? -0.05
          : -0.12;
  const settlementLift =
    input.bilateralSettlementReconciliation.band === 'settled'
      ? 0.14
      : input.bilateralSettlementReconciliation.band === 'unsettled'
        ? -0.1
        : 0.05;
  const rawScore = gtelClamp(
    (1 - settlementCarry) * 0.38 +
      input.bilateralSettlementReconciliation.score * 0.34 +
      input.forwardSlotRollover.score * 0.16 +
      rolloverSupport +
      settlementLift,
    0.16,
    0.92,
  );
  const persisted = advanceTradeSettlementContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeTradeSettlementContinuitySmoothing(persisted.tradeSettlementContinuitySmoothing);
  const band = continuityBand(score);

  const summary =
    band === 'anchored'
      ? 'Settlement continuity is anchored — rollover and reconciliation carry cleanly forward.'
      : band === 'broken'
        ? 'Settlement continuity is broken; rolled slots are diverging from reconciled books.'
        : band === 'drifting'
          ? 'Continuity is drifting — settlement carry is lagging rollover headroom.'
          : 'Settlement continuity is tracking rollover carry into the next book window.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      settlementCarry: Math.round(settlementCarry * 1000) / 1000,
      rolloverSupport: Math.round(rolloverSupport * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function tradeSettlementContinuityExportScale(snapshot: GTELTradeSettlementContinuitySnapshot): number {
  if (snapshot.band === 'anchored') return gtelClamp(1 + snapshot.score * 0.017, 1, 1.023);
  if (snapshot.band === 'broken') return gtelClamp(0.88 + snapshot.score * 0.05, 0.86, 0.94);
  if (snapshot.band === 'drifting') return gtelClamp(0.94 + snapshot.score * 0.038, 0.91, 0.98);
  return gtelClamp(0.97 + snapshot.score * 0.012, 0.94, 1.02);
}

export function tradeSettlementContinuityDomesticStress(snapshot: GTELTradeSettlementContinuitySnapshot): number {
  if (snapshot.band === 'broken') return gtelClamp((0.35 - snapshot.score) * 0.09, 0.018, 0.06);
  if (snapshot.band === 'drifting') return gtelClamp((0.48 - snapshot.score) * 0.055, 0.008, 0.035);
  return 0;
}

export function tradeSettlementContinuityWorldEvent(
  snapshot: GTELTradeSettlementContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'broken' && snapshot.band !== 'drifting') return null;
  if (snapshot.settlementCarry < 0.24) return null;
  return {
    id: `gtel_settlement_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Settlement continuity strain',
    summary: snapshot.summary,
    regionIds: ['WA', 'NSW', 'QLD'],
  };
}

export function tradeSettlementContinuityGiNotes(
  snapshot: GTELTradeSettlementContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Trade settlement continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
