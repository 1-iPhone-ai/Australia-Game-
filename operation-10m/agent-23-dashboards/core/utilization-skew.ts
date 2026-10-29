import type { NrDashAuthSnapshot, NrDashNetworkBar } from '../types.ts';

export interface NrDashUtilizationSkew {
  sampleSize: number;
  meanUtilization: number;
  stdDev: number;
  hottestNetwork: NrDashNetworkBar['network'] | null;
  coolestNetwork: NrDashNetworkBar['network'] | null;
  spread: number;
}

/** Dispersion of authoritative national network utilization bars. */
export function nrDashBuildUtilizationSkew(snap: NrDashAuthSnapshot | null): NrDashUtilizationSkew | null {
  if (!snap?.networks.length) return null;
  const values = snap.networks.map(n => n.utilization);
  const meanUtilization = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanUtilization) ** 2, 0) / Math.max(values.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const sorted = [...snap.networks].sort(
    (a, b) => b.utilization - a.utilization || a.network.localeCompare(b.network)
  );
  const hottest = sorted[0];
  const coolest = sorted[sorted.length - 1];
  const spread = Math.round((hottest.utilization - coolest.utilization) * 1000) / 1000;
  return {
    sampleSize: snap.networks.length,
    meanUtilization: Math.round(meanUtilization * 1000) / 1000,
    stdDev,
    hottestNetwork: hottest.utilization > 0 ? hottest.network : null,
    coolestNetwork: coolest ? coolest.network : null,
    spread,
  };
}
