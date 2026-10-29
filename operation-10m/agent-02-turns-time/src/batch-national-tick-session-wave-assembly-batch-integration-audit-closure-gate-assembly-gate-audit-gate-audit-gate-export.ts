import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate-audit-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  auditDigest: string;
}

/**
 * Round 34 wave 34: flatten audit-gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    auditDigest: gate.export.auditDigest,
  };
}
