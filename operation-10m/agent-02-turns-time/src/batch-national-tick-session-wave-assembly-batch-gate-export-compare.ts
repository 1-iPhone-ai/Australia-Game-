import type { BatchNationalTickSessionWaveAssemblyBatchGateExport } from './batch-national-tick-session-wave-assembly-batch-gate-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchGateExportCompareResult {
  ok: boolean;
  gateDigestMatch: boolean;
  batchDigestMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 22: compare two assembly batch gate exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchGateExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchGateExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchGateExport,
): BatchNationalTickSessionWaveAssemblyBatchGateExportCompareResult {
  const gateDigestMatch = baseline.gateDigest === candidate.gateDigest;
  const batchDigestMatch = baseline.batchDigest === candidate.batchDigest;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok: gateDigestMatch && batchDigestMatch && okFlagMatch,
    gateDigestMatch,
    batchDigestMatch,
    okFlagMatch,
  };
}
