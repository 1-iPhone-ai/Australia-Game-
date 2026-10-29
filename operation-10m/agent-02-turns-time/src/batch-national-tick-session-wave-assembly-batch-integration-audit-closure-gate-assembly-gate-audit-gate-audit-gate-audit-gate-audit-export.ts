import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate-audit.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 37 wave 37: flatten audit-gate audit gate audit gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.auditGateExport.latchDigest,
  };
}
