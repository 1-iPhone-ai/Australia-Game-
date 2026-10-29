import type { NationalNetworkKind, NationalSystemsState } from '../types.ts';

export interface NrDashBottleneckNetworkSpan {
  bottleneckCount: number;
  distinctNetworks: number;
  networks: NationalNetworkKind[];
}

/** Count distinct NS networks represented in active bottleneck records. */
export function nrDashBuildBottleneckNetworkSpan(
  ns: NationalSystemsState | null
): NrDashBottleneckNetworkSpan | null {
  if (!ns?.bottlenecks?.length) return null;
  const set = new Set<NationalNetworkKind>();
  ns.bottlenecks.forEach(b => {
    if (b.network) set.add(b.network);
  });
  const networks = [...set].sort();
  return {
    bottleneckCount: ns.bottlenecks.length,
    distinctNetworks: networks.length,
    networks,
  };
}
