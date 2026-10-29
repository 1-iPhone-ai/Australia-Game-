import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult;
}

/**
 * Round 29 wave 29: deterministic replay — two closure gate assemblies from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.assemblyDigest === replay.assemblyDigest &&
    baseline.ok === replay.ok &&
    baseline.gateExport.latchDigest === replay.gateExport.latchDigest;
  return { parityOk, baseline, replay };
}
