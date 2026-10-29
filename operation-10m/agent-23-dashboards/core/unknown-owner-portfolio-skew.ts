import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashUnknownOwnerPortfolioSkew {
  regionCount: number;
  unknownShare: number;
  youShare: number;
  portfolioSkew: number;
}

/** Unknown minus player ownership share on the merged regional snapshot. */
export function nrDashBuildUnknownOwnerPortfolioSkew(
  snap: NrDashAuthSnapshot | null
): NrDashUnknownOwnerPortfolioSkew | null {
  if (!snap?.regions.length) return null;
  const regionCount = snap.regions.length;
  let unknownCount = 0;
  let youCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'unknown') unknownCount += 1;
    if (r.owner === 'you') youCount += 1;
  });
  if (unknownCount <= 0) return null;
  const unknownShare = Math.round((unknownCount / regionCount) * 1000) / 1000;
  const youShare = Math.round((youCount / regionCount) * 1000) / 1000;
  return {
    regionCount,
    unknownShare,
    youShare,
    portfolioSkew: Math.round((unknownShare - youShare) * 1000) / 1000,
  };
}
