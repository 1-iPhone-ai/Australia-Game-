import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNetworkUtilConcentration {
  networkCount: number;
  topNetwork: string | null;
  concentrationIndex: number;
  topNetworkShare: number;
}

/** Herfindahl clustering of authoritative national network utilization bars. */
export function nrDashBuildNetworkUtilConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashNetworkUtilConcentration | null {
  if (!snap?.networks.length) return null;
  const total = snap.networks.reduce((s, n) => s + n.utilization, 0);
  if (total <= 0) return null;
  let topNetwork: string | null = null;
  let topUtil = 0;
  let concentrationIndex = 0;
  snap.networks.forEach(n => {
    if (n.utilization > topUtil) {
      topUtil = n.utilization;
      topNetwork = n.network;
    }
    const share = n.utilization / total;
    concentrationIndex += share * share;
  });
  return {
    networkCount: snap.networks.length,
    topNetwork,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topNetworkShare: Math.round((topUtil / total) * 1000) / 1000,
  };
}
