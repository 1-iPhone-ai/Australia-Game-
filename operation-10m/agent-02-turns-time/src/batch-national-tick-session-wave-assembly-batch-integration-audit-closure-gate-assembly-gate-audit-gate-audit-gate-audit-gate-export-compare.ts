import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  auditDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 37 wave 37: compare two audit-gate audit gate audit gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const auditDigestMatch = baseline.auditDigest === candidate.auditDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && auditDigestMatch && okFlagMatch,
    latchDigestMatch,
    auditDigestMatch,
    okFlagMatch,
  };
}
