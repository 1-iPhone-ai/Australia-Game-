import { NATIONAL_NETWORKS } from './constants.ts';
import type { NationalNetworkKind, NationalSystemsState } from '../types.ts';

const SEVERITY_WEIGHT: Record<string, number> = {
  minor: 0.5,
  meaningful: 1,
  severe: 1.5,
  critical: 2,
};

export interface NrDashBottleneckNetworkSeverityLoadSpread {
  networkCount: number;
  meanLoad: number;
  stdDev: number;
  topNetwork: NationalNetworkKind | null;
}

/** Dispersion of weighted bottleneck severity load across NS network kinds. */
export function nrDashBuildBottleneckNetworkSeverityLoadSpread(
  ns: NationalSystemsState | null
): NrDashBottleneckNetworkSeverityLoadSpread | null {
  if (!ns) return null;
  const loads = NATIONAL_NETWORKS.map(network => {
    let load = 0;
    ns.bottlenecks.forEach(b => {
      if (b.network === network) load += SEVERITY_WEIGHT[b.severity ?? ''] ?? 1;
    });
    return load;
  });
  const meanLoad = loads.reduce((s, l) => s + l, 0) / loads.length;
  const variance = loads.reduce((s, l) => s + (l - meanLoad) ** 2, 0) / Math.max(loads.length, 1);
  let topNetwork: NationalNetworkKind | null = null;
  let topLoad = -1;
  NATIONAL_NETWORKS.forEach((n, i) => {
    if (loads[i] > topLoad) {
      topLoad = loads[i];
      topNetwork = n;
    }
  });
  return {
    networkCount: loads.length,
    meanLoad: Math.round(meanLoad * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    topNetwork,
  };
}
