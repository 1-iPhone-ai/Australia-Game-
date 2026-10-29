import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNeutralOwnerPortfolioSkew {
  regionCount: number;
  neutralShare: number;
  youShare: number;
  portfolioSkew: number;
}

/** Neutral minus player ownership share on the merged regional snapshot. */
export function nrDashBuildNeutralOwnerPortfolioSkew(
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOwnerPortfolioSkew | null {
  if (!snap?.regions.length) return null;
  const regionCount = snap.regions.length;
  let neutralCount = 0;
  let youCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'neutral') neutralCount += 1;
    if (r.owner === 'you') youCount += 1;
  });
  if (neutralCount <= 0) return null;
  const neutralShare = Math.round((neutralCount / regionCount) * 1000) / 1000;
  const youShare = Math.round((youCount / regionCount) * 1000) / 1000;
  return {
    regionCount,
    neutralShare,
    youShare,
    portfolioSkew: Math.round((neutralShare - youShare) * 1000) / 1000,
  };
}
