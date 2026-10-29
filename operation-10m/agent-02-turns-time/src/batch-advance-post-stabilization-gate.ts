import type { BatchAdvanceResult } from './batch-advance.js';
import { TurnTimeSnapshot } from './types.js';
import {
  inferFullAgent02StabilizationSignals,
  queueDepthFromSnapshot,
} from './agent02-stabilization-inference.js';
import {
  externalStabilizationSignalsEqual,
  normalizeExternalStabilizationSignals,
  type ExternalStabilizationTurnSignals,
} from './external-stabilization-signals.js';
import type { BatchStabilizationQueueCapture } from './batch-stabilization-queue-capture.js';

export interface BatchAdvancePostStabilizationGateResult {
  lastSteppedTurn?: number;
  external?: ExternalStabilizationTurnSignals;
  inferred?: ExternalStabilizationTurnSignals;
  ok: boolean;
}

/**
 * Round 12: after batch, last stepped turn's Agent 05 flags must match final queue snapshot.
 */
export function gateBatchAdvancePostStabilization(
  finalSnapshot: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
  capture: BatchStabilizationQueueCapture,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
): BatchAdvancePostStabilizationGateResult {
  let lastStep: (typeof batch.steps)[number] | undefined;
  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    lastStep = step;
  }
  if (!lastStep) {
    return { ok: true };
  }

  const turn = lastStep.clockBefore.turnIndex;
  const external = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
  const before = capture.queueBeforeByTurn[turn] ?? queueDepthFromSnapshot(finalSnapshot);
  const after = queueDepthFromSnapshot(finalSnapshot);
  const inferred = inferFullAgent02StabilizationSignals(lastStep, before, after);
  const ok = externalStabilizationSignalsEqual(external, inferred);
  return { lastSteppedTurn: turn, external, inferred, ok };
}
