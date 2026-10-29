import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport {
  ok: boolean;
  closureOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  closureDigest: string;
}

/**
 * Round 27 wave 27: flatten closure gate latch for Agent 25 assembly hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport {
  return {
    ok: gate.ok,
    closureOk: gate.closureOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    closureDigest: gate.export.closureDigest,
  };
}
