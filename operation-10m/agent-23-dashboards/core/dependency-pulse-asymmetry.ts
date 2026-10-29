import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NrDashMapLink, RegionMapNode } from '../types.ts';

export interface NrDashDependencyPulseAsymmetry {
  linkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| across National Systems dependency map links only. */
export function nrDashBuildDependencyPulseAsymmetry(
  links: NrDashMapLink[],
  nodes: RegionMapNode[]
): NrDashDependencyPulseAsymmetry | null {
  const depLinks = links.filter(l => l.kind === 'dependency');
  if (!depLinks.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = depLinks.map(link => {
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
