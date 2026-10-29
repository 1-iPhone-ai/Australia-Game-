import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashResilienceBandDiversity {
  regionCount: number;
  distinctBands: number;
  diversityIndex: number;
  dominantBand: string | null;
}

/** Herfindahl clustering of NS resilience band labels on merged snapshot rows. */
export function nrDashBuildResilienceBandDiversity(
  snap: NrDashAuthSnapshot | null
): NrDashResilienceBandDiversity | null {
  if (!snap?.regions.length) return null;
  const counts = new Map<string, number>();
  snap.regions.forEach(r => {
    if (!r.resilienceBand) return;
    counts.set(r.resilienceBand, (counts.get(r.resilienceBand) ?? 0) + 1);
  });
  if (!counts.size) return null;
  const regionCount = [...counts.values()].reduce((s, n) => s + n, 0);
  let dominantBand: string | null = null;
  let topCount = 0;
  let diversityIndex = 0;
  counts.forEach((count, band) => {
    if (count > topCount) {
      topCount = count;
      dominantBand = band;
    }
    const share = count / regionCount;
    diversityIndex += share * share;
  });
  return {
    regionCount,
    distinctBands: counts.size,
    diversityIndex: Math.round(diversityIndex * 1000) / 1000,
    dominantBand,
  };
}
