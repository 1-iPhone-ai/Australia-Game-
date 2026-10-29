import { NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOwnedMomentumSkew {
  ownedRegionCount: number;
  nationalMeanRank: number;
  ownedMeanRank: number;
  /** Owned minus national mean momentum rank (positive = hotter portfolio). */
  rankSkew: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Player-owned momentum band ranks vs national LR snapshot average. */
export function nrDashBuildOwnedMomentumSkew(snap: NrDashAuthSnapshot | null): NrDashOwnedMomentumSkew | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const ownedMeanRank = owned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / owned.length;
  const rankSkew = Math.round((ownedMeanRank - nationalMeanRank) * 100) / 100;
  return {
    ownedRegionCount: owned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    ownedMeanRank: Math.round(ownedMeanRank * 100) / 100,
    rankSkew,
  };
}
