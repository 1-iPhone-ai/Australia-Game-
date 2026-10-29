import type { BatchAdvanceResult } from './batch-advance.js';
import type { StepTurnResult } from './engine.js';
import {
  type Agent02QueueDepthSnapshot,
  inferFullAgent02StabilizationSignals,
  inferAgent02StabilizationSignals,
  stepActivityCount,
} from './agent02-stabilization-inference.js';
import {
  externalStabilizationSignalsEqual,
  normalizeExternalStabilizationSignals,
  type ExternalStabilizationTurnSignals,
} from './external-stabilization-signals.js';

export interface ExternalStabilizationBatchTurnRow {
  turnIndex: number;
  external: ExternalStabilizationTurnSignals;
  inferred: ExternalStabilizationTurnSignals;
  ok: boolean;
}

export interface ExternalStabilizationBatchGateResult {
  steppedTurns: number[];
  rows: ExternalStabilizationBatchTurnRow[];
  failingTurns: number[];
  ok: boolean;
}

export interface ExternalStabilizationBatchGateOptions {
  /** Due counts at end of each stepped turn (enables wave inference). */
  queueAfterByTurn?: Readonly<Record<number, Agent02QueueDepthSnapshot>>;
  /** Due counts at start of each stepped turn (required for wave when queueAfter provided). */
  queueBeforeByTurn?: Readonly<Record<number, Agent02QueueDepthSnapshot>>;
}

function inferForStep(
  step: StepTurnResult,
  turn: number,
  options?: ExternalStabilizationBatchGateOptions,
): ExternalStabilizationTurnSignals {
  const after = options?.queueAfterByTurn?.[turn];
  if (!after) {
    return {
      postQueueCalm: stepActivityCount(step) === 0 || step.blockedByPause,
      pendingStabilizationWave: false,
    };
  }
  const before = options.queueBeforeByTurn?.[turn] ?? {
    pendingEventDueCount: 0,
    pendingObligationDueCount: 0,
  };
  return inferFullAgent02StabilizationSignals(step, before, after);
}

/**
 * XS-02 stabilization batch gate: Agent 05 calm/wave flags must match Agent 02 inferred signals per stepped turn.
 */
export function gateExternalStabilizationForBatch(
  batch: BatchAdvanceResult,
  stabilizationByTurn: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  options?: ExternalStabilizationBatchGateOptions,
): ExternalStabilizationBatchGateResult {
  const steppedTurns: number[] = [];
  const rows: ExternalStabilizationBatchTurnRow[] = [];
  const failingTurns: number[] = [];

  for (const step of batch.steps) {
    if (step.blockedByPause) continue;
    const turn = step.clockBefore.turnIndex;
    steppedTurns.push(turn);
    const external = normalizeExternalStabilizationSignals(stabilizationByTurn[turn]);
    const inferred = inferForStep(step, turn, options);
    const ok = externalStabilizationSignalsEqual(external, inferred);
    rows.push({ turnIndex: turn, external, inferred, ok });
    if (!ok) failingTurns.push(turn);
  }

  return {
    steppedTurns,
    rows,
    failingTurns,
    ok: failingTurns.length === 0,
  };
}
