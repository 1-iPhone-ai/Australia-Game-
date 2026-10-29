import type { NationalNetworkKind, NationalSystemsState } from '../types.ts';

export interface NrDashDependencyNetworkSpan {
  edgeCount: number;
  distinctNetworks: number;
  networks: NationalNetworkKind[];
}

/** Count distinct NS network kinds referenced by interregional dependencies. */
export function nrDashBuildDependencyNetworkSpan(
  ns: NationalSystemsState | null
): NrDashDependencyNetworkSpan | null {
  if (!ns?.dependencies?.length) return null;
  const set = new Set<NationalNetworkKind>();
  ns.dependencies.forEach(d => set.add(d.network));
  const networks = [...set].sort();
  return {
    edgeCount: ns.dependencies.length,
    distinctNetworks: networks.length,
    networks,
  };
}
