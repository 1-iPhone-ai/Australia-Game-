import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashDevelopmentTierDiversity {
  regionCount: number;
  distinctTiers: number;
  diversityIndex: number;
  dominantTier: string | null;
}

/** Herfindahl-style diversity of LR development tier labels on snapshot rows. */
export function nrDashBuildDevelopmentTierDiversity(
  snap: NrDashAuthSnapshot | null
): NrDashDevelopmentTierDiversity | null {
  if (!snap?.regions.length) return null;
  const counts = new Map<string, number>();
  snap.regions.forEach(r => {
    counts.set(r.developmentTier, (counts.get(r.developmentTier) ?? 0) + 1);
  });
  const regionCount = snap.regions.length;
  let dominantTier: string | null = null;
  let topCount = 0;
  let diversityIndex = 0;
  counts.forEach((count, tier) => {
    if (count > topCount) {
      topCount = count;
      dominantTier = tier;
    }
    const share = count / regionCount;
    diversityIndex += share * share;
  });
  return {
    regionCount,
    distinctTiers: counts.size,
    diversityIndex: Math.round(diversityIndex * 1000) / 1000,
    dominantTier,
  };
}
