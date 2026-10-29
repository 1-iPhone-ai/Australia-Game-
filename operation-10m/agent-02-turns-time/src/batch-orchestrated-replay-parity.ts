import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import {
  stepTurnsWithBudgetOrchestratedAuditedAdvance,
  type BatchAdvanceWithOrchestratedAudit,
} from './batch-advance-orchestrated-audited-step.js';
import { type BatchAdvanceOrchestratedInput } from './batch-advance-orchestrated-step.js';
import { compareBatchOrchestratedReports } from './batch-orchestrated-report-compare.js';

export interface BatchOrchestratedReplayParityResult {
  parityOk: boolean;
  baseline: BatchAdvanceWithOrchestratedAudit;
  replay: BatchAdvanceWithOrchestratedAudit;
}

/**
 * Round 14: deterministic replay — two audited orchestrated runs from the same starting snapshot.
 */
export function verifyBatchOrchestratedReplayParity(
  engine: TurnTimeEngine,
  maxSteps: number,
  budget: TurnAdvanceBudgetState,
  input?: BatchAdvanceOrchestratedInput,
): BatchOrchestratedReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = stepTurnsWithBudgetOrchestratedAuditedAdvance(engine, maxSteps, budget, input);
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = stepTurnsWithBudgetOrchestratedAuditedAdvance(replayEngine, maxSteps, budget, input);
  const compare = compareBatchOrchestratedReports(baseline.report, replay.report);
  const parityOk =
    compare.ok &&
    baseline.auditDigest === replay.auditDigest &&
    baseline.summary.orchestratedDigest === replay.summary.orchestratedDigest;
  return { parityOk, baseline, replay };
}
