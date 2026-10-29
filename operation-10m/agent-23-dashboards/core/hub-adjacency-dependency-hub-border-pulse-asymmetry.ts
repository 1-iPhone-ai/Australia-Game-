import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashPrimaryMapHub } from './map-hub-index.ts';
import { nrDashHottestBorderRegion } from './border-stress.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashHubAdjacencyDependencyHubBorderPulseAsymmetry {
  hubRegionId: string | null;
  borderRegionId: string | null;
  hubAdjacencyDependencyHubBorderLinkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| on adjacency-only hub–border corridor links. */
export function nrDashBuildHubAdjacencyDependencyHubBorderPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashHubAdjacencyDependencyHubBorderPulseAsymmetry | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  const borderRegionId = nrDashHottestBorderRegion(ns);
  if (!hubRegionId || !borderRegionId || !ns || hubRegionId === borderRegionId) return null;
  const adjacency = nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT);
  const links = adjacency.filter(
    l =>
      (l.fromId === hubRegionId && l.toId === borderRegionId) ||
      (l.toId === hubRegionId && l.fromId === borderRegionId)
  );
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
    hubRegionId,
    borderRegionId,
    hubAdjacencyDependencyHubBorderLinkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}
