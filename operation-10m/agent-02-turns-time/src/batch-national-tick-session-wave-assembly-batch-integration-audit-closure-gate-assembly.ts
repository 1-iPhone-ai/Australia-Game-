import { TurnTimeEngine } from './engine.js';
import { type TurnAdvanceBudgetState } from './advance-budget.js';
import { fnv1a64Hex } from './turn-audit.js';
import type { NationalTickSessionWaveTickSpec } from './batch-national-tick-session-wave.js';
import {
  gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate.js';
import {
  exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-export.js';
import {
  verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParity,
  type BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParityResult,
} from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-replay-parity.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult {
  ok: boolean;
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult;
  gateExport: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport;
  parity: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParityResult;
  assemblyDigest: string;
}

/**
 * Round 28 wave 28: assemble closure gate, export, and replay parity in one pass.
 */
export function assembleBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
  engine: TurnTimeEngine,
  budget: TurnAdvanceBudgetState,
  tickBatches: readonly (readonly NationalTickSessionWaveTickSpec[])[],
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult {
  const snapshot = engine.snapshot();
  const gate = gateBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
    engine,
    budget,
    tickBatches,
  );
  const gateExport = exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(gate);
  const parity = verifyBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateReplayParity(
    TurnTimeEngine.fromSnapshot(snapshot),
    budget,
    tickBatches,
  );
  const ok = gateExport.ok && parity.parityOk;
  const assemblyDigest = fnv1a64Hex(
    JSON.stringify({
      latch: gateExport.latchDigest,
      parityOk: parity.parityOk,
      ok,
    }),
  );
  return { ok, gate, gateExport, parity, assemblyDigest };
}
