import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { RegionMapNode } from '../types.ts';

export interface NrDashMapPulseSaturationShare {
  regionCount: number;
  meanIntensity: number;
  peakIntensity: number;
  saturationShare: number;
}

/** Mean map pulse intensity relative to the hottest strategic map node. */
export function nrDashBuildMapPulseSaturationShare(nodes: RegionMapNode[]): NrDashMapPulseSaturationShare | null {
  if (!nodes.length) return null;
  const intensities = nrDashBuildMapPulseRows(nodes).map(p => p.intensity);
  const peakIntensity = Math.max(...intensities);
  if (peakIntensity <= 0) return null;
  const meanIntensity = intensities.reduce((s, v) => s + v, 0) / intensities.length;
  return {
    regionCount: intensities.length,
    meanIntensity: Math.round(meanIntensity * 1000) / 1000,
    peakIntensity: Math.round(peakIntensity * 1000) / 1000,
    saturationShare: Math.round((meanIntensity / peakIntensity) * 1000) / 1000,
  };
}
