import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult;
}

/**
 * Round 26: deterministic replay — two integration audit closures from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.closureDigest === replay.closureDigest &&
    baseline.ok === replay.ok &&
    baseline.gateExport.gateDigest === replay.gateExport.gateDigest;
  return { parityOk, baseline, replay };
}
