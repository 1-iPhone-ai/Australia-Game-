import { TurnTimeSnapshot } from './types.js';
import type { BatchAdvanceObservabilityRollup } from './batch-advance-observability.js';
import {
  buildPipelineCoverageGapReport,
  type PipelineCoverageGapReport,
} from './pipeline-coverage-gap-report.js';
import { computeBatchObservabilityDigest } from './batch-observability-digest.js';
import {
  gateExternalDayPlanForBatch,
  type ExternalDayPlanBatchGateResult,
} from './external-day-plan-batch-gate.js';
import { buildAdvanceBudgetBatchReport, type AdvanceBudgetBatchReport } from './advance-budget-batch-report.js';

export interface BatchAdvanceReadinessGateResult {
  observabilityOk: boolean;
  externalBatchOk: boolean;
  pipelineTurnsOk: boolean;
  budgetOk: boolean;
  coverageGap: PipelineCoverageGapReport;
  externalBatch?: ExternalDayPlanBatchGateResult;
  budget: AdvanceBudgetBatchReport;
  digest: string;
  ok: boolean;
}

export function gateBatchAdvanceReadiness(
  finalSnapshot: TurnTimeSnapshot,
  rollup: BatchAdvanceObservabilityRollup,
  externalByTurn?: Readonly<Record<number, readonly string[]>>,
): BatchAdvanceReadinessGateResult {
  const coverageGap = buildPipelineCoverageGapReport(finalSnapshot);
  const externalBatch = externalByTurn
    ? gateExternalDayPlanForBatch(rollup.batch, externalByTurn)
    : undefined;
  const budget = buildAdvanceBudgetBatchReport(rollup.batch);
  const digest = computeBatchObservabilityDigest(rollup);

  const observabilityOk = rollup.ok;
  const externalBatchOk = externalBatch?.ok ?? true;
  const pipelineTurnsOk = rollup.pipeline.incompleteTurns.length === 0;
  const budgetOk = !budget.stoppedForBudget || rollup.batch.completed > 0;

  return {
    observabilityOk,
    externalBatchOk,
    pipelineTurnsOk,
    budgetOk,
    coverageGap,
    externalBatch,
    budget,
    digest,
    ok: observabilityOk && externalBatchOk && pipelineTurnsOk && budgetOk,
  };
}
