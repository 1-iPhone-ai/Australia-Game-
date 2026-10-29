import { nrDashBuildRiskExposure } from './risk-exposure.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashRivalRiskExposureShare {
  rivalRegionCount: number;
  totalExposure: number;
  rivalExposure: number;
  rivalShare: number;
}

/** Share of aggregate LR risk exposure on rival-owned regions. */
export function nrDashBuildRivalRiskExposureShare(
  snap: NrDashAuthSnapshot | null
): NrDashRivalRiskExposureShare | null {
  const exposure = nrDashBuildRiskExposure(snap);
  if (!exposure || exposure.totalExposure <= 0) return null;
  const rival = exposure.rows.filter(r => {
    const row = snap?.regions.find(x => x.regionId === r.regionId);
    return row?.owner === 'rival';
  });
  if (!rival.length) return null;
  const rivalExposure = rival.reduce((s, r) => s + r.exposureScore, 0);
  return {
    rivalRegionCount: rival.length,
    totalExposure: exposure.totalExposure,
    rivalExposure,
    rivalShare: Math.round((rivalExposure / exposure.totalExposure) * 1000) / 1000,
  };
}
