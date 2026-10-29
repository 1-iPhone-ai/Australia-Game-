import { nrDashBuildRegionMapNodes } from './region-map-model.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashActivityWeightSpread {
  regionCount: number;
  meanWeight: number;
  stdDev: number;
  outlierRegionId: string | null;
}

/** Cross-region dispersion of LR momentum history activity weights on map nodes. */
export function nrDashBuildActivityWeightSpread(
  snap: NrDashAuthSnapshot | null
): NrDashActivityWeightSpread | null {
  if (!snap?.regions.length) return null;
  const rows = nrDashBuildRegionMapNodes(snap).map(n => ({
    regionId: n.regionId,
    weight: n.activityWeight,
  }));
  const values = rows.map(r => r.weight);
  const meanWeight = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanWeight) ** 2, 0) / Math.max(values.length, 1);
  const ranked = [...rows].sort((a, b) => b.weight - a.weight || a.regionId.localeCompare(b.regionId));
  return {
    regionCount: rows.length,
    meanWeight: Math.round(meanWeight * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    outlierRegionId: ranked[0]?.weight ? ranked[0].regionId : null,
  };
}
