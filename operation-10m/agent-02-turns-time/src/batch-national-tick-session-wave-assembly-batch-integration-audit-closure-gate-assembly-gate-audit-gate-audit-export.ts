import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 33 wave 33: flatten audit-gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.auditGateExport.latchDigest,
  };
}
