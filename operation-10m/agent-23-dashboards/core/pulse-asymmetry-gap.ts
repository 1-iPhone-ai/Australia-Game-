import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { RegionMapNode } from '../types.ts';

export interface NrDashPulseAsymmetryGap {
  regionCount: number;
  meanIntensity: number;
  maxIntensity: number;
  asymmetryGap: number;
}

/** Gap between hottest map pulse and the national mean intensity (concentration above average). */
export function nrDashBuildPulseAsymmetryGap(nodes: RegionMapNode[]): NrDashPulseAsymmetryGap | null {
  if (!nodes.length) return null;
  const intensities = nrDashBuildMapPulseRows(nodes).map(p => p.intensity);
  const meanIntensity = intensities.reduce((s, v) => s + v, 0) / intensities.length;
  const maxIntensity = Math.max(...intensities);
  return {
    regionCount: intensities.length,
    meanIntensity: Math.round(meanIntensity * 1000) / 1000,
    maxIntensity: Math.round(maxIntensity * 1000) / 1000,
    asymmetryGap: Math.round((maxIntensity - meanIntensity) * 1000) / 1000,
  };
}
