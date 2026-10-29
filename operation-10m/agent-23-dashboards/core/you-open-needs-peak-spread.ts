import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashYouOpenNeedsPeakSpread {
  youRegionCount: number;
  minOpenNeeds: number;
  maxOpenNeeds: number;
  peakSpread: number;
}

/** Spread of open-need counts across player-owned snapshot rows. */
export function nrDashBuildYouOpenNeedsPeakSpread(
  snap: NrDashAuthSnapshot | null
): NrDashYouOpenNeedsPeakSpread | null {
  if (!snap?.regions.length) return null;
  const you = snap.regions.filter(r => r.owner === 'you');
  if (you.length <= 1) return null;
  const counts = you.map(r => r.openNeeds);
  const minOpenNeeds = Math.min(...counts);
  const maxOpenNeeds = Math.max(...counts);
  const peakSpread = maxOpenNeeds - minOpenNeeds;
  if (peakSpread <= 0) return null;
  return {
    youRegionCount: you.length,
    minOpenNeeds,
    maxOpenNeeds,
    peakSpread,
  };
}
