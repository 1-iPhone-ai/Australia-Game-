import type { BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport } from './batch-national-tick-session-wave-assembly-batch-integration-audit-closure-gate-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExportCompareResult {
  ok: boolean;
  latchDigestMatch: boolean;
  closureDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 27: compare two closure gate exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExport,
): BatchNationalTickSessionWaveAssemblyBatchIntegrationAuditClosureGateExportCompareResult {
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const closureDigestMatch = baseline.closureDigest === candidate.closureDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: latchDigestMatch && closureDigestMatch && okFlagMatch,
    latchDigestMatch,
    closureDigestMatch,
    okFlagMatch,
  };
}
