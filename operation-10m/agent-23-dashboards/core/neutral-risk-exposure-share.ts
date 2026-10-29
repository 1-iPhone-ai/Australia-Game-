import { nrDashBuildRiskExposure } from './risk-exposure.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNeutralRiskExposureShare {
  neutralRegionCount: number;
  totalExposure: number;
  neutralExposure: number;
  neutralShare: number;
}

/** Share of aggregate LR risk exposure on neutral-owned regions. */
export function nrDashBuildNeutralRiskExposureShare(
  snap: NrDashAuthSnapshot | null
): NrDashNeutralRiskExposureShare | null {
  const exposure = nrDashBuildRiskExposure(snap);
  if (!exposure || exposure.totalExposure <= 0) return null;
  const neutral = exposure.rows.filter(r => {
    const row = snap?.regions.find(x => x.regionId === r.regionId);
    return row?.owner === 'neutral';
  });
  if (!neutral.length) return null;
  const neutralExposure = neutral.reduce((s, r) => s + r.exposureScore, 0);
  return {
    neutralRegionCount: neutral.length,
    totalExposure: exposure.totalExposure,
    neutralExposure,
    neutralShare: Math.round((neutralExposure / exposure.totalExposure) * 1000) / 1000,
  };
}
