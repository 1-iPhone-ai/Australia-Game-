import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  stepTurnsWithBudgetObservability,
  type BatchAdvanceObservabilityRollup,
} from './batch-advance-observability.js';
import { type BatchAdvanceResult } from './batch-advance.js';
import {
  gateBatchAdvanceReadiness,
  type BatchAdvanceReadinessGateResult,
} from './batch-advance-readiness-gate.js';

export interface BatchAdvanceWithReadinessGate {
  batch: BatchAdvanceResult;
  rollup: BatchAdvanceObservabilityRollup;
  readiness: BatchAdvanceReadinessGateResult;
}

export function stepTurnsWithBudgetReadinessGate(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  externalByTurn?: Readonly<Record<number, readonly string[]>>,
): BatchAdvanceWithReadinessGate {
  const { batch, rollup } = stepTurnsWithBudgetObservability(engine, maxSteps, budget);
  const readiness = gateBatchAdvanceReadiness(engine.snapshot(), rollup, externalByTurn);
  return { batch, rollup, readiness };
}
