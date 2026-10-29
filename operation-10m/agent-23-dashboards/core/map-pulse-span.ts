import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { RegionMapNode } from '../types.ts';

export interface NrDashMapPulseSpan {
  regionCount: number;
  minIntensity: number;
  maxIntensity: number;
  intensitySpread: number;
}

/** Spread of composite map pulse intensities across strategic map nodes. */
export function nrDashBuildMapPulseSpan(nodes: RegionMapNode[]): NrDashMapPulseSpan | null {
  if (!nodes.length) return null;
  const intensities = nrDashBuildMapPulseRows(nodes).map(p => p.intensity);
  const minIntensity = Math.min(...intensities);
  const maxIntensity = Math.max(...intensities);
  return {
    regionCount: intensities.length,
    minIntensity: Math.round(minIntensity * 1000) / 1000,
    maxIntensity: Math.round(maxIntensity * 1000) / 1000,
    intensitySpread: Math.round((maxIntensity - minIntensity) * 1000) / 1000,
  };
}
