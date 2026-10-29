import type { BatchNationalTickSessionWave51IntegrationExport } from './batch-national-tick-session-wave51-integration-export.js';

export interface BatchNationalTickSessionWave51IntegrationExportCompareResult {
  ok: boolean;
  sealDigestMatch: boolean;
  innerSealDigestMatch: boolean;
  innerCommitDigestMatch: boolean;
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
  const innerSealDigestMatch = baseline.innerSealDigest === candidate.innerSealDigest;
  const innerCommitDigestMatch = baseline.innerCommitDigest === candidate.innerCommitDigest;
  const baselineShaMatch = baseline.baselineSha === candidate.baselineSha;
  const projectedLocMatch = baseline.projectedLoc === candidate.projectedLoc;
  const okFlagMatch = baseline.ok === candidate.ok;
  return {
    ok:
      sealDigestMatch &&
      innerSealDigestMatch &&
      innerCommitDigestMatch &&
      baselineShaMatch &&
      projectedLocMatch &&
      okFlagMatch,
    sealDigestMatch,
    innerSealDigestMatch,
    innerCommitDigestMatch,
    baselineShaMatch,
    projectedLocMatch,
    okFlagMatch,
  };
}
