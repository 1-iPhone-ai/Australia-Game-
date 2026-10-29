import { NATIONAL_NETWORKS } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashNationalNetworkUtilSpread {
  networkCount: number;
  meanUtilization: number;
  stdDev: number;
  maxUtilNetwork: string | null;
}

/** Dispersion of authoritative national-level network utilization (NS national row). */
export function nrDashBuildNationalNetworkUtilSpread(
  ns: NationalSystemsState | null
): NrDashNationalNetworkUtilSpread | null {
  if (!ns?.national) return null;
  const utils = NATIONAL_NETWORKS.map(n => ns.national[n]?.utilization ?? 0);
  if (!utils.length) return null;
  const meanUtilization = utils.reduce((s, u) => s + u, 0) / utils.length;
  const variance =
    utils.reduce((s, u) => s + (u - meanUtilization) ** 2, 0) / Math.max(utils.length, 1);
  let maxUtilNetwork: string | null = null;
  let maxUtil = -1;
  NATIONAL_NETWORKS.forEach((n, i) => {
    if (utils[i] > maxUtil) {
      maxUtil = utils[i];
      maxUtilNetwork = n;
    }
  });
  return {
    networkCount: utils.length,
    meanUtilization: Math.round(meanUtilization * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    maxUtilNetwork,
  };
}
