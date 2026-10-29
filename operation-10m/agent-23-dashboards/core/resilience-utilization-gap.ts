import { NATIONAL_NETWORKS } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashResilienceUtilizationGap {
  sampleSize: number;
  meanAbsGap: number;
  maxGapRegionId: string | null;
}

function meanNetworkUtil(reg: NationalSystemsState['regions'][string]): number {
  let sum = 0;
  NATIONAL_NETWORKS.forEach(n => {
    sum += reg.networks[n]?.utilization ?? 0;
  });
  return sum / NATIONAL_NETWORKS.length;
}

/** Mean |NS resilience − mean regional network util×100| per authoritative region row. */
export function nrDashBuildResilienceUtilizationGap(
  ns: NationalSystemsState | null
): NrDashResilienceUtilizationGap | null {
  if (!ns?.regions) return null;
  const gaps: { regionId: string; absGap: number }[] = [];
  Object.values(ns.regions).forEach(reg => {
    if (!Number.isFinite(reg.resilience)) return;
    const utilPct = meanNetworkUtil(reg) * 100;
    const gap = Math.abs(reg.resilience - utilPct);
    gaps.push({ regionId: reg.regionId, absGap: Math.round(gap * 10) / 10 });
  });
  if (!gaps.length) return null;
  gaps.sort((a, b) => b.absGap - a.absGap || a.regionId.localeCompare(b.regionId));
  const meanAbsGap =
    Math.round((gaps.reduce((s, g) => s + g.absGap, 0) / gaps.length) * 100) / 100;
  return {
    sampleSize: gaps.length,
    meanAbsGap,
    maxGapRegionId: gaps[0]?.regionId ?? null,
  };
}
