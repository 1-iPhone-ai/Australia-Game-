import { advanceBudgetRemaining, type TurnAdvanceBudgetState } from './advance-budget.js';
import { type BatchAdvanceResult } from './batch-advance.js';

export interface AdvanceBudgetBatchReport {
  limit: number;
  consumed: number;
  remaining: number;
  exhausted: boolean;
  stoppedForBudget: boolean;
}

export function buildAdvanceBudgetBatchReport(batch: BatchAdvanceResult): AdvanceBudgetBatchReport {
  const budget: TurnAdvanceBudgetState = batch.budget;
  const remaining = advanceBudgetRemaining(budget);
  return {
    limit: budget.limit,
    consumed: budget.consumed,
    remaining,
    exhausted: remaining === 0,
    stoppedForBudget: Boolean(batch.stoppedReason?.includes('budget')),
  };
}
