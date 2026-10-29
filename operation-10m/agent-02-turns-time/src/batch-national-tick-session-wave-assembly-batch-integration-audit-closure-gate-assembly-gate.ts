import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-export.js';
import { verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyReplayParity } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-replay-parity.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult {
  ok: boolean;
  assemblyOk: boolean;
  parityOk: boolean;
  assembly: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult;
  export: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport;
  latchDigest: string;
}

/**
 * Round 29 wave 29: assembly gate — export ok and replay parity from pre-assembly snapshot.
 */
export function gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult {
  const snapshot = engine.snapshot();
  const assembly = assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
    engine,
    budget,
    tickBatches,
  );
  const exp = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(assembly);
  const parity =
    verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyReplayParity(
      TurnTimeEngine.fromSnapshot(snapshot),
      budget,
      tickBatches,
    );
  const assemblyOk = exp.ok;
  const parityOk = parity.parityOk;
  const latchDigest = fnv1a64Hex(
    JSON.stringify({
      assembly: exp.assemblyDigest,
      assemblyOk,
      parityOk,
    }),
  );
  return {
    ok: assemblyOk && parityOk,
    assemblyOk,
    parityOk,
    assembly,
    export: exp,
    latchDigest,
  };
}
