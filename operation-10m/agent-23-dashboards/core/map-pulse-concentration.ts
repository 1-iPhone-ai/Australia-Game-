import { nrDashBuildRegionMapNodes } from './region-map-model.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashMapPulseConcentration {
  regionCount: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of map pulse intensities across region nodes. */
export function nrDashBuildMapPulseConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashMapPulseConcentration | null {
  if (!snap?.regions.length) return null;
  const pulses = nrDashBuildMapPulseRows(nrDashBuildRegionMapNodes(snap));
  const total = pulses.reduce((s, p) => s + p.intensity, 0);
  if (total <= 0) return null;
  let topRegionId: string | null = null;
  let topIntensity = 0;
  let concentrationIndex = 0;
  pulses.forEach(p => {
    if (p.intensity > topIntensity) {
      topIntensity = p.intensity;
      topRegionId = p.regionId;
    }
    const share = p.intensity / total;
    concentrationIndex += share * share;
  });
  return {
    regionCount: pulses.length,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topIntensity / total) * 1000) / 1000,
  };
}
