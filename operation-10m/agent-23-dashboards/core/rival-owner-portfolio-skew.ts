import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashRivalOwnerPortfolioSkew {
  regionCount: number;
  rivalShare: number;
  youShare: number;
  portfolioSkew: number;
}

/** Rival minus player ownership share on the merged regional snapshot. */
export function nrDashBuildRivalOwnerPortfolioSkew(
  snap: NrDashAuthSnapshot | null
): NrDashRivalOwnerPortfolioSkew | null {
  if (!snap?.regions.length) return null;
  const regionCount = snap.regions.length;
  let rivalCount = 0;
  let youCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'rival') rivalCount += 1;
    if (r.owner === 'you') youCount += 1;
  });
  if (rivalCount <= 0) return null;
  const rivalShare = Math.round((rivalCount / regionCount) * 1000) / 1000;
  const youShare = Math.round((youCount / regionCount) * 1000) / 1000;
  return {
    regionCount,
    rivalShare,
    youShare,
    portfolioSkew: Math.round((rivalShare - youShare) * 1000) / 1000,
  };
}
