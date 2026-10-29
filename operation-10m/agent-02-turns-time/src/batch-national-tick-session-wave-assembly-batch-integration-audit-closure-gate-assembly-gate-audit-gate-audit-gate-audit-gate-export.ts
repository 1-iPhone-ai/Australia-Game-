import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate-audit-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  auditDigest: string;
}

/**
 * Round 36 wave 36: flatten audit-gate audit gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    auditDigest: gate.export.auditDigest,
  };
}
