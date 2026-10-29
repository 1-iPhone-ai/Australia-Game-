import { TurnTimeSnapshot } from './types.js';
import { TurnTimeEngine } from './engine.js';
import { stepTurnsWithBudget, type BatchAdvanceResult } from './batch-advance.js';
import { tryConsumeTurnAdvanceBudget, type TurnAdvanceBudgetState } from './advance-budget.js';
import { derivePipelineStageHits, type Op10mAgent02PipelineStageId } from './pipeline-stages.js';
import { reconcileLastStepHorizon } from './plan-actual-reconcile.js';
import { buildAgent02TurnPipelineReport } from './turn-pipeline-report.js';

export interface BatchAdvancePipelineReport {
  startedTurnIndex: number;
  endedTurnIndex: number;
  stepsCompleted: number;
  stoppedReason?: string;
  finalPipelineDigest: string;
  incompleteTurns: number[];
  horizonReconcileOk: boolean[];
  newStageIdsByStep: Op10mAgent02PipelineStageId[][];
  allHorizonReconcileOk: boolean;
}

export function buildBatchAdvancePipelineReport(
  before: TurnTimeSnapshot,
  after: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
): BatchAdvancePipelineReport {
  const finalReport = buildAgent02TurnPipelineReport(after, before);
  const newStageIdsByStep = batch.steps.map((step) => {
    const hits = derivePipelineStageHits(step.traceEntries);
    const unique = [...new Set(hits.map((h) => h.stageId))];
    return unique.sort((a, b) => a.localeCompare(b));
  });

  return {
    startedTurnIndex: before.clock.turnIndex,
    endedTurnIndex: after.clock.turnIndex,
    stepsCompleted: batch.completed,
    stoppedReason: batch.stoppedReason,
    finalPipelineDigest: finalReport.pipelineDigest,
    incompleteTurns: finalReport.incompleteTurns,
    horizonReconcileOk: batch.horizonReconcileOk ?? [],
    newStageIdsByStep,
    allHorizonReconcileOk: (batch.horizonReconcileOk ?? []).every(Boolean),
  };
}

export interface BatchAdvanceWithPipelineReport {
  batch: BatchAdvanceResult;
  report: BatchAdvancePipelineReport;
}

export function stepTurnsWithBudgetPipelineReport(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
): BatchAdvanceWithPipelineReport {
  const before = engine.snapshot();
  const batch = stepTurnsWithBudget(engine, maxSteps, budget);
  const after = engine.snapshot();
  const report = buildBatchAdvancePipelineReport(before, after, batch);
  return { batch, report };
}
