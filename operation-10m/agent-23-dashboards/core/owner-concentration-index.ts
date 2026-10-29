import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOwnerConcentrationIndex {
  regionCount: number;
  concentrationIndex: number;
  dominantOwner: NrDashAuthSnapshot['regions'][number]['owner'];
  dominantShare: number;
}

/** Herfindahl clustering of region ownership labels on the snapshot. */
export function nrDashBuildOwnerConcentrationIndex(
  snap: NrDashAuthSnapshot | null
): NrDashOwnerConcentrationIndex | null {
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
  const regionCount = snap.regions.length;
  let dominantOwner: NrDashAuthSnapshot['regions'][number]['owner'] = 'unknown';
  let topCount = 0;
  let concentrationIndex = 0;
  (Object.keys(counts) as Array<keyof typeof counts>).forEach(owner => {
    const c = counts[owner];
    if (c > topCount) {
      topCount = c;
      dominantOwner = owner;
    }
    const share = c / regionCount;
    concentrationIndex += share * share;
  });
  return {
    regionCount,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    dominantOwner,
    dominantShare: Math.round((topCount / regionCount) * 1000) / 1000,
  };
}
