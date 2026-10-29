import { nrDashBuildDependencyChokepoints } from './dependency-chokepoint.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashChokepointPulseAsymmetry {
  chokepointCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| across dependency chokepoint endpoint pairs. */
export function nrDashBuildChokepointPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashChokepointPulseAsymmetry | null {
  const rows = nrDashBuildDependencyChokepoints(ns);
  if (!rows.length) return null;
  const pulseById = new Map(nrDashBuildMapPulseRows(nodes).map(p => [p.regionId, p.intensity]));
  const deltas = rows.map(row => {
    const consumer = pulseById.get(row.consumerRegionId) ?? 0;
    const provider = pulseById.get(row.providerRegionId) ?? 0;
    return Math.abs(consumer - provider);
  });
  const meanEndpointDelta = deltas.reduce((s, v) => s + v, 0) / deltas.length;
  const maxEndpointDelta = Math.max(...deltas);
  return {
    chokepointCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}
