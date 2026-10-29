import { nrDashBuildMapHubIndex } from './map-hub-index.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashHubPulseSpan {
  hubRegionCount: number;
  minIntensity: number;
  maxIntensity: number;
  intensitySpread: number;
}

/** Spread of map pulse intensity across NS connectivity hub regions (hubScore > 0). */
export function nrDashBuildHubPulseSpan(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashHubPulseSpan | null {
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const hubs = nrDashBuildMapHubIndex(ns).filter(h => h.hubScore > 0);
  if (!hubs.length) return null;
  const intensities = hubs.map(h => pulseById.get(h.regionId) ?? 0);
  const minIntensity = Math.min(...intensities);
  const maxIntensity = Math.max(...intensities);
  return {
    hubRegionCount: intensities.length,
    minIntensity: Math.round(minIntensity * 1000) / 1000,
    maxIntensity: Math.round(maxIntensity * 1000) / 1000,
    intensitySpread: Math.round((maxIntensity - minIntensity) * 1000) / 1000,
  };
}
