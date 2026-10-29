import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOpenNeedsSpread {
  regionCount: number;
  totalOpenNeeds: number;
  meanOpenNeeds: number;
  stdDev: number;
}

/** Cross-region dispersion of LR open-need counts on the snapshot. */
export function nrDashBuildOpenNeedsSpread(
  snap: NrDashAuthSnapshot | null
): NrDashOpenNeedsSpread | null {
  if (!snap?.regions.length) return null;
  const counts = snap.regions.map(r => r.openNeeds);
  const totalOpenNeeds = counts.reduce((s, n) => s + n, 0);
  const meanOpenNeeds = totalOpenNeeds / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanOpenNeeds) ** 2, 0) / Math.max(counts.length, 1);
  return {
    regionCount: counts.length,
    totalOpenNeeds,
    meanOpenNeeds: Math.round(meanOpenNeeds * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}
