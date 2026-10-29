import { agent23ListAdjacencyPairs } from './adjacency.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashMapHubRow {
  regionId: string;
  adjacencyCount: number;
  dependencyIn: number;
  dependencyOut: number;
  hubScore: number;
}

/** Connectivity hub score from land adjacency + NS dependency in/out degree. */
export function nrDashBuildMapHubIndex(ns: NationalSystemsState | null): NrDashMapHubRow[] {
  const adjCount = new Map<string, number>();
  agent23ListAdjacencyPairs().forEach(({ a, b }) => {
    adjCount.set(a, (adjCount.get(a) ?? 0) + 1);
    adjCount.set(b, (adjCount.get(b) ?? 0) + 1);
  });
  const depIn = new Map<string, number>();
  const depOut = new Map<string, number>();
  ns?.dependencies.forEach(d => {
    depIn.set(d.consumerRegionId, (depIn.get(d.consumerRegionId) ?? 0) + 1);
    depOut.set(d.providerRegionId, (depOut.get(d.providerRegionId) ?? 0) + 1);
  });
  const regionIds = new Set<string>([...adjCount.keys(), ...depIn.keys(), ...depOut.keys()]);
  if (ns) Object.keys(ns.regions).forEach(id => regionIds.add(id));
  return [...regionIds]
    .map(regionId => {
      const adjacencyCount = adjCount.get(regionId) ?? 0;
      const dependencyIn = depIn.get(regionId) ?? 0;
      const dependencyOut = depOut.get(regionId) ?? 0;
      const hubScore = adjacencyCount + dependencyIn + dependencyOut;
      return { regionId, adjacencyCount, dependencyIn, dependencyOut, hubScore };
    })
    .sort((a, b) => b.hubScore - a.hubScore || a.regionId.localeCompare(b.regionId));
}

export function nrDashTopMapHubs(ns: NationalSystemsState | null, limit = 3): NrDashMapHubRow[] {
  return nrDashBuildMapHubIndex(ns).slice(0, limit);
}

export function nrDashPrimaryMapHub(ns: NationalSystemsState | null): string | null {
  const top = nrDashBuildMapHubIndex(ns)[0];
  return top?.hubScore ? top.regionId : null;
}
