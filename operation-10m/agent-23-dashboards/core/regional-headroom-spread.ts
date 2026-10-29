import { NATIONAL_NETWORKS } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashRegionalHeadroomSpread {
  regionCount: number;
  meanHeadroom: number;
  stdDev: number;
  tightestRegionId: string | null;
}

function meanRegionalUtil(reg: NationalSystemsState['regions'][string]): number {
  let sum = 0;
  NATIONAL_NETWORKS.forEach(n => {
    sum += reg.networks[n]?.utilization ?? 0;
  });
  return sum / NATIONAL_NETWORKS.length;
}

/** Cross-region dispersion of mean NS network headroom (1 − μ util). */
export function nrDashBuildRegionalHeadroomSpread(
  ns: NationalSystemsState | null
): NrDashRegionalHeadroomSpread | null {
  if (!ns?.regions) return null;
  const headrooms = Object.values(ns.regions).map(reg => ({
    regionId: reg.regionId,
    headroom: 1 - meanRegionalUtil(reg),
  }));
  if (!headrooms.length) return null;
  const values = headrooms.map(h => h.headroom);
  const meanHeadroom = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanHeadroom) ** 2, 0) / Math.max(values.length, 1);
  const sorted = [...headrooms].sort((a, b) => a.headroom - b.headroom || a.regionId.localeCompare(b.regionId));
  return {
    regionCount: headrooms.length,
    meanHeadroom: Math.round(meanHeadroom * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    tightestRegionId: sorted[0]?.regionId ?? null,
  };
}
