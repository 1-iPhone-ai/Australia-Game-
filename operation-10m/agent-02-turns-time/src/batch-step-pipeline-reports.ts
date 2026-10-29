import { TurnClock, TurnTimeSnapshot } from './types.js';
import { type BatchAdvanceResult } from './batch-advance.js';
import {
  buildAgent02TurnPipelineReport,
  type Agent02TurnPipelineReport,
} from './turn-pipeline-report.js';
import {
  computePipelineStageCoverageDelta,
  type PipelineStageCoverageDelta,
} from './pipeline-coverage-delta.js';

export interface BatchStepPipelineReportRow {
  turnIndex: number;
  report: Agent02TurnPipelineReport;
  coverageDelta: PipelineStageCoverageDelta;
}

function syntheticSnapshotAfterStep(
  base: TurnTimeSnapshot,
  clock: TurnClock,
  trace: TurnTimeSnapshot['trace'],
): TurnTimeSnapshot {
  return {
    ...base,
    clock,
    trace,
  };
}

export function buildBatchStepPipelineReports(
  before: TurnTimeSnapshot,
  batch: BatchAdvanceResult,
): BatchStepPipelineReportRow[] {
  const rows: BatchStepPipelineReportRow[] = [];
  let trace = [...before.trace];
  let prev = before;

  for (const step of batch.steps) {
    trace = [...trace, ...step.traceEntries];
    const afterStep = syntheticSnapshotAfterStep(before, step.clockAfter, trace);
    const report = buildAgent02TurnPipelineReport(afterStep, prev);
    const coverageDelta = computePipelineStageCoverageDelta(prev, afterStep);
    rows.push({
      turnIndex: step.clockBefore.turnIndex,
      report,
      coverageDelta,
    });
    prev = afterStep;
  }

  return rows;
}
