import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult;
}

/**
 * Round 27 wave 27: deterministic replay — two closure gates from the same snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.latchDigest === replay.latchDigest &&
    baseline.ok === replay.ok &&
    baseline.export.closureDigest === replay.export.closureDigest;
  return { parityOk, baseline, replay };
}
