import { nrDashBuildMapHubIndex } from './map-hub-index.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashHubPulseAsymmetry {
  hubRegionCount: number;
  meanIntensity: number;
  maxIntensity: number;
  asymmetryGap: number;
}

/** Gap between hottest hub pulse and mean hub intensity on connectivity hubs. */
export function nrDashBuildHubPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashHubPulseAsymmetry | null {
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const hubs = nrDashBuildMapHubIndex(ns).filter(h => h.hubScore > 0);
  if (!hubs.length) return null;
  const intensities = hubs.map(h => pulseById.get(h.regionId) ?? 0);
  const meanIntensity = intensities.reduce((s, v) => s + v, 0) / intensities.length;
  const maxIntensity = Math.max(...intensities);
  return {
    hubRegionCount: intensities.length,
    meanIntensity: Math.round(meanIntensity * 1000) / 1000,
    maxIntensity: Math.round(maxIntensity * 1000) / 1000,
    asymmetryGap: Math.round((maxIntensity - meanIntensity) * 1000) / 1000,
  };
}
