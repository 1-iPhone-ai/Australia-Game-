import type {
  GTELBilateralCommitmentLoopReopenGateSnapshot,
  GTELBilateralLoopResumptionGateSnapshot,
  GTELForwardCycleAdvanceContinuitySnapshot,
  GTELPersisted,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELBilateralCommitmentLoopReopenGateBand = GTELBilateralCommitmentLoopReopenGateSnapshot['band'];

function reopenBand(score: number): GTELBilateralCommitmentLoopReopenGateBand {
  if (score >= 0.94) return 'reopened';
  if (score >= 0.74) return 'unlocking';
  if (score >= 0.56) return 'latched';
  return 'sealed';
}

export function sanitizeBilateralCommitmentLoopReopenGateSmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyBilateralCommitmentLoopReopenGateSnapshot(): GTELBilateralCommitmentLoopReopenGateSnapshot {
  return {
    score: 0.52,
    band: 'unlocking',
    continuityAnchor: 0.1,
    loopLift: 0.08,
    summary: 'Commitment loop reopen gate is unlocking locked-in advance continuity.',
  };
}

export function advanceBilateralCommitmentLoopReopenGateSmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeBilateralCommitmentLoopReopenGateSmoothing(
    persisted.bilateralCommitmentLoopReopenGateSmoothing,
  );
  const next = gtelClamp(prev * 0.39 + gtelClamp(rawScore, 0.16, 0.92) * 0.61, 0.16, 0.92);
  return {
    ...persisted,
    bilateralCommitmentLoopReopenGateSmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeBilateralCommitmentLoopReopenGateSnapshot(input: {
  forwardCycleAdvanceContinuity: GTELForwardCycleAdvanceContinuitySnapshot;
  bilateralLoopResumptionGate: GTELBilateralLoopResumptionGateSnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELBilateralCommitmentLoopReopenGateSnapshot; persisted: GTELPersisted } {
  const continuityAnchor =
    input.forwardCycleAdvanceContinuity.band === 'locked_in'
      ? 0.17
      : input.forwardCycleAdvanceContinuity.band === 'tracking'
        ? 0.08
        : input.forwardCycleAdvanceContinuity.band === 'wavering'
          ? -0.04
          : -0.11;
  const loopLift =
    input.bilateralLoopResumptionGate.band === 'resumed'
      ? 0.16
      : input.bilateralLoopResumptionGate.band === 'closed'
        ? -0.09
        : 0.06;
  const rawScore = gtelClamp(
    input.forwardCycleAdvanceContinuity.score * 0.5 +
      input.bilateralLoopResumptionGate.score * 0.26 +
      continuityAnchor +
      loopLift,
    0.16,
    0.92,
  );
  const persisted = advanceBilateralCommitmentLoopReopenGateSmoothing(input.persisted, rawScore);
  const score = sanitizeBilateralCommitmentLoopReopenGateSmoothing(
    persisted.bilateralCommitmentLoopReopenGateSmoothing,
  );
  const band = reopenBand(score);

  const summary =
    band === 'reopened'
      ? 'Bilateral commitment loop reopen gate is open — locked-in advance continuity meets resumed loop.'
      : band === 'sealed'
        ? 'Loop reopen sealed; broken continuity and closed resumption blocked the next arc.'
        : band === 'latched'
          ? 'Reopen latched — loop resumption is lagging advance continuity.'
          : 'Commitment loop reopen gate is unlocking locked-in advance continuity.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      continuityAnchor: Math.round(continuityAnchor * 1000) / 1000,
      loopLift: Math.round(loopLift * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function bilateralCommitmentLoopReopenGateExportScale(
  snapshot: GTELBilateralCommitmentLoopReopenGateSnapshot,
): number {
  if (snapshot.band === 'reopened') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.007);
  if (snapshot.band === 'sealed') return gtelClamp(0.963 + snapshot.score * 0.006, 0.957, 0.975);
  if (snapshot.band === 'latched') return gtelClamp(0.992 + snapshot.score * 0.001, 0.987, 0.995);
  return gtelClamp(0.985 + snapshot.score * 0.001, 0.95, 1.02);
}

export function bilateralCommitmentLoopReopenGateDomesticStressRelief(
  snapshot: GTELBilateralCommitmentLoopReopenGateSnapshot,
): number {
  if (snapshot.band === 'reopened') return gtelClamp(snapshot.score * 0.016, 0.004, 0.02);
  if (snapshot.band === 'unlocking') return gtelClamp(snapshot.score * 0.006, 0, 0.007);
  return 0;
}

export function bilateralCommitmentLoopReopenGateWorldEvent(
  snapshot: GTELBilateralCommitmentLoopReopenGateSnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'sealed' && snapshot.band !== 'latched') return null;
  if (snapshot.continuityAnchor > -0.02) return null;
  return {
    id: `gtel_loop_reopen_${turn}`,
    turn,
    kind: 'trade',
    title: 'Commitment loop reopen constrained',
    summary: snapshot.summary,
    regionIds: ['QLD', 'SA', 'NSW'],
  };
}

export function bilateralCommitmentLoopReopenGateGiNotes(
  snapshot: GTELBilateralCommitmentLoopReopenGateSnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Bilateral commitment loop reopen gate: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
