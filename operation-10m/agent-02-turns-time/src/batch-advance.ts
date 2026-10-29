import { TurnTimeEngine, StepTurnResult } from './engine.js';
import { tryConsumeTurnAdvanceBudget, type TurnAdvanceBudgetState } from './advance-budget.js';
import { reconcileLastStepHorizon } from './plan-actual-reconcile.js';

export interface BatchAdvanceResult {
  steps: StepTurnResult[];
  budget: TurnAdvanceBudgetState;
  completed: number;
  stoppedReason?: string;
  /** Per successful stepFullTurn, horizon plan vs actual for that turn. */
  horizonReconcileOk: boolean[];
}

/**
 * Steps up to `maxSteps` full turns, consuming advance budget per successful step.
 * Stops early on pause block or budget exhaustion.
 */
export function stepTurnsWithBudget(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
): BatchAdvanceResult {
  const cap = Math.max(0, Math.floor(maxSteps));
  const steps: StepTurnResult[] = [];
  const horizonReconcileOk: boolean[] = [];
  let currentBudget = budget;
  let completed = 0;

  for (let i = 0; i < cap; i += 1) {
    const consume = tryConsumeTurnAdvanceBudget(currentBudget, 1);
    if (!consume.allowed) {
      return {
        steps,
        budget: currentBudget,
        completed,
        stoppedReason: consume.detail,
        horizonReconcileOk,
      };
    }
    const snapBefore = engine.snapshot();
    const step = engine.stepFullTurn();
    steps.push(step);
    currentBudget = consume.state;
    completed += 1;
    if (!step.blockedByPause) {
      horizonReconcileOk.push(reconcileLastStepHorizon(snapBefore, engine.snapshot()).ok);
    }
    if (step.blockedByPause) {
      return {
        steps,
        budget: currentBudget,
        completed,
        stoppedReason: 'paused',
        horizonReconcileOk,
      };
    }
  }

  return { steps, budget: currentBudget, completed, horizonReconcileOk };
}
