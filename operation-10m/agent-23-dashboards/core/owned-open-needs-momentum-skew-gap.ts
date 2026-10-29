import { NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOwnedOpenNeedsMomentumSkewGap {
  ownedRegionCount: number;
  openNeedsGap: number;
  momentumGap: number;
  portfolioSkewGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Combined open-needs and momentum skew gap on player-owned snapshot rows. */
export function nrDashBuildOwnedOpenNeedsMomentumSkewGap(
  snap: NrDashAuthSnapshot | null
): NrDashOwnedOpenNeedsMomentumSkewGap | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const regionCount = snap.regions.length;
  const nationalMeanNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0) / regionCount;
  const ownedMeanNeeds = owned.reduce((s, r) => s + r.openNeeds, 0) / owned.length;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / regionCount;
  const ownedMeanRank = owned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / owned.length;
  const openNeedsGap = Math.round(Math.abs(ownedMeanNeeds - nationalMeanNeeds) * 1000) / 1000;
  const momentumGap = Math.round(Math.abs(ownedMeanRank - nationalMeanRank) * 100) / 100;
  const portfolioSkewGap = Math.round((openNeedsGap + momentumGap) * 1000) / 1000;
  return {
    ownedRegionCount: owned.length,
    openNeedsGap,
    momentumGap,
    portfolioSkewGap,
  };
}
