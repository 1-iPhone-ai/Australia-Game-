import type { NationalNetworkKind, NationalSystemsState } from '../types.ts';

export interface NrDashBottleneckNetworkShare {
  activeCount: number;
  topNetwork: NationalNetworkKind | null;
  topNetworkShare: number;
  concentrationIndex: number;
}

/** Herfindahl clustering of active NS bottlenecks by network kind. */
export function nrDashBuildBottleneckNetworkShare(
  ns: NationalSystemsState | null
): NrDashBottleneckNetworkShare | null {
  if (!ns?.bottlenecks?.length) return null;
  const counts = new Map<NationalNetworkKind | 'unknown', number>();
  ns.bottlenecks.forEach(b => {
    const key = b.network ?? 'unknown';
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });
  const activeCount = ns.bottlenecks.length;
  let topNetwork: NationalNetworkKind | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  counts.forEach((n, network) => {
    if (network !== 'unknown' && n > topCount) {
      topCount = n;
      topNetwork = network;
    }
    const share = n / activeCount;
    concentrationIndex += share * share;
  });
  return {
    activeCount,
    topNetwork,
    topNetworkShare: Math.round((topCount / activeCount) * 1000) / 1000,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
