import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
  ok: boolean;
  auditDigestMatch: boolean;
  latchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 40 wave 40: compare two audit-gate audit gate audit gate audit gate audit exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditExportCompareResult {
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
