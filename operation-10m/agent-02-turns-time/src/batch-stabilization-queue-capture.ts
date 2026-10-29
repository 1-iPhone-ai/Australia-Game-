import type { TurnTimeSnapshot } from './types.js';
import type { BatchAdvanceResult } from './batch-advance.js';
import { tryConsumeTurnAdvanceBudget, type TurnAdvanceBudgetState } from './advance-budget.js';
import { reconcileLastStepHorizon } from './plan-actual-reconcile.js';
import type { TurnTimeEngine } from './engine.js';
import type { Agent02QueueDepthSnapshot } from './agent02-stabilization-inference.js';
import { queueDepthFromSnapshot } from './agent02-stabilization-inference.js';
import type { ExternalStabilizationBatchGateOptions } from './external-stabilization-batch-gate.js';

export interface BatchStabilizationQueueCapture {
  queueBeforeByTurn: Record<number, Agent02QueueDepthSnapshot>;
  queueAfterByTurn: Record<number, Agent02QueueDepthSnapshot>;
}

export interface BatchAdvanceWithStabilizationCapture {
  batch: BatchAdvanceResult;
  capture: BatchStabilizationQueueCapture;
}

export function batchStabilizationGateOptionsFromCapture(
  capture: BatchStabilizationQueueCapture,
): ExternalStabilizationBatchGateOptions {
  return {
    queueBeforeByTurn: capture.queueBeforeByTurn,
    queueAfterByTurn: capture.queueAfterByTurn,
  };
}

/**
 * Steps a batch while recording per-turn queue depth for Agent 05 stabilization inference.
 */
export function stepTurnsWithBudgetStabilizationCapture(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
): BatchAdvanceWithStabilizationCapture {
  const cap = Math.max(0, Math.floor(maxSteps));
  const steps: BatchAdvanceResult['steps'] = [];
  const horizonReconcileOk: boolean[] = [];
  const queueBeforeByTurn: Record<number, Agent02QueueDepthSnapshot> = {};
  const queueAfterByTurn: Record<number, Agent02QueueDepthSnapshot> = {};
  let currentBudget = budget;
  let completed = 0;

  for (let i = 0; i < cap; i += 1) {
    const consume = tryConsumeTurnAdvanceBudget(currentBudget, 1);
    if (!consume.allowed) {
      return {
        batch: {
          steps,
          budget: currentBudget,
          completed,
          stoppedReason: consume.detail,
          horizonReconcileOk,
        },
        capture: { queueBeforeByTurn, queueAfterByTurn },
      };
    }
    const snapBefore = engine.snapshot();
    const turn = snapBefore.clock.turnIndex;
    queueBeforeByTurn[turn] = queueDepthFromSnapshot(snapBefore);
    const step = engine.stepFullTurn();
    steps.push(step);
    currentBudget = consume.state;
    completed += 1;
    if (!step.blockedByPause) {
      horizonReconcileOk.push(reconcileLastStepHorizon(snapBefore, engine.snapshot()).ok);
      queueAfterByTurn[turn] = queueDepthFromSnapshot(engine.snapshot());
    }
    if (step.blockedByPause) {
      return {
        batch: {
          steps,
          budget: currentBudget,
          completed,
          stoppedReason: 'paused',
          horizonReconcileOk,
        },
        capture: { queueBeforeByTurn, queueAfterByTurn },
      };
    }
  }

  return {
    batch: { steps, budget: currentBudget, completed, horizonReconcileOk },
    capture: { queueBeforeByTurn, queueAfterByTurn },
  };
}

/** Convenience: capture options from an already-run batch (single before/after only — prefer stepped capture). */
export function approximateQueueCaptureFromEndpoints(
  beforeTurn: number,
  afterSnapshot: TurnTimeSnapshot,
  beforeSnapshot: TurnTimeSnapshot,
): BatchStabilizationQueueCapture {
  return {
    queueBeforeByTurn: { [beforeTurn]: queueDepthFromSnapshot(beforeSnapshot) },
    queueAfterByTurn: { [beforeTurn]: queueDepthFromSnapshot(afterSnapshot) },
  };
}
