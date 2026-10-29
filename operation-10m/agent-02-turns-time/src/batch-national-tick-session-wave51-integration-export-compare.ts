import type { BatchNationalTickSessionWave51IntegrationExport } from './batch-national-tick-session-wave51-integration-export.js';

export interface BatchNationalTickSessionWave51IntegrationExportCompareResult {
  ok: boolean;
  sealDigestMatch: boolean;
  commitDigestMatch: boolean;
  latchDigestMatch: boolean;
  baselineShaMatch: boolean;
  projectedLocMatch: boolean;
  okFlagMatch: boolean;
}

/**
 * Round 51 wave 51: compare two O10-232 integration-seal exports.
 */
export function compareBatchNationalTickSessionWave51IntegrationExports(
  baseline: BatchNationalTickSessionWave51IntegrationExport,
  candidate: BatchNationalTickSessionWave51IntegrationExport,
): BatchNationalTickSessionWave51IntegrationExportCompareResult {
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
