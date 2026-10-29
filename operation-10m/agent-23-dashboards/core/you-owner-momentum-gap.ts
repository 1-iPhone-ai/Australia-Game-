import { NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashYouOwnerMomentumGap {
  ownedRegionCount: number;
  nationalMeanRank: number;
  ownedMeanRank: number;
  momentumGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Absolute gap between player-owned and national mean momentum ranks. */
export function nrDashBuildYouOwnerMomentumGap(
  snap: NrDashAuthSnapshot | null
): NrDashYouOwnerMomentumGap | null {
  if (!snap?.regions.length) return null;
  const owned = snap.regions.filter(r => r.owner === 'you');
  if (!owned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const ownedMeanRank = owned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / owned.length;
  const momentumGap = Math.round(Math.abs(ownedMeanRank - nationalMeanRank) * 100) / 100;
  return {
    ownedRegionCount: owned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    ownedMeanRank: Math.round(ownedMeanRank * 100) / 100,
    momentumGap,
  };
}
