import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-export.js';
import { verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParity } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-replay-parity.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult {
  ok: boolean;
  closureOk: boolean;
  parityOk: boolean;
  closure: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport;
  latchDigest: string;
}

/**
 * Round 26 wave 26: closure gate — export ok and replay parity from pre-closure snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult {
  const snapshot = engine.snapshot();
  const closure = closeBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(closure);
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const closureOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      closure: exp.closureDigest,
      closureOk,
      parityOk,
    }),
  );
  return {
    ok: closureOk && parityOk,
    closureOk,
    parityOk,
    closure,
    export: exp,
    latchDigest,
  };
}
