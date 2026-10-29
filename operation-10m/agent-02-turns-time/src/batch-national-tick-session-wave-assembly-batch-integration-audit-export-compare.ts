import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExportCompareResult {
  ok: boolean;
  integrationDigestMatch: boolean;
  gateDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 23: compare two integration audit exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditExportCompareResult {
  const integrationDigestMatch = baseline.integrationDigest === candidate.integrationDigest;
  const gateDigestMatch = baseline.gateDigest === candidate.gateDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: integrationDigestMatch && gateDigestMatch && okFlagMatch,
    integrationDigestMatch,
    gateDigestMatch,
    okFlagMatch,
  };
}
