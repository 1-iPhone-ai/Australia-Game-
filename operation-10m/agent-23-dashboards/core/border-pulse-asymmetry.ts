import { agent23ListAdjacencyPairs } from './adjacency.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashHottestBorderRegion } from './border-stress.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashBorderPulseAsymmetry {
  borderLinkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| on land links touching the hottest border region. */
export function nrDashBuildBorderPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashBorderPulseAsymmetry | null {
  const borderRegionId = nrDashHottestBorderRegion(ns);
  if (!borderRegionId || !ns) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const pairs = agent23ListAdjacencyPairs().filter(({ a, b }) => a === borderRegionId || b === borderRegionId);
  if (!pairs.length) return null;
  const deltas = pairs.map(({ a, b }) => {
    const pa = pulseById.get(a) ?? 0;
    const pb = pulseById.get(b) ?? 0;
    return Math.abs(pa - pb);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    borderLinkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}
