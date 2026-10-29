import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  buildBatchAdvanceObservabilityRollup,
  type BatchAdvanceObservabilityRollup,
} from './batch-advance-observability.js';
import {
  gateBatchAdvanceReadiness,
  type BatchAdvanceReadinessGateResult,
} from './batch-advance-readiness-gate.js';
import {
  stepTurnsWithBudgetStabilizationCapture,
  batchStabilizationGateOptionsFromCapture,
} from './batch-stabilization-queue-capture.js';
import type { BatchAdvanceResult } from './batch-advance.js';
import type { ExternalStabilizationTurnSignals } from './external-stabilization-signals.js';
import type { BatchAdvanceCompositeReadinessInput } from './batch-advance-composite-gated-step.js';

export interface BatchAdvanceWithInstrumentedCompositeGate {
  batch: BatchAdvanceResult;
  rollup: BatchAdvanceObservabilityRollup;
  readiness: BatchAdvanceReadinessGateResult;
}

/**
 * Round 10: stepped batch with auto queue capture + composite readiness (XS-02 + Agent 05 lattice).
 */
export function stepTurnsWithBudgetInstrumentedCompositeGate(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  composite?: BatchAdvanceCompositeReadinessInput,
): BatchAdvanceWithInstrumentedCompositeGate {
  const before = engine.snapshot();
  const { batch, capture } = stepTurnsWithBudgetStabilizationCapture(engine, maxSteps, budget);
  const after = engine.snapshot();
  const rollup = buildBatchAdvanceObservabilityRollup(before, after, batch);
  const stabilizationOptions = composite?.stabilization ?? batchStabilizationGateOptionsFromCapture(capture);
  const readiness = gateBatchAdvanceReadiness(
    after,
    rollup,
    composite?.externalByTurn,
    composite?.stabilizationByTurn,
    { stabilization: stabilizationOptions },
  );
  return { batch, rollup, readiness };
}

export type InstrumentedCompositeInput = Omit<BatchAdvanceCompositeReadinessInput, 'stabilization'> & {
  stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>;
};
