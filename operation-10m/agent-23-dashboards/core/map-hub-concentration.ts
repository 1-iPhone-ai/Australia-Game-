import { nrDashBuildMapHubIndex } from './map-hub-index.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashMapHubConcentration {
  regionCount: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of map hub scores (adjacency + dependency degree). */
export function nrDashBuildMapHubConcentration(
  ns: NationalSystemsState | null
): NrDashMapHubConcentration | null {
  const rows = nrDashBuildMapHubIndex(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.hubScore, 0);
  if (total <= 0) return null;
  let topRegionId: string | null = null;
  let topScore = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.hubScore > topScore) {
      topScore = r.hubScore;
      topRegionId = r.regionId;
    }
    const share = r.hubScore / total;
    concentrationIndex += share * share;
  });
  return {
    regionCount: rows.length,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topScore / total) * 1000) / 1000,
  };
}
