import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport {
  ok: boolean;
  closureDigest: string;
  gateDigest: string;
  integrationDigest: string;
}

/**
 * Round 25: flatten integration audit closure for Agent 25 assembly manifest.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosure(
  closure: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport {
  return {
    ok: closure.ok,
    closureDigest: closure.closureDigest,
    gateDigest: closure.gateExport.gateDigest,
    integrationDigest: closure.gateExport.integrationDigest,
  };
}
