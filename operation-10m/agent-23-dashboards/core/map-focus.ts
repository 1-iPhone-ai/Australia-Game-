import { AGENT23_ADJACENT_REGIONS } from './adjacency.ts';
import type { NrDashMapLink, RegionMapNode } from '../types.ts';

export function nrDashLinksTouchingRegion(links: NrDashMapLink[], regionId: string | null): NrDashMapLink[] {
  if (!regionId) return links;
  return links.filter(l => l.fromId === regionId || l.toId === regionId);
}

export function nrDashNeighborRegionIds(regionId: string): string[] {
  return [...(AGENT23_ADJACENT_REGIONS[regionId] || [])];
}

export function nrDashApplyMapFocus(
  nodes: RegionMapNode[],
  focusRegionId: string | null
): RegionMapNode[] {
  if (!focusRegionId) return nodes.map(n => ({ ...n, dimmed: false }));
  const neighbors = new Set(nrDashNeighborRegionIds(focusRegionId));
  neighbors.add(focusRegionId);
  return nodes.map(n => ({
    ...n,
    dimmed: !neighbors.has(n.regionId),
  }));
}
