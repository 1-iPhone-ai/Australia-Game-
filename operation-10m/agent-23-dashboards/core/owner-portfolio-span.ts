import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOwnerPortfolioSpan {
  ownerSlots: number;
  minPortfolio: number;
  maxPortfolio: number;
  portfolioSpread: number;
}

/** Spread of region counts across ownership labels on the snapshot. */
export function nrDashBuildOwnerPortfolioSpan(
  snap: NrDashAuthSnapshot | null
): NrDashOwnerPortfolioSpan | null {
  if (!snap?.regions.length) return null;
  const counts: Record<NrDashAuthSnapshot['regions'][number]['owner'], number> = {
    you: 0,
    rival: 0,
    neutral: 0,
    unknown: 0,
  };
  snap.regions.forEach(r => {
    counts[r.owner] += 1;
  });
  const values = Object.values(counts);
  const minPortfolio = Math.min(...values);
  const maxPortfolio = Math.max(...values);
  return {
    ownerSlots: values.length,
    minPortfolio,
    maxPortfolio,
    portfolioSpread: maxPortfolio - minPortfolio,
  };
}
