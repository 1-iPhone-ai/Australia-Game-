import { NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNeutralOwnerMomentumGap {
  neutralRegionCount: number;
  nationalMeanRank: number;
  neutralMeanRank: number;
  momentumGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Absolute gap between neutral-owned and national mean momentum ranks. */
export function nrDashBuildNeutralOwnerMomentumGap(
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOwnerMomentumGap | null {
  if (!snap?.regions.length) return null;
  const neutralOwned = snap.regions.filter(r => r.owner === 'neutral');
  if (!neutralOwned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const neutralMeanRank =
    neutralOwned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / neutralOwned.length;
  const momentumGap = Math.round(Math.abs(neutralMeanRank - nationalMeanRank) * 100) / 100;
  return {
    neutralRegionCount: neutralOwned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    neutralMeanRank: Math.round(neutralMeanRank * 100) / 100,
    momentumGap,
  };
}
