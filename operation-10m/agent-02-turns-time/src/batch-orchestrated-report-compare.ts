import type { BatchOrchestratedAdvanceReport } from './batch-orchestrated-advance-report.js';

export interface BatchOrchestratedReportCompareResult {
  ok: boolean;
  completedDelta: number;
  alignmentDelta: number;
  readinessChanged: boolean;
  reboundChanged: boolean;
}

export function compareBatchOrchestratedReports(
  baseline: BatchOrchestratedAdvanceReport,
  candidate: BatchOrchestratedAdvanceReport,
): BatchOrchestratedReportCompareResult {
  const completedDelta = candidate.batch.completed - baseline.batch.completed;
  const alignmentDelta = candidate.alignment.ratio - baseline.alignment.ratio;
  const baselineRebound = (baseline.rebound?.reboundTurns ?? []).join(',');
  const candidateRebound = (candidate.rebound?.reboundTurns ?? []).join(',');
  return {
    ok:
      baseline.ok === candidate.ok &&
      baseline.readiness.digest === candidate.readiness.digest &&
      baselineRebound === candidateRebound,
    completedDelta,
    alignmentDelta,
    readinessChanged: baseline.readiness.digest !== candidate.readiness.digest,
    reboundChanged: baselineRebound !== candidateRebound,
  };
}
