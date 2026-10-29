import type { BatchNationalTickSessionWave50IntegrationExport } from './batch-national-tick-session-wave50-integration-export.js';

export interface BatchNationalTickSessionWave50IntegrationExportCompareResult {
  ok: boolean;
  sealDigestMatch: boolean;
  commitDigestMatch: boolean;
  latchDigestMatch: boolean;
  baselineShaMatch: boolean;
  projectedLocMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 50 wave 50: compare two O10-230 integration-seal exports.
 */
export function compareBatchNationalTickSessionWave50IntegrationExports(
  baseline: BatchNationalTickSessionWave50IntegrationExport,
  candidate: BatchNationalTickSessionWave50IntegrationExport,
): BatchNationalTickSessionWave50IntegrationExportCompareResult {
  const sealDigestMatch = baseline.sealDigest === candidate.sealDigest;
  const commitDigestMatch = baseline.commitDigest === candidate.commitDigest;
  const latchDigestMatch = baseline.latchDigest === candidate.latchDigest;
  const baselineShaMatch = baseline.baselineSha === candidate.baselineSha;
  const projectedLocMatch = baseline.projectedLoc === candidate.projectedLoc;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok:
      sealDigestMatch &&
      commitDigestMatch &&
      latchDigestMatch &&
      baselineShaMatch &&
      projectedLocMatch &&
      okFlagMatch,
    sealDigestMatch,
    commitDigestMatch,
    latchDigestMatch,
    baselineShaMatch,
    projectedLocMatch,
    okFlagMatch,
  };
}
