import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashUnknownOpenNeedsPeakSpread {
  unknownRegionCount: number;
  minOpenNeeds: number;
  maxOpenNeeds: number;
  peakSpread: number;
}

/** Spread of open-need counts across unknown-owned snapshot rows. */
export function nrDashBuildUnknownOpenNeedsPeakSpread(
  snap: NrDashAuthSnapshot | null
): NrDashUnknownOpenNeedsPeakSpread | null {
  if (!snap?.regions.length) return null;
  const unknown = snap.regions.filter(r => r.owner === 'unknown');
  if (unknown.length <= 1) return null;
  const counts = unknown.map(r => r.openNeeds);
  const minOpenNeeds = Math.min(...counts);
  const maxOpenNeeds = Math.max(...counts);
  const peakSpread = maxOpenNeeds - minOpenNeeds;
  if (peakSpread <= 0) return null;
  return {
    unknownRegionCount: unknown.length,
    minOpenNeeds,
    maxOpenNeeds,
    peakSpread,
  };
}
