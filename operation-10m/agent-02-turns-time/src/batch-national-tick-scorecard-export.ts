import type { BatchOrchestratedScorecard } from './batch-orchestrated-scorecard.js';
import type { BatchNationalTickOrchestratedResult } from './batch-national-tick-orchestrator-digest.js';

export interface BatchNationalTickScorecardExport {
  ok: boolean;
  completedSteps: number;
  alignmentRatio: number;
  preGateOk: boolean | null;
  readinessOk: boolean;
  reboundOk: boolean;
  postStabilizationOk: boolean;
  calmStreakOk: boolean;
  planCoverageOk: boolean;
  nationalTickDigest: string;
  auditDigest: string;
}

export function exportBatchNationalTickScorecard(
  result: BatchNationalTickOrchestratedResult,
): BatchNationalTickScorecardExport {
  const s: BatchOrchestratedScorecard = result.scorecard;
  return {
    ok: s.ok,
    completedSteps: result.summary.completedSteps,
    alignmentRatio: s.alignmentRatio,
    preGateOk: s.preGateOk,
    readinessOk: s.readinessOk,
    reboundOk: s.reboundOk,
    postStabilizationOk: s.postStabilizationOk,
    calmStreakOk: s.calmStreakOk,
    planCoverageOk: s.planCoverageOk,
    nationalTickDigest: result.nationalTickDigest,
    auditDigest: result.auditDigest,
  };
}
