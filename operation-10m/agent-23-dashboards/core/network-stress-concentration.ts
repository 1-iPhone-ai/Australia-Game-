import { nrDashBuildNetworkStress } from './analytics.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashNetworkStressConcentration {
  networkCount: number;
  topNetwork: string | null;
  concentrationIndex: number;
  topNetworkShare: number;
}

/** Herfindahl clustering of peak regional utilization by national network kind. */
export function nrDashBuildNetworkStressConcentration(
  ns: NationalSystemsState | null
): NrDashNetworkStressConcentration | null {
  const rows = nrDashBuildNetworkStress(ns);
  if (!rows.length) return null;
  const total = rows.reduce((s, r) => s + r.peakUtilization, 0);
  if (total <= 0) return null;
  let topNetwork: string | null = null;
  let topPeak = 0;
  let concentrationIndex = 0;
  rows.forEach(r => {
    if (r.peakUtilization > topPeak) {
      topPeak = r.peakUtilization;
      topNetwork = r.network;
    }
    const share = r.peakUtilization / total;
    concentrationIndex += share * share;
  });
  return {
    networkCount: rows.length,
    topNetwork,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topNetworkShare: Math.round((topPeak / total) * 1000) / 1000,
  };
}
