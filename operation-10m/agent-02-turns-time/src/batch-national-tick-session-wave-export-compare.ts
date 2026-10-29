import type { BatchNationalTickSessionWaveExport } from './batch-national-tick-session-wave-export.js';

export interface BatchNationalTickSessionWaveExportCompareResult {
  ok: boolean;
  waveDigestMatch: boolean;
  ledgerDigestMatch: boolean;
  sessionCountDelta: number;
  allOkMatch: boolean;
}

/**
 * Round 18: compare two flattened session wave exports (regression / twin-run checks).
 */
export function compareBatchNationalTickSessionWaveExports(
  baseline: BatchNationalTickSessionWaveExport,
  candidate: BatchNationalTickSessionWaveExport,
): BatchNationalTickSessionWaveExportCompareResult {
  const sessionCountDelta = candidate.sessionCount - baseline.sessionCount;
  const waveDigestMatch = baseline.waveDigest === candidate.waveDigest;
  const ledgerDigestMatch = baseline.ledgerDigest === candidate.ledgerDigest;
  const allOkMatch = baseline.allOk === candidate.allOk;
  return {
    ok:
      waveDigestMatch &&
      ledgerDigestMatch &&
      allOkMatch &&
      sessionCountDelta === 0 &&
      baseline.sessionCount === candidate.sessionCount,
    waveDigestMatch,
    ledgerDigestMatch,
    sessionCountDelta,
    allOkMatch,
  };
}
