import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOpenNeedsConcentration {
  totalOpenNeeds: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl-style clustering of LR open needs across regions. */
export function nrDashBuildOpenNeedsConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashOpenNeedsConcentration | null {
  if (!snap?.regions.length) return null;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  if (totalOpenNeeds <= 0) return null;
  let topRegionId: string | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  snap.regions.forEach(r => {
    if (r.openNeeds > topCount) {
      topCount = r.openNeeds;
      topRegionId = r.regionId;
    }
    const share = r.openNeeds / totalOpenNeeds;
    concentrationIndex += share * share;
  });
  return {
    totalOpenNeeds,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topCount / totalOpenNeeds) * 1000) / 1000,
  };
}
