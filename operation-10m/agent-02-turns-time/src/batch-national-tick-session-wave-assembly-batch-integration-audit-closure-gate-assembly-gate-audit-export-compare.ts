import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 31 wave 31: compare two closure gate assembly gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExportCompareResult {
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: auditDigestMatch && latchDigestMatch && okFlagMatch,
    auditDigestMatch,
    latchDigestMatch,
    okFlagMatch,
  };
}
