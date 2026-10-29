import { TurnTimeSnapshot } from './types.js';
import { TurnTimeEngine } from './engine.js';
import { stepTurnsWithBudget, type BatchAdvanceResult } from './batch-advance.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  buildBatchAdvancePipelineReport,
  type BatchAdvancePipelineReport,
} from './batch-pipeline-report.js';
import {
  buildBatchHorizonReconcileReport,
  type BatchHorizonReconcileReport,
} from './batch-horizon-reconcile-report.js';
import {
  buildBatchStepPipelineReports,
  type BatchStepPipelineReportRow,
} from './batch-step-pipeline-reports.js';
import {
  computePipelineStageCoverageDelta,
  type PipelineStageCoverageDelta,
} from './pipeline-coverage-delta.js';

export interface BatchAdvanceObservabilityRollup {
  batch: BatchAdvanceResult;
  pipeline: BatchAdvancePipelineReport;
  horizon: BatchHorizonReconcileReport;
  stepRows: BatchStepPipelineReportRow[];
  finalCoverageDelta: PipelineStageCoverageDelta;
  ok: boolean;
}

export function buildBatchAdvanceObservabilityRollup(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
): BatchAdvanceObservabilityRollup {
  const pipeline = buildBatchAdvancePipelineReport(before, after, batch);
  const horizon = buildBatchHorizonReconcileReport(before, after, batch);
  const stepRows = buildBatchStepPipelineReports(before, batch);
  const finalCoverageDelta = computePipelineStageCoverageDelta(before, after);
  return {
    batch,
    pipeline,
    horizon,
    stepRows,
    finalCoverageDelta,
    ok: pipeline.allHorizonReconcileOk && horizon.ok && pipeline.incompleteTurns.length === 0,
  };
}

export interface BatchAdvanceWithObservability {
  batch: BatchAdvanceResult;
  rollup: BatchAdvanceObservabilityRollup;
}

export function stepTurnsWithBudgetObservability(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
): BatchAdvanceWithObservability {
  const before = engine.snapshot();
  const batch = stepTurnsWithBudget(engine, maxSteps, budget);
  const after = engine.snapshot();
  const rollup = buildBatchAdvanceObservabilityRollup(before, after, batch);
  return { batch, rollup };
}
