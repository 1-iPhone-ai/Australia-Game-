import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  stepTurnsWithBudgetOrchestratedAuditedAdvance,
  type BatchAdvanceWithOrchestratedAudit,
} from './batch-advance-orchestrated-audited-step.js';
import {
  type BatchAdvanceOrchestratedInput,
} from './batch-advance-orchestrated-step.js';
import { gateBatchStabilizationPlanCoverage } from './batch-stabilization-plan-coverage-gate.js';
import { buildBatchOrchestratedScorecard } from './batch-orchestrated-scorecard.js';
import {
  computeBatchNationalTickOrchestratedDigest,
  type BatchNationalTickOrchestratedResult,
} from './batch-national-tick-orchestrator-digest.js';

export type { BatchNationalTickOrchestratedResult };
import type { BatchOrchestratedAuditedReport } from './batch-advance-orchestrated-audited-step.js';

/**
 * Round 14 national-tick orchestrator hook (Agent 02 / 25): audited orchestrated batch + plan coverage + scorecard.
 */
export function stepNationalTickOrchestratedBatch(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
): BatchNationalTickOrchestratedResult {
  const run = stepTurnsWithBudgetOrchestratedAuditedAdvance(engine, maxSteps, budget, input);
  const planCoverage =
    input?.stabilizationByTurn !== undefined
      ? gateBatchStabilizationPlanCoverage(run.report.batch, input.stabilizationByTurn)
      : undefined;

  const report: BatchOrchestratedAuditedReport = {
    ...run.report,
    ok: run.report.ok && (planCoverage?.ok ?? true),
  };
  const scorecard = buildBatchOrchestratedScorecard(report, planCoverage);
  const nationalTickDigest = computeBatchNationalTickOrchestratedDigest(
    { ...run, report, summary: { ...run.summary, ok: scorecard.ok } },
    scorecard,
  );

  return {
    ...run,
    report,
    summary: { ...run.summary, ok: scorecard.ok },
    planCoverage,
    scorecard,
    nationalTickDigest,
  };
}
