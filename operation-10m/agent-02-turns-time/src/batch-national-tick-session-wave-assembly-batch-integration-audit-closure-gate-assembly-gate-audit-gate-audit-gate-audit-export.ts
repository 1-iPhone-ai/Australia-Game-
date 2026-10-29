import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 35 wave 35: flatten audit-gate audit gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.auditGateExport.latchDigest,
  };
}
