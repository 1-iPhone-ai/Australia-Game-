import { NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashRivalOwnerMomentumGap {
  rivalRegionCount: number;
  nationalMeanRank: number;
  rivalMeanRank: number;
  momentumGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Absolute gap between rival-owned and national mean momentum ranks. */
export function nrDashBuildRivalOwnerMomentumGap(
  snap: NrDashAuthSnapshot | null
): NrDashRivalOwnerMomentumGap | null {
  if (!snap?.regions.length) return null;
  const rivalOwned = snap.regions.filter(r => r.owner === 'rival');
  if (!rivalOwned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const rivalMeanRank = rivalOwned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / rivalOwned.length;
  const momentumGap = Math.round(Math.abs(rivalMeanRank - nationalMeanRank) * 100) / 100;
  return {
    rivalRegionCount: rivalOwned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    rivalMeanRank: Math.round(rivalMeanRank * 100) / 100,
    momentumGap,
  };
}
