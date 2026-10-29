import { NATIONAL_NETWORKS } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashNationalUtilizationGap {
  nationalMean: number;
  regionalMean: number;
  gap: number;
  sampleCells: number;
}

/** Delta between NS national network utilization mean and mean regional cell utilization. */
export function nrDashBuildNationalUtilizationGap(
  ns: NationalSystemsState | null
): NrDashNationalUtilizationGap | null {
  if (!ns?.national || !ns.regions) return null;
  const nationalUtils = NATIONAL_NETWORKS.map(n => ns.national[n]?.utilization ?? 0);
  if (!nationalUtils.length) return null;
  const nationalMean = nationalUtils.reduce((s, u) => s + u, 0) / nationalUtils.length;
  const regionalCells: number[] = [];
  Object.values(ns.regions).forEach(reg => {
    NATIONAL_NETWORKS.forEach(n => {
      regionalCells.push(reg.networks[n]?.utilization ?? 0);
    });
  });
  if (!regionalCells.length) return null;
  const regionalMean = regionalCells.reduce((s, u) => s + u, 0) / regionalCells.length;
  return {
    nationalMean: Math.round(nationalMean * 1000) / 1000,
    regionalMean: Math.round(regionalMean * 1000) / 1000,
    gap: Math.round((nationalMean - regionalMean) * 1000) / 1000,
    sampleCells: regionalCells.length,
  };
}
