import { AGENT23_REGION_MAP_LAYOUT } from './constants.ts';
import { nrDashBuildMapPulseRows } from './map-pulse.ts';
import { nrDashBuildAdjacencyLinks, nrDashBuildDependencyLinks, nrDashMergeMapLinks } from './map-links.ts';
import { nrDashPrimaryMapHub } from './map-hub-index.ts';
import { nrDashHottestBorderRegion } from './border-stress.ts';
import type { NationalSystemsState, RegionMapNode } from '../types.ts';

export interface NrDashMergedDependencyHubBorderPulseAsymmetry {
  hubRegionId: string | null;
  borderRegionId: string | null;
  mergedDependencyHubBorderLinkCount: number;
  meanEndpointDelta: number;
  maxEndpointDelta: number;
}

/** Mean and peak |Δpulse| on merged-map dependency links between hub and hottest border region. */
export function nrDashBuildMergedDependencyHubBorderPulseAsymmetry(
  ns: NationalSystemsState | null,
  nodes: RegionMapNode[]
): NrDashMergedDependencyHubBorderPulseAsymmetry | null {
  const hubRegionId = nrDashPrimaryMapHub(ns);
  const borderRegionId = nrDashHottestBorderRegion(ns);
  if (!hubRegionId || !borderRegionId || !ns || hubRegionId === borderRegionId) return null;
  const merged = nrDashMergeMapLinks(
    nrDashBuildAdjacencyLinks(AGENT23_REGION_MAP_LAYOUT),
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT)
  );
  const depIds = new Set(
    nrDashBuildDependencyLinks(ns, AGENT23_REGION_MAP_LAYOUT).flatMap(l => [`${l.fromId}:${l.toId}`, `${l.toId}:${l.fromId}`])
  );
  const links = merged.filter(l => {
    const key = `${l.fromId}:${l.toId}`;
    const rev = `${l.toId}:${l.fromId}`;
    if (!depIds.has(key) && !depIds.has(rev)) return false;
    return (
      (l.fromId === hubRegionId && l.toId === borderRegionId) ||
      (l.toId === hubRegionId && l.fromId === borderRegionId)
    );
  });
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
    mergedDependencyHubBorderLinkCount: deltas.length,
    meanEndpointDelta: Math.round(meanEndpointDelta * 1000) / 1000,
    maxEndpointDelta: Math.round(maxEndpointDelta * 1000) / 1000,
  };
}
