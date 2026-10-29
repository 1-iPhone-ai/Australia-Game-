import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExportCompareResult {
  ok: boolean;
  assemblyDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 28 wave 28: compare two closure gate assembly exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyExportCompareResult {
  const assemblyDigestMatch = baseline.assemblyDigest === candidate.assemblyDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: assemblyDigestMatch && latchDigestMatch && okFlagMatch,
    assemblyDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}
