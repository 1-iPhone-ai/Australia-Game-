import type { BatchOrchestratedAuditedReport } from './batch-advance-orchestrated-audited-step.js';
import type { BatchStabilizationPlanCoverageGateResult } from './batch-stabilization-plan-coverage-gate.js';

export interface BatchOrchestratedScorecard {
  preGateOk: boolean | null;
  readinessOk: boolean;
  reboundOk: boolean;
  postStabilizationOk: boolean;
  calmStreakOk: boolean;
  planCoverageOk: boolean;
  alignmentRatio: number;
  ok: boolean;
}

export function buildBatchOrchestratedScorecard(
  report: BatchOrchestratedAuditedReport,
  planCoverage?: BatchStabilizationPlanCoverageGateResult,
): BatchOrchestratedScorecard {
  const planCoverageOk = planCoverage?.ok ?? true;
  const scorecard: BatchOrchestratedScorecard = {
    preGateOk: report.preGate?.ok ?? null,
    readinessOk: report.readiness.ok,
    reboundOk: report.rebound?.ok ?? true,
    postStabilizationOk: report.postStabilization?.ok ?? true,
    calmStreakOk: report.calmStreak?.ok ?? true,
    planCoverageOk,
    alignmentRatio: report.alignment.ratio,
    ok:
      (report.preGate?.ok ?? true) &&
      report.readiness.ok &&
      (report.rebound?.ok ?? true) &&
      (report.postStabilization?.ok ?? true) &&
      (report.calmStreak?.ok ?? true) &&
      planCoverageOk,
  };
  return scorecard;
}
