import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashMomentumBandDiversity {
  regionCount: number;
  distinctBands: number;
  diversityIndex: number;
  dominantBand: string | null;
}

/** Herfindahl clustering of LR momentum band labels on snapshot rows. */
export function nrDashBuildMomentumBandDiversity(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumBandDiversity | null {
  if (!snap?.regions.length) return null;
  const counts = new Map<string, number>();
  snap.regions.forEach(r => {
    counts.set(r.momentumBand, (counts.get(r.momentumBand) ?? 0) + 1);
  });
  const regionCount = snap.regions.length;
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
