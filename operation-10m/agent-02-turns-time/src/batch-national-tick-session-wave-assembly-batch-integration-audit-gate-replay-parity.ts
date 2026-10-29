import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult;
}

/**
 * Round 25: deterministic replay — two integration audit gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.gateDigest === replay.gateDigest &&
    baseline.ok === replay.ok &&
    baseline.export.integrationDigest === replay.export.integrationDigest;
  return { parityOk, baseline, replay };
}
