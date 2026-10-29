import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashRivalPortfolioSpan {
  youCount: number;
  rivalCount: number;
  portfolioSpread: number;
}

/** Absolute gap between player-owned and rival-owned region counts on the snapshot. */
export function nrDashBuildRivalPortfolioSpan(
  snap: NrDashAuthSnapshot | null
): NrDashRivalPortfolioSpan | null {
  if (!snap?.regions.length) return null;
  let youCount = 0;
  let rivalCount = 0;
  snap.regions.forEach(r => {
    if (r.owner === 'you') youCount += 1;
    if (r.owner === 'rival') rivalCount += 1;
  });
  return {
    youCount,
    rivalCount,
    portfolioSpread: Math.abs(youCount - rivalCount),
  };
}
