import type {
  GTELBilateralCommitmentLoopReopenGateSnapshot,
  GTELForwardCycleAdvanceContinuitySnapshot,
  GTELPersisted,
  GTELReopenedCommitmentLoopContinuitySnapshot,
  GTELTurnResult,
} from './types.ts';
import { gtelClamp, gtelNum } from './util.ts';

export type GTELReopenedCommitmentLoopContinuityBand = GTELReopenedCommitmentLoopContinuitySnapshot['band'];

function loopContinuityBand(score: number): GTELReopenedCommitmentLoopContinuityBand {
  if (score >= 0.93) return 'stable';
  if (score >= 0.73) return 'linked';
  if (score >= 0.55) return 'fraying';
  return 'cut';
}

export function sanitizeReopenedCommitmentLoopContinuitySmoothing(raw: unknown): number {
  return gtelClamp(gtelNum(raw, 0.52), 0.16, 0.92);
}

export function createEmptyReopenedCommitmentLoopContinuitySnapshot(): GTELReopenedCommitmentLoopContinuitySnapshot {
  return {
    score: 0.52,
    band: 'linked',
    reopenSupport: 0.1,
    advanceAnchor: 0.08,
    summary: 'Reopened commitment loop continuity is linking reopen gate to advance anchor.',
  };
}

export function advanceReopenedCommitmentLoopContinuitySmoothing(
  persisted: GTELPersisted,
  rawScore: number,
): GTELPersisted {
  const prev = sanitizeReopenedCommitmentLoopContinuitySmoothing(
    persisted.reopenedCommitmentLoopContinuitySmoothing,
  );
  const next = gtelClamp(prev * 0.38 + gtelClamp(rawScore, 0.16, 0.92) * 0.62, 0.16, 0.92);
  return {
    ...persisted,
    reopenedCommitmentLoopContinuitySmoothing: Math.round(next * 1000) / 1000,
  };
}

export function computeReopenedCommitmentLoopContinuitySnapshot(input: {
  bilateralCommitmentLoopReopenGate: GTELBilateralCommitmentLoopReopenGateSnapshot;
  forwardCycleAdvanceContinuity: GTELForwardCycleAdvanceContinuitySnapshot;
  persisted: GTELPersisted;
}): { snapshot: GTELReopenedCommitmentLoopContinuitySnapshot; persisted: GTELPersisted } {
  const reopenSupport =
    input.bilateralCommitmentLoopReopenGate.band === 'reopened'
      ? 0.18
      : input.bilateralCommitmentLoopReopenGate.band === 'unlocking'
        ? 0.08
        : input.bilateralCommitmentLoopReopenGate.band === 'latched'
          ? -0.04
          : -0.11;
  const advanceAnchor =
    input.forwardCycleAdvanceContinuity.band === 'locked_in'
      ? 0.15
      : input.forwardCycleAdvanceContinuity.band === 'broken'
        ? -0.09
        : 0.05;
  const rawScore = gtelClamp(
    input.bilateralCommitmentLoopReopenGate.score * 0.51 +
      input.forwardCycleAdvanceContinuity.score * 0.25 +
      reopenSupport +
      advanceAnchor,
    0.16,
    0.92,
  );
  const persisted = advanceReopenedCommitmentLoopContinuitySmoothing(input.persisted, rawScore);
  const score = sanitizeReopenedCommitmentLoopContinuitySmoothing(
    persisted.reopenedCommitmentLoopContinuitySmoothing,
  );
  const band = loopContinuityBand(score);

  const summary =
    band === 'stable'
      ? 'Reopened loop continuity is stable — reopen gate and locked-in advance stay aligned.'
      : band === 'cut'
        ? 'Loop continuity cut; sealed reopen and broken advance diverged.'
        : band === 'fraying'
          ? 'Continuity is fraying — advance anchor is lagging reopen support.'
          : 'Reopened commitment loop continuity is linking reopen gate to advance anchor.';

  return {
    snapshot: {
      score: Math.round(score * 1000) / 1000,
      band,
      reopenSupport: Math.round(reopenSupport * 1000) / 1000,
      advanceAnchor: Math.round(advanceAnchor * 1000) / 1000,
      summary,
    },
    persisted,
  };
}

export function reopenedCommitmentLoopContinuityExportScale(
  snapshot: GTELReopenedCommitmentLoopContinuitySnapshot,
): number {
  if (snapshot.band === 'stable') return gtelClamp(1 + snapshot.score * 0.002, 1, 1.006);
  if (snapshot.band === 'cut') return gtelClamp(0.962 + snapshot.score * 0.005, 0.956, 0.974);
  if (snapshot.band === 'fraying') return gtelClamp(0.993 + snapshot.score * 0.001, 0.988, 0.996);
  return gtelClamp(0.984 + snapshot.score * 0.001, 0.95, 1.02);
}

export function reopenedCommitmentLoopContinuityDomesticStress(
  snapshot: GTELReopenedCommitmentLoopContinuitySnapshot,
): number {
  if (snapshot.band === 'cut') return gtelClamp((0.27 - snapshot.score) * 0.034, 0.003, 0.017);
  if (snapshot.band === 'fraying') return gtelClamp((0.39 - snapshot.score) * 0.014, 0.001, 0.007);
  return 0;
}

export function reopenedCommitmentLoopContinuityWorldEvent(
  snapshot: GTELReopenedCommitmentLoopContinuitySnapshot,
  turn: number,
): GTELTurnResult['worldEvents'][0] | null {
  if (snapshot.band !== 'cut' && snapshot.band !== 'fraying') return null;
  if (snapshot.reopenSupport > -0.02) return null;
  return {
    id: `gtel_reopen_cont_${turn}`,
    turn,
    kind: 'trade',
    title: 'Reopened loop continuity strain',
    summary: snapshot.summary,
    regionIds: ['VIC', 'NSW', 'QLD'],
  };
}

export function reopenedCommitmentLoopContinuityGiNotes(
  snapshot: GTELReopenedCommitmentLoopContinuitySnapshot | null | undefined,
): string[] {
  if (!snapshot) return [];
  return [
    `Reopened commitment loop continuity: ${snapshot.band} (${Math.round(snapshot.score * 100)}% score).`,
    snapshot.summary,
  ];
}
