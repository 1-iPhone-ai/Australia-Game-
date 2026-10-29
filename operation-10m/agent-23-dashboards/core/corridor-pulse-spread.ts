import { agent23ListAdjacencyPairs } from './adjacency.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashCorridorPulseSpread {
  corridorCount: number;
  meanBlend: number;
  stdDev: number;
}

/** Dispersion of endpoint-averaged map pulse intensity across land adjacency corridors. */
export function nrDashBuildCorridorPulseSpread(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashCorridorPulseSpread | null {
  if (!ns) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const pairs = agent23ListAdjacencyPairs();
  if (!pairs.length) return null;
  const blends = pairs.map(({ a, b }) => {
    const pa = pulseById.get(a) ?? 0;
    const pb = pulseById.get(b) ?? 0;
    return (pa + pb) / 2;
  });
  const meanBlend = blends.reduce((s, v) => s + v, 0) / blends.length;
  const variance = blends.reduce((s, v) => s + (v - meanBlend) ** 2, 0) / Math.max(blends.length, 1);
  return {
    corridorCount: blends.length,
    meanBlend: Math.round(meanBlend * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}
