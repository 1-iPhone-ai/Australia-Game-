import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport {
  ok: boolean;
  assemblyOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  assemblyDigest: string;
}

/**
 * Round 29: flatten closure gate assembly gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport {
  return {
    ok: gate.ok,
    assemblyOk: gate.assemblyOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    assemblyDigest: gate.export.assemblyDigest,
  };
}
