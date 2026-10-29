import { NATIONAL_NETWORKS } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashNationalBottleneckGap {
  nationalBarTotal: number;
  activeListCount: number;
  gap: number;
}

/** Delta between summed NS national bottleneck counters and active bottleneck list length. */
export function nrDashBuildNationalBottleneckGap(
  ns: NationalSystemsState | null
): NrDashNationalBottleneckGap | null {
  if (!ns?.national) return null;
  const nationalBarTotal = NATIONAL_NETWORKS.reduce((s, n) => s + (ns.national[n]?.bottlenecks ?? 0), 0);
  const activeListCount = ns.bottlenecks.length;
  return {
    nationalBarTotal,
    activeListCount,
    gap: nationalBarTotal - activeListCount,
  };
}
