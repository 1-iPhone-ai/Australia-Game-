import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNationalOpenNeedsPeakSpread {
  regionCount: number;
  minOpenNeeds: number;
  maxOpenNeeds: number;
  peakSpread: number;
}

/** Spread of regional open-need counts across the merged snapshot (national view). */
export function nrDashBuildNationalOpenNeedsPeakSpread(
  snap: NrDashAuthSnapshot | null
): NrDashNationalOpenNeedsPeakSpread | null {
  if (!snap?.regions.length) return null;
  const counts = snap.regions.map(r => r.openNeeds);
  const minOpenNeeds = Math.min(...counts);
  const maxOpenNeeds = Math.max(...counts);
  const peakSpread = maxOpenNeeds - minOpenNeeds;
  if (peakSpread <= 0) return null;
  return {
    regionCount: counts.length,
    minOpenNeeds,
    maxOpenNeeds,
    peakSpread,
  };
}
