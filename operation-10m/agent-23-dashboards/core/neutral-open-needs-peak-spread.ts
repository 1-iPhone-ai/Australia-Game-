import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNeutralOpenNeedsPeakSpread {
  neutralRegionCount: number;
  minOpenNeeds: number;
  maxOpenNeeds: number;
  peakSpread: number;
}

/** Spread of open-need counts across neutral-owned snapshot rows. */
export function nrDashBuildNeutralOpenNeedsPeakSpread(
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOpenNeedsPeakSpread | null {
  if (!snap?.regions.length) return null;
  const neutral = snap.regions.filter(r => r.owner === 'neutral');
  if (neutral.length <= 1) return null;
  const counts = neutral.map(r => r.openNeeds);
  const minOpenNeeds = Math.min(...counts);
  const maxOpenNeeds = Math.max(...counts);
  const peakSpread = maxOpenNeeds - minOpenNeeds;
  if (peakSpread <= 0) return null;
  return {
    neutralRegionCount: neutral.length,
    minOpenNeeds,
    maxOpenNeeds,
    peakSpread,
  };
}
