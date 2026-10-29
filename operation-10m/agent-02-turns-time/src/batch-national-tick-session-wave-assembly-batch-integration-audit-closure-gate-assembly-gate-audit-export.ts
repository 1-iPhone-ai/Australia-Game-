import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport {
  ok: boolean;
  auditDigest: string;
  exportCompareOk: boolean;
  parityOk: boolean;
  latchDigest: string;
}

/**
 * Round 31 wave 31: flatten closure gate assembly gate audit for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAudit(
  audit: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditExport {
  return {
    ok: audit.ok,
    auditDigest: audit.auditDigest,
    exportCompareOk: audit.exportCompareOk,
    parityOk: audit.parityOk,
    latchDigest: audit.gateExport.latchDigest,
  };
}
