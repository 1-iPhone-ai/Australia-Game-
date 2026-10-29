import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult;
}

/**
 * Round 30 wave 30: deterministic replay — two assembly gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.assemblyDigest === replay.export.assemblyDigest;
  return { parityOk, baseline, replay };
}
