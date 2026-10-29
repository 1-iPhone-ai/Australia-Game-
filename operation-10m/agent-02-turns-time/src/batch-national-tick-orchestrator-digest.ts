import { fnv1a64Hex } from './turn-audit.js';
import type { BatchOrchestratedScorecard } from './batch-orchestrated-scorecard.js';
import type { BatchAdvanceWithOrchestratedAudit } from './batch-advance-orchestrated-audited-step.js';
import type { BatchStabilizationPlanCoverageGateResult } from './batch-stabilization-plan-coverage-gate.js';

export interface BatchNationalTickOrchestratedResult extends BatchAdvanceWithOrchestratedAudit {
  planCoverage?: BatchStabilizationPlanCoverageGateResult;
  scorecard: BatchOrchestratedScorecard;
  nationalTickDigest: string;
}

export function computeBatchNationalTickOrchestratedDigest(
  audit: BatchAdvanceWithOrchestratedAudit,
  scorecard: BatchOrchestratedScorecard,
): string {
  return fnv1a64Hex(
    JSON.stringify({
      ok: scorecard.ok,
      audit: audit.auditDigest,
      orchestrated: audit.orchestratedDigest,
      alignment: scorecard.alignmentRatio,
      planCoverage: scorecard.planCoverageOk,
    }),
  );
}
