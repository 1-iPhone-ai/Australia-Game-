import type { StepTurnResult } from './engine.js';
import type { TurnTimeSnapshot } from './types.js';
import type { ExternalStabilizationTurnSignals } from './external-stabilization-signals.js';

export interface Agent02QueueDepthSnapshot {
  pendingEventDueCount: number;
  pendingObligationDueCount: number;
}

export function queueDepthFromSnapshot(snapshot: TurnTimeSnapshot): Agent02QueueDepthSnapshot {
  const turn = snapshot.clock.turnIndex;
  const pendingEventDueCount = snapshot.events.filter(
    (e) => e.status === 'queued' && e.dueTurn <= turn,
  ).length;
  const pendingObligationDueCount = snapshot.obligations.filter(
    (o) => o.status === 'pending' && o.dueTurn <= turn,
  ).length;
  return { pendingEventDueCount, pendingObligationDueCount };
}

export function countAgent02QueueDepth(snapshot: Agent02QueueDepthSnapshot): number {
  return snapshot.pendingEventDueCount + snapshot.pendingObligationDueCount;
}

export function stepActivityCount(step: StepTurnResult): number {
  return step.dispatchedEventIds.length + step.firedObligationIds.length;
}

/**
 * Infer Agent 02-side stabilization flags from a batch step and due-queue depth after the step.
 */
export function inferAgent02StabilizationSignals(
  step: StepTurnResult,
  queueAfter: Agent02QueueDepthSnapshot,
): ExternalStabilizationTurnSignals {
  const backlogAfter = countAgent02QueueDepth(queueAfter);
  return {
    postQueueCalm: backlogAfter === 0,
    pendingStabilizationWave: false,
  };
}

/**
 * Stabilization wave: backlog drained on a turn with dispatch/fire activity (Agent 05 tranche9 lattice).
 */
export function inferPendingStabilizationWave(
  step: StepTurnResult,
  queueBefore: Agent02QueueDepthSnapshot,
  queueAfter: Agent02QueueDepthSnapshot,
): boolean {
  const before = countAgent02QueueDepth(queueBefore);
  const after = countAgent02QueueDepth(queueAfter);
  return before > 0 && after === 0 && stepActivityCount(step) > 0;
}

export function inferFullAgent02StabilizationSignals(
  step: StepTurnResult,
  queueBefore: Agent02QueueDepthSnapshot,
  queueAfter: Agent02QueueDepthSnapshot,
): ExternalStabilizationTurnSignals {
  const base = inferAgent02StabilizationSignals(step, queueAfter);
  return {
    postQueueCalm: base.postQueueCalm,
    pendingStabilizationWave: inferPendingStabilizationWave(step, queueBefore, queueAfter),
  };
}
