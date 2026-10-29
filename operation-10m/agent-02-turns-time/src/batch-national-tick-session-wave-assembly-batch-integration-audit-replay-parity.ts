import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  auditBatchNationalTickSessionWaveAssemblyBatchIntegration,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParityResult {
  parityOk: boolean;
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult;
  replay: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult;
}

/**
 * Round 23: deterministic replay — two integration audits from the same starting snapshot.
 */
export function verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParity(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditReplayParityResult {
  const snapshot = engine.snapshot();
  const baseline = auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
    engine,
    budget,
    tickBatches,
  );
  const replayEngine = TurnTimeEngine.fromSnapshot(snapshot);
  const replay = auditBatchNationalTickSessionWaveAssemblyBatchIntegration(
    replayEngine,
    budget,
    tickBatches,
  );
  const parityOk =
    baseline.integrationDigest === replay.integrationDigest &&
    baseline.ok === replay.ok &&
    baseline.gateExport.batchDigest === replay.gateExport.batchDigest;
  return { parityOk, baseline, replay };
}
