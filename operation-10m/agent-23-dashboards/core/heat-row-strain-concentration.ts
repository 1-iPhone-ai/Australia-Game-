import { nrDashBuildHeatRowSummaries } from './heat-summary.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashHeatRowStrainConcentration {
  regionCount: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of per-region strained network counts (heat summaries). */
export function nrDashBuildHeatRowStrainConcentration(
  ns: NationalSystemsState | null
): NrDashHeatRowStrainConcentration | null {
  const rows = nrDashBuildHeatRowSummaries(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.strainedNetworks, 0);
  if (total <= 0) return null;
  let topRegionId: string | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.strainedNetworks > topCount) {
      topCount = r.strainedNetworks;
      topRegionId = r.regionId;
    }
    const share = r.strainedNetworks / total;
    concentrationIndex += share * share;
  });
  return {
    regionCount: rows.length,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topCount / total) * 1000) / 1000,
  };
}
