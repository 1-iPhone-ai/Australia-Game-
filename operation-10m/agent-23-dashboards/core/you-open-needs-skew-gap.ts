import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashYouOpenNeedsSkewGap {
  youRegionCount: number;
  youMeanOpenNeeds: number;
  nationalMeanOpenNeeds: number;
  ownershipSkew: number;
  openNeedsSkewGap: number;
}

/** Open-needs and ownership skew gap on player-owned snapshot rows. */
export function nrDashBuildYouOpenNeedsSkewGap(
  snap: NrDashAuthSnapshot | null
): NrDashYouOpenNeedsSkewGap | null {
  if (!snap?.regions.length) return null;
  const you = snap.regions.filter(r => r.owner === 'you');
  if (!you.length) return null;
  const regionCount = snap.regions.length;
  const nationalMeanOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0) / regionCount;
  const youMeanOpenNeeds = you.reduce((s, r) => s + r.openNeeds, 0) / you.length;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  const youOpenNeeds = you.reduce((s, r) => s + r.openNeeds, 0);
  const youShare = you.length / regionCount;
  const needsShareSkew =
    totalOpenNeeds > 0 ? Math.abs(youOpenNeeds / totalOpenNeeds - youShare) : 0;
  const ownershipSkew = Math.round(needsShareSkew * 1000) / 1000;
  const openNeedsSkewGap =
    Math.round((Math.abs(youMeanOpenNeeds - nationalMeanOpenNeeds) + needsShareSkew) * 1000) / 1000;
  return {
    youRegionCount: you.length,
    youMeanOpenNeeds: Math.round(youMeanOpenNeeds * 1000) / 1000,
    nationalMeanOpenNeeds: Math.round(nationalMeanOpenNeeds * 1000) / 1000,
    ownershipSkew,
    openNeedsSkewGap,
  };
}
