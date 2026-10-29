import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport {
  ok: boolean;
  integrationDigest: string;
  gateDigest: string;
  batchDigest: string;
  exportAllOk: boolean;
  parityOk: boolean;
}

/**
 * Round 23: flatten integration audit for Agent 25 assembly manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport {
  return {
    ok: audit.ok,
    integrationDigest: audit.integrationDigest,
    gateDigest: audit.gateExport.gateDigest,
    batchDigest: audit.gateExport.batchDigest,
    exportAllOk: audit.gate.exportAllOk,
    parityOk: audit.gate.parityOk,
  };
}
