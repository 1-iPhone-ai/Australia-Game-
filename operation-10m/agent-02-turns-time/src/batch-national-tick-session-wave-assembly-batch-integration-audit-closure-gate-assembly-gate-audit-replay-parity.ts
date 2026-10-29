import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult;
}

/**
 * Round 31 wave 31: deterministic replay — two assembly gate audits from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.auditDigest === replay.auditDigest &&
    baseline.ok === replay.ok &&
    baseline.gateExport.latchDigest === replay.gateExport.latchDigest;
  return { parityOk, baseline, replay };
}
