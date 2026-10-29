import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NrDashMapLink, RegionMapNode } from '../types.ts';

export interface NrDashLinkPulseAsymmetry {
  linkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| across strategic map link endpoint pairs. */
export function nrDashBuildLinkPulseAsymmetry(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashLinkPulseAsymmetry | null {
  if (!links.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = links.map(link => {
    const a = pulseById.get(link.fromId) ?? 0;
    const b = pulseById.get(link.toId) ?? 0;
    return Math.abs(a - b);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    linkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}
