import type {
  GTELBilateralCargoSchedulingSnapshot,
  GTELBilateralSettlementReconciliationSnapshot,
  GTELForwardSlotRolloverSnapshot,
  GTELPersisted,
  GTELTradeThroughputOrchestrationSnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralSettlementReconciliationBand = GTELBilateralSettlementReconciliationSnapshot['band'];

function settlementBand(score: number): GTELBilateralSettlementReconciliationBand {
  if (score >= 0.76) return 'settled';
  if (score >= 0.56) return 'reconciling';
  if (score >= 0.38) return 'disputed';
  return 'unsettled';
}

export function sanitizeBilateralSettlementReconciliationSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralSettlementReconciliationSnapshot(): GTELBilateralSettlementReconciliationSnapshot {
  return {
    score: 0.52,
    band: 'reconciling',
    rolloverAlignment: 0.12,
    schedulingSupport: 0.08,
    summary: 'Bilateral settlement is reconciling rolled slots against throughput orchestration.',
  };
}

export function advanceBilateralSettlementReconciliationSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralSettlementReconciliationSmoothing(
    persisted.bilateralSettlementReconciliationSmoothing,
  );
  const next = gtelClamp(prev * 0.65 + gtelClamp(rawScore, 0.16, 0.92) * 0.35, 0.16, 0.92);
  return { ...persisted, bilateralSettlementReconciliationSmoothing: Math.round(next * 1000) / 1000 };
}

export function computeBilateralSettlementReconciliationSnapshot(input: {
  forwardSlotRollover: GTELForwardSlotRolloverSnapshot;
  bilateralCargoScheduling: GTELBilateralCargoSchedulingSnapshot;
  tradeThroughputOrchestration: GTELTradeThroughputOrchestrationSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralSettlementReconciliationSnapshot; persisted: GTELPersisted } {
  const rolloverAlignment = gtelClamp(
    input.forwardSlotRollover.score * 0.55 + (1 - input.forwardSlotRollover.openSlotCarry) * 0.25,
    0.12,
    0.88,
  );
  const schedulingSupport =
    input.bilateralCargoScheduling.band === 'on_schedule'
      ? 0.14
      : input.bilateralCargoScheduling.band === 'slipping'
        ? 0.05
        : input.bilateralCargoScheduling.band === 'backlogged'
          ? -0.05
          : -0.1;
  const orchestrationLift =
    input.tradeThroughputOrchestration.band === 'fluid'
      ? 0.12
      : input.tradeThroughputOrchestration.band === 'stalled'
        ? -0.09
        : 0.04;
  const rawScore = gtelClamp(
    rolloverAlignment * 0.44 +
      input.bilateralCargoScheduling.score * 0.28 +
      input.tradeThroughputOrchestration.score * 0.16 +
      schedulingSupport +
      orchestrationLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralSettlementReconciliationSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralSettlementReconciliationSmoothing(
    persisted.bilateralSettlementReconciliationSmoothing,
  );
  const band = settlementBand(score);

  const summary =
    band === 'settled'
      ? 'Bilateral settlement is settled — rolled slots match orchestrated throughput for the turn.'
      : band === 'unsettled'
        ? 'Settlement remains unsettled; rollover carry is diverging from orchestrated throughput.'
        : band === 'disputed'
          ? 'Settlement is disputed — scheduling and rollover books disagree on realized slots.'
          : 'Bilateral settlement is reconciling rolled slots against throughput orchestration.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      rolloverAlignment: Math.round(rolloverAlignment * 1000) / 1000,
      schedulingSupport: Math.round(schedulingSupport * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralSettlementReconciliationExportScale(
  snapshot: GTELBilateralSettlementReconciliationSnapshot,
): number {
  if (snapshot.band === 'settled') return gtelClamp(1 + snapshot.score * 0.018, 1, 1.024);
  if (snapshot.band === 'unsettled') return gtelClamp(0.88 + snapshot.score * 0.055, 0.86, 0.94);
  if (snapshot.band === 'disputed') return gtelClamp(0.94 + snapshot.score * 0.04, 0.91, 0.98);
  return gtelClamp(0.97 + snapshot.score * 0.013, 0.94, 1.02);
}

export function bilateralSettlementReconciliationDomesticStressRelief(
  snapshot: GTELBilateralSettlementReconciliationSnapshot,
): number {
  if (snapshot.band === 'settled') return gtelClamp(snapshot.score * 0.03, 0.01, 0.036);
  if (snapshot.band === 'reconciling') return gtelClamp(snapshot.score * 0.016, 0, 0.018);
  return 0;
}

export function bilateralSettlementReconciliationWorldEvent(
  snapshot: GTELBilateralSettlementReconciliationSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'unsettled' && snapshot.band !== 'disputed') return null;
  if (snapshot.rolloverAlignment > 0.48) return null;
  return {
    id: `gtel_settlement_${turn}`,
    turn,
    kind: 'trade',
    title: 'Bilateral settlement reconciliation gap',
    summary: snapshot.summary,
    regionIds: ['QLD', 'SA', 'NSW'],
  };
}

export function bilateralSettlementReconciliationGiNotes(
  snapshot: GTELBilateralSettlementReconciliationSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral settlement reconciliation: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
