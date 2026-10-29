import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-gate-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExportCompareResult {
  ok: boolean;
  gateDigestMatch: boolean;
  integrationDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 24: compare two integration audit gate exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditGateExportCompareResult {
  const gateDigestMatch = baseline.gateDigest === candidate.gateDigest;
  const integrationDigestMatch = baseline.integrationDigest === candidate.integrationDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: gateDigestMatch && integrationDigestMatch && okFlagMatch,
    gateDigestMatch,
    integrationDigestMatch,
    okFlagMatch,
  };
}
