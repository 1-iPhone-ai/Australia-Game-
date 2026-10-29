import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 36 wave 36: compare two audit-gate audit gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExportCompareResult {
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
