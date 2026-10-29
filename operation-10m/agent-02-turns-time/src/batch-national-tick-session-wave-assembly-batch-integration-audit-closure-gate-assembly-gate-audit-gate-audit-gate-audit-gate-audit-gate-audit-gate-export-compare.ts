import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit-gate-audit-gate-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  auditDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 41 wave 41: compare two audit-gate audit gate audit gate audit gate audit gate exports.
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditGateAuditGateExportCompareResult {
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
