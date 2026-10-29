import type { NrDashAuthSnapshot, NrDashNetworkBar } from '../types.ts';

export interface NrDashCapacityHeadroom {
  sampleSize: number;
  meanHeadroom: number;
  stdDev: number;
  tightestNetwork: NrDashNetworkBar['network'] | null;
  roomiestNetwork: NrDashNetworkBar['network'] | null;
  spread: number;
}

/** Remaining national capacity (1 − utilization) across authoritative network bars. */
export function nrDashBuildCapacityHeadroom(snap: NrDashAuthSnapshot | null): NrDashCapacityHeadroom | null {
  if (!snap?.networks.length) return null;
  const headrooms = snap.networks.map(n => ({
    network: n.network,
    headroom: Math.max(0, 1 - n.utilization),
  }));
  const values = headrooms.map(h => h.headroom);
  const meanHeadroom = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanHeadroom) ** 2, 0) / Math.max(values.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const sorted = [...headrooms].sort((a, b) => a.headroom - b.headroom || a.network.localeCompare(b.network));
  const tightest = sorted[0];
  const roomiest = sorted[sorted.length - 1];
  const spread = Math.round((roomiest.headroom - tightest.headroom) * 1000) / 1000;
  return {
    sampleSize: snap.networks.length,
    meanHeadroom: Math.round(meanHeadroom * 1000) / 1000,
    stdDev,
    tightestNetwork: tightest.headroom < 1 ? tightest.network : null,
    roomiestNetwork: roomiest ? roomiest.network : null,
    spread,
  };
}
