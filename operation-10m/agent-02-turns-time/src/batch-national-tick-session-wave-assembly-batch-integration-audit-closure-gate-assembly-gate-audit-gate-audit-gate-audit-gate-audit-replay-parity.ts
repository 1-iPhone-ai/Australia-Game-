import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult;
}

/**
 * Round 38 wave 38: deterministic replay — two audit-gate audit gate audit gate audits from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.auditDigest === replay.auditDigest &&
    baseline.ok === replay.ok &&
    baseline.auditGateExport.latchDigest === replay.auditGateExport.latchDigest;
  return { parityOk, baseline, replay };
}
