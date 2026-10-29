import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  stepTurnsWithBudgetReadinessGate,
  type BatchAdvanceWithReadinessGate,
} from './batch-advance-gated-step.js';
import type { ExternalStabilizationTurnSignals } from './external-stabilization-signals.js';
import {
  type BatchAdvanceReadinessGateOptions,
  type BatchAdvanceReadinessGateResult,
} from './batch-advance-readiness-gate.js';
import type { ExternalStabilizationBatchGateOptions } from './external-stabilization-batch-gate.js';

export interface BatchAdvanceCompositeReadinessInput {
  externalByTurn?: Readonly<Record<number, readonly string[]>>;
  stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>;
  stabilization?: ExternalStabilizationBatchGateOptions;
}

export interface BatchAdvanceWithCompositeReadinessGate extends BatchAdvanceWithReadinessGate {
  readiness: BatchAdvanceReadinessGateResult;
}

/**
 * Round 9: XS-02 narrative batch plan + Agent 05 stabilization lattice on one stepped batch.
 */
export function stepTurnsWithBudgetCompositeReadinessGate(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  composite?: BatchAdvanceCompositeReadinessInput,
): BatchAdvanceWithCompositeReadinessGate {
  const gateOptions: BatchAdvanceReadinessGateOptions | undefined = composite?.stabilization
    ? { stabilization: composite.stabilization }
    : undefined;
  const { batch, rollup, readiness } = stepTurnsWithBudgetReadinessGate(
    engine,
    maxSteps,
    budget,
    composite?.externalByTurn,
    composite?.stabilizationByTurn,
    gateOptions,
  );
  return { batch, rollup, readiness };
}
