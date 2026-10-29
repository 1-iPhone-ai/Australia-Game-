import type { BatchOrchestratedAdvanceReport } from './batch-orchestrated-advance-report.js';

export interface BatchOrchestratedAdvanceSummary {
  ok: boolean;
  completedSteps: number;
  alignmentRatio: number;
  preGateOk: boolean | null;
  reboundTurns: readonly number[];
  compositeDigest: string | null;
  orchestratedDigest: string;
}

export function summarizeBatchOrchestratedAdvanceReport(
  report: BatchOrchestratedAdvanceReport,
  orchestratedDigest: string,
): BatchOrchestratedAdvanceSummary {
  return {
    ok: report.ok,
    completedSteps: report.batch.completed,
    alignmentRatio: report.alignment.ratio,
    preGateOk: report.preGate?.ok ?? null,
    reboundTurns: report.rebound?.reboundTurns ?? [],
    compositeDigest: report.readiness.compositeDigest ?? null,
    orchestratedDigest,
  };
}
