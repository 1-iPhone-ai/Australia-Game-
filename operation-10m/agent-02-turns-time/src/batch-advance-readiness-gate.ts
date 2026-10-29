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
import {
  buildBatchStabilizationReconcileReport,
  type BatchStabilizationReconcileReport,
} from './batch-stabilization-reconcile-report.js';
import { computeBatchStabilizationDigest } from './batch-stabilization-digest.js';
import type { ExternalStabilizationBatchGateResult } from './external-stabilization-batch-gate.js';
import type { ExternalStabilizationBatchGateOptions } from './external-stabilization-batch-gate.js';
import type { ExternalStabilizationTurnSignals } from './external-stabilization-signals.js';

export interface BatchAdvanceReadinessGateResult {
  observabilityOk: boolean;
  externalBatchOk: boolean;
  stabilizationBatchOk: boolean;
  pipelineTurnsOk: boolean;
  budgetOk: boolean;
  coverageGap: PipelineCoverageGapReport;
  externalBatch?: ExternalDayPlanBatchGateResult;
  stabilizationBatch?: ExternalStabilizationBatchGateResult;
  stabilizationReconcile?: BatchStabilizationReconcileReport;
  budget: AdvanceBudgetBatchReport;
  digest: string;
  stabilizationDigest?: string;
  ok: boolean;
}

export interface BatchAdvanceReadinessGateOptions {
  stabilization?: ExternalStabilizationBatchGateOptions;
}

export function gateBatchAdvanceReadiness(
  finalSnapshot: TurnTimeSnapshot,
  rollup: BatchAdvanceObservabilityRollup,
  externalByTurn?: Readonly<Record<number, readonly string[]>>,
  stabilizationByTurn?: Readonly<Record<number, ExternalStabilizationTurnSignals>>,
  options?: BatchAdvanceReadinessGateOptions,
): BatchAdvanceReadinessGateResult {
  const coverageGap = buildPipelineCoverageGapReport(finalSnapshot);
  const externalBatch = externalByTurn
    ? gateExternalDayPlanForBatch(rollup.batch, externalByTurn)
    : undefined;
  const stabilizationReconcile = stabilizationByTurn
    ? buildBatchStabilizationReconcileReport(rollup.batch, stabilizationByTurn, options?.stabilization)
    : undefined;
  const stabilizationBatch = stabilizationReconcile?.gate;
  const budget = buildAdvanceBudgetBatchReport(rollup.batch);
  const digest = computeBatchObservabilityDigest(rollup);
  const stabilizationDigest = stabilizationReconcile
    ? computeBatchStabilizationDigest(stabilizationReconcile)
    : undefined;

  const observabilityOk = rollup.ok;
  const externalBatchOk = externalBatch?.ok ?? true;
  const stabilizationBatchOk = stabilizationBatch?.ok ?? true;
  const pipelineTurnsOk = rollup.pipeline.incompleteTurns.length === 0;
  const budgetOk = !budget.stoppedForBudget || rollup.batch.completed > 0;

  return {
    observabilityOk,
    externalBatchOk,
    stabilizationBatchOk,
    pipelineTurnsOk,
    budgetOk,
    coverageGap,
    externalBatch,
    stabilizationBatch,
    stabilizationReconcile,
    budget,
    digest,
    stabilizationDigest,
    ok: observabilityOk && externalBatchOk && stabilizationBatchOk && pipelineTurnsOk && budgetOk,
  };
}
