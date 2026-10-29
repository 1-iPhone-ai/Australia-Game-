import { nrDashBuildRiskExposure } from './risk-exposure.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashOwnedRiskExposureShare {
  ownedRegionCount: number;
  totalExposure: number;
  ownedExposure: number;
  ownedShare: number;
}

/** Share of aggregate LR risk exposure index on player-owned regions. */
export function nrDashBuildOwnedRiskExposureShare(
  snap: NrDashAuthSnapshot | null
): NrDashOwnedRiskExposureShare | null {
  const exposure = nrDashBuildRiskExposure(snap);
  if (!exposure || exposure.totalExposure <= 0) return null;
  const owned = exposure.rows.filter(r => {
    const row = snap?.regions.find(x => x.regionId === r.regionId);
    return row?.owner === 'you';
  });
  if (!owned.length) return null;
  const ownedExposure = owned.reduce((s, r) => s + r.exposureScore, 0);
  return {
    ownedRegionCount: owned.length,
    totalExposure: exposure.totalExposure,
    ownedExposure,
    ownedShare: Math.round((ownedExposure / exposure.totalExposure) * 1000) / 1000,
  };
}
