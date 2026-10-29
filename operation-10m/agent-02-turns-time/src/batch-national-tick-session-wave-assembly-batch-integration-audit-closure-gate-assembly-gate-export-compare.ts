import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  assemblyDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 30 wave 30: compare two closure gate assembly gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const assemblyDigestMatch = baseline.assemblyDigest === candidate.assemblyDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && assemblyDigestMatch && okFlagMatch,
    latchDigestMatch,
    assemblyDigestMatch,
    okFlagMatch,
  };
}
