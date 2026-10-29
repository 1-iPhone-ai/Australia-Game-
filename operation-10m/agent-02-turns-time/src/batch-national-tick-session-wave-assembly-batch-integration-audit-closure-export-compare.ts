import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExportCompareResult {
  ok: boolean;
  closureDigestMatch: boolean;
  gateDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 26: compare two integration audit closure exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureExportCompareResult {
  const closureDigestMatch = baseline.closureDigest === candidate.closureDigest;
  const gateDigestMatch = baseline.gateDigest === candidate.gateDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: closureDigestMatch && gateDigestMatch && okFlagMatch,
    closureDigestMatch,
    gateDigestMatch,
    okFlagMatch,
  };
}
