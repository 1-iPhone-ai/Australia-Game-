import type { BatchAdvanceResult } from './batch-advance.js';
import type { BatchStabilizationQueueCapture } from './batch-stabilization-queue-capture.js';
import { countAgent02QueueDepth } from './agent02-stabilization-inference.js';
import {
  normalizeExternalStabilizationSignals,
  type ExternalStabilizationTurnSignals,
} from './external-stabilization-signals.js';

export interface StabilizationCalmStreakViolation {
  priorTurn: number;
  turnIndex: number;
  code: 'sustained_calm_over_rebound';
}

export interface StabilizationCalmStreakGateResult {
  calmStreakLength: number;
  violations: StabilizationCalmStreakViolation[];
  ok: boolean;
}

/**
 * Round 13: consecutive Agent 05 calm flags cannot span a queue rebound between stepped turns.
 */
export function gateStabilizationCalmStreak(
  batch: BatchAdvanceResult,
  capture: BatchStabilizationQueueCapture,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): StabilizationCalmStreakGateResult {
  const steppedTurns: number[] = [];
  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    steppedTurns.push(step.clockBefore.turnIndex);
  }

  const violations: StabilizationCalmStreakViolation[] = [];
  let calmStreakLength = 0;

  for (let i = 0; i < steppedTurns.length; i += 1) {
    const turn = steppedTurns[i]!;
    const calm = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]).postQueueCalm;
    if (calm) calmStreakLength += 1;
    else calmStreakLength = 0;

    if (i === 0) continue;
    const priorTurn = steppedTurns[i - 1]!;
    const priorCalm = normalizeExternalStabilizationSignals(stabilizationByTurn[priorTurn]).postQueueCalm;
    if (!priorCalm || !calm) continue;

    const afterPrior = capture.queueAfterByTurn[priorTurn];
    const beforeTurn = capture.queueBeforeByTurn[turn];
    if (!afterPrior || !beforeTurn) continue;

    if (countAgent02QueueDepth(beforeTurn) > countAgent02QueueDepth(afterPrior)) {
      violations.push({ priorTurn, turnIndex: turn, code: 'sustained_calm_over_rebound' });
    }
  }

  return { calmStreakLength, violations, ok: violations.length === 0 };
}
