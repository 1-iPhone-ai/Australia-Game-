import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport {
  ok: boolean;
  assemblyDigest: string;
  latchDigest: string;
  parityOk: boolean;
}

/**
 * Round 28: flatten closure gate assembly for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssembly(
  assembly: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport {
  return {
    ok: assembly.ok,
    assemblyDigest: assembly.assemblyDigest,
    latchDigest: assembly.gateExport.latchDigest,
    parityOk: assembly.parity.parityOk,
  };
}
