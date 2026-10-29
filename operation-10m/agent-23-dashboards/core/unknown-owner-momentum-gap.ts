import { NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashUnknownOwnerMomentumGap {
  unknownRegionCount: number;
  nationalMeanRank: number;
  unknownMeanRank: number;
  momentumGap: number;
}

function momentumRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Absolute gap between unknown-owned and national mean momentum ranks. */
export function nrDashBuildUnknownOwnerMomentumGap(
  snap: NrDashAuthSnapshot | null
): NrDashUnknownOwnerMomentumGap | null {
  if (!snap?.regions.length) return null;
  const unknownOwned = snap.regions.filter(r => r.owner === 'unknown');
  if (!unknownOwned.length) return null;
  const nationalMeanRank =
    snap.regions.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / snap.regions.length;
  const unknownMeanRank =
    unknownOwned.reduce((s, r) => s + momentumRank(r.momentumBand), 0) / unknownOwned.length;
  const momentumGap = Math.round(Math.abs(unknownMeanRank - nationalMeanRank) * 100) / 100;
  return {
    unknownRegionCount: unknownOwned.length,
    nationalMeanRank: Math.round(nationalMeanRank * 100) / 100,
    unknownMeanRank: Math.round(unknownMeanRank * 100) / 100,
    momentumGap,
  };
}
