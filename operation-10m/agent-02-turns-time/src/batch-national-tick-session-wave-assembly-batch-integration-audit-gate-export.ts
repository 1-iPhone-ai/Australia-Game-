import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult } from './batch-national-tick-session-wave-assembly-batch-integration-audit-gate.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport {
  ok: boolean;
  auditOk: boolean;
  parityOk: boolean;
  gateDigest: string;
  integrationDigest: string;
}

/**
 * Round 24: flatten integration audit gate for Agent 25 assembly closure hooks.
 */
export function exportBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGate(
  gate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateResult,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport {
  return {
    ok: gate.ok,
    auditOk: gate.auditOk,
    parityOk: gate.parityOk,
    gateDigest: gate.gateDigest,
    integrationDigest: gate.export.integrationDigest,
  };
}
