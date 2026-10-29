import type { BatchAdvanceResult } from './batch-advance.js';
import type { BatchStabilizationQueueCapture } from './batch-stabilization-queue-capture.js';
import { countAgent02QueueDepth } from './agent02-stabilization-inference.js';
import {
  normalizeExternalStabilizationSignals,
  type ExternalStabilizationTurnSignals,
} from './external-stabilization-signals.js';

export interface StabilizationBacklogReboundRow {
  priorTurn: number;
  turnIndex: number;
  backlogAfterPrior: number;
  backlogBeforeTurn: number;
  externalCalmOnTurn: boolean;
}

export interface StabilizationBacklogReboundGateResult {
  rows: StabilizationBacklogReboundRow[];
  reboundTurns: number[];
  ok: boolean;
}

/**
 * Agent 05 clears post-queue calm when backlog returns — calm must not persist on a rebound turn.
 */
export function gateStabilizationBacklogRebound(
  batch: BatchAdvanceResult,
  capture: BatchStabilizationQueueCapture,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): StabilizationBacklogReboundGateResult {
  const steppedTurns: number[] = [];
  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    steppedTurns.push(step.clockBefore.turnIndex);
  }

  const rows: StabilizationBacklogReboundRow[] = [];
  const reboundTurns: number[] = [];

  for (let i = 1; i < steppedTurns.length; i += 1) {
    const priorTurn = steppedTurns[i - 1]!;
    const turn = steppedTurns[i]!;
    const afterPrior = capture.queueAfterByTurn[priorTurn];
    const beforeTurn = capture.queueBeforeByTurn[turn];
    if (!afterPrior || !beforeTurn) continue;

    const backlogAfterPrior = countAgent02QueueDepth(afterPrior);
    const backlogBeforeTurn = countAgent02QueueDepth(beforeTurn);
    const external = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
    const rebound = backlogBeforeTurn > backlogAfterPrior;
    rows.push({
      priorTurn,
      turnIndex: turn,
      backlogAfterPrior,
      backlogBeforeTurn,
      externalCalmOnTurn: external.postQueueCalm,
    });
    if (rebound && external.postQueueCalm) {
      reboundTurns.push(turn);
    }
  }

  return { rows, reboundTurns, ok: reboundTurns.length === 0 };
}
