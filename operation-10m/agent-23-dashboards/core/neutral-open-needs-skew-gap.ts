import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNeutralOpenNeedsSkewGap {
  neutralRegionCount: number;
  neutralMeanOpenNeeds: number;
  nationalMeanOpenNeeds: number;
  ownershipSkew: number;
  openNeedsSkewGap: number;
}

/** Open-needs and ownership skew gap on neutral-owned snapshot rows. */
export function nrDashBuildNeutralOpenNeedsSkewGap(
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOpenNeedsSkewGap | null {
  if (!snap?.regions.length) return null;
  const neutral = snap.regions.filter(r => r.owner === 'neutral');
  if (!neutral.length) return null;
  const regionCount = snap.regions.length;
  const nationalMeanOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0) / regionCount;
  const neutralMeanOpenNeeds = neutral.reduce((s, r) => s + r.openNeeds, 0) / neutral.length;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  const neutralOpenNeeds = neutral.reduce((s, r) => s + r.openNeeds, 0);
  const neutralShare = neutral.length / regionCount;
  const needsShareSkew =
    totalOpenNeeds > 0 ? Math.abs(neutralOpenNeeds / totalOpenNeeds - neutralShare) : 0;
  const ownershipSkew = Math.round(needsShareSkew * 1000) / 1000;
  const openNeedsSkewGap =
    Math.round((Math.abs(neutralMeanOpenNeeds - nationalMeanOpenNeeds) + needsShareSkew) * 1000) / 1000;
  return {
    neutralRegionCount: neutral.length,
    neutralMeanOpenNeeds: Math.round(neutralMeanOpenNeeds * 1000) / 1000,
    nationalMeanOpenNeeds: Math.round(nationalMeanOpenNeeds * 1000) / 1000,
    ownershipSkew,
    openNeedsSkewGap,
  };
}
