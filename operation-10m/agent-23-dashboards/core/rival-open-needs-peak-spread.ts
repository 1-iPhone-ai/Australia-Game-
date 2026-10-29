import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashRivalOpenNeedsPeakSpread {
  rivalRegionCount: number;
  minOpenNeeds: number;
  maxOpenNeeds: number;
  peakSpread: number;
}

/** Spread of open-need counts across rival-owned snapshot rows. */
export function nrDashBuildRivalOpenNeedsPeakSpread(
  snap: NrDashAuthSnapshot | null
): NrDashRivalOpenNeedsPeakSpread | null {
  if (!snap?.regions.length) return null;
  const rival = snap.regions.filter(r => r.owner === 'rival');
  if (rival.length <= 1) return null;
  const counts = rival.map(r => r.openNeeds);
  const minOpenNeeds = Math.min(...counts);
  const maxOpenNeeds = Math.max(...counts);
  const peakSpread = maxOpenNeeds - minOpenNeeds;
  if (peakSpread <= 0) return null;
  return {
    rivalRegionCount: rival.length,
    minOpenNeeds,
    maxOpenNeeds,
    peakSpread,
  };
}
