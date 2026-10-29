import type { BatchNationalTickSessionWaveAssemblyBatchExport } from './batch-national-tick-session-wave-assembly-batch-export.js';

export interface BatchNationalTickSessionWaveAssemblyBatchExportCompareResult {
  ok: boolean;
  batchDigestMatch: boolean;
  runCountDelta: number;
  allOkMatch: boolean;
}

/**
 * Round 21: compare two assembly batch exports (twin-run / regression checks).
 */
export function compareBatchNationalTickSessionWaveAssemblyBatchExports(
  baseline: BatchNationalTickSessionWaveAssemblyBatchExport,
  candidate: BatchNationalTickSessionWaveAssemblyBatchExport,
): BatchNationalTickSessionWaveAssemblyBatchExportCompareResult {
  const runCountDelta = candidate.runCount - baseline.runCount;
  const batchDigestMatch = baseline.batchDigest === candidate.batchDigest;
  const allOkMatch = baseline.allOk === candidate.allOk;
  return {
    ok:
      batchDigestMatch &&
      allOkMatch &&
      runCountDelta === 0 &&
      baseline.runCount === candidate.runCount,
    batchDigestMatch,
    runCountDelta,
    allOkMatch,
  };
}
