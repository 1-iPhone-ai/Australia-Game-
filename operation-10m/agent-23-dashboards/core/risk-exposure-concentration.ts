import { nrDashBuildRiskExposure } from './risk-exposure.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashRiskExposureConcentration {
  totalExposure: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of LR risk exposure scores across regions. */
export function nrDashBuildRiskExposureConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashRiskExposureConcentration | null {
  const exposure = nrDashBuildRiskExposure(snap);
  if (!exposure || exposure.totalExposure <= 0) return null;
  let topRegionId: string | null = null;
  let topScore = 0;
  let concentrationIndex = 0;
  exposure.rows.forEach(r => {
    if (r.exposureScore > topScore) {
      topScore = r.exposureScore;
      topRegionId = r.regionId;
    }
    const share = r.exposureScore / exposure.totalExposure;
    concentrationIndex += share * share;
  });
  return {
    totalExposure: exposure.totalExposure,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topScore / exposure.totalExposure) * 1000) / 1000,
  };
}
