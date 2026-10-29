import { agent23ListAdjacencyPairs } from './adjacency.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashCorridorSaturationShare {
  corridorCount: number;
  meanBlend: number;
  peakBlend: number;
  saturationShare: number;
}

/** Mean corridor pulse blend relative to the hottest land-adjacency corridor. */
export function nrDashBuildCorridorSaturationShare(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashCorridorSaturationShare | null {
  if (!ns) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const pairs = agent23ListAdjacencyPairs();
  if (!pairs.length) return null;
  const blends = pairs.map(({ a, b }) => {
    const pa = pulseById.get(a) ?? 0;
    const pb = pulseById.get(b) ?? 0;
    return (pa + pb) / 2;
  });
  const peakBlend = Math.max(...blends);
  if (peakBlend <= 0) return null;
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  return {
    corridorCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    peakBlend: Math.round(peakBlend * 1000) / 1000,
    saturationShare: Math.round((meanBlend / peakBlend) * 1000) / 1000,
  };
}
