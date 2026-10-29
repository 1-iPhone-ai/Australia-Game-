import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-assembly-gate-audit-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  latchDigest: string;
  auditDigest: string;
}

/**
 * Round 32 wave 32: flatten closure gate assembly gate audit gate for Agent 25 manifest hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateAssemblyGateAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    latchDigest: gate.latchDigest,
    auditDigest: gate.export.auditDigest,
  };
}
