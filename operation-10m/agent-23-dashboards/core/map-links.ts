import { agent23ListAdjacencyPairs } from './adjacency.ts';
import { NR_DASH_COND_COLOR } from './constants.ts';
import type { NationalSystemsState, NrDashMapLink, RegionMapLayoutEntry, RegionMapNode } from '../types.ts';

function layoutById(layout: RegionMapLayoutEntry[]): Map<string, RegionMapLayoutEntry> {
  return new Map(layout.map(l => [l.regionId, l]));
}

export function nrDashBuildAdjacencyLinks(layout: RegionMapLayoutEntry[]): NrDashMapLink[] {
  const pos = layoutById(layout);
  return agent23ListAdjacencyPairs()
    .filter(p => pos.has(p.a) && pos.has(p.b))
    .map(p => ({
      id: `adj_${p.key}`,
      kind: 'adjacency' as const,
      fromId: p.a,
      toId: p.b,
      label: p.key,
      stroke: '#475569',
      dash: '2 2',
      title: `Land corridor ${p.a}–${p.b}`,
    }));
}

export function nrDashBuildDependencyLinks(
  ns: NationalSystemsState | null,
  layout: RegionMapLayoutEntry[]
): NrDashMapLink[] {
  if (!ns) return [];
  const pos = layoutById(layout);
  return ns.dependencies
    .filter(d => pos.has(d.consumerRegionId) && pos.has(d.providerRegionId))
    .map(d => {
      const prov = ns.regions[d.providerRegionId];
      const cond = prov?.networks[d.network]?.condition ?? 'strained';
      return {
        id: `dep_${d.id}`,
        kind: 'dependency' as const,
        fromId: d.consumerRegionId,
        toId: d.providerRegionId,
        label: d.network,
        stroke: NR_DASH_COND_COLOR[cond],
        title: `${d.consumerRegionId} depends on ${d.providerRegionId} (${d.network}, ${d.importance})`,
      };
    });
}

export function nrDashMergeMapLinks(adjacency: NrDashMapLink[], dependency: NrDashMapLink[]): NrDashMapLink[] {
  return [...adjacency, ...dependency];
}

export function nrDashLinkEndpoints(
  link: NrDashMapLink,
  nodes: RegionMapNode[]
): { x1: number; y1: number; x2: number; y2: number } | null {
  const a = nodes.find(n => n.regionId === link.fromId);
  const b = nodes.find(n => n.regionId === link.toId);
  if (!a || !b) return null;
  return { x1: a.x, y1: a.y, x2: b.x, y2: b.y };
}
