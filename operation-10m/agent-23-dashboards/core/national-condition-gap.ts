import { NATIONAL_NETWORKS, NS_COND_RANK } from './constants.ts';
import type { NationalNetworkCondition, NationalSystemsState } from '../types.ts';

export interface NrDashNationalConditionGap {
  nationalMeanRank: number;
  regionalMeanRank: number;
  gap: number;
  sampleCells: number;
}

function condRank(c: NationalNetworkCondition | undefined): number {
  return NS_COND_RANK[c ?? 'healthy'] ?? 1;
}

/** Delta between mean NS national condition rank and mean regional cell condition rank. */
export function nrDashBuildNationalConditionGap(
  ns: NationalSystemsState | null
): NrDashNationalConditionGap | null {
  if (!ns?.national || !ns.regions) return null;
  const nationalRanks = NATIONAL_NETWORKS.map(n => condRank(ns.national[n]?.condition));
  if (!nationalRanks.length) return null;
  const nationalMeanRank = nationalRanks.reduce((s, r) => s + r, 0) / nationalRanks.length;
  const regionalRanks: number[] = [];
  Object.values(ns.regions).forEach(reg => {
    NATIONAL_NETWORKS.forEach(n => {
      regionalRanks.push(condRank(reg.networks[n]?.condition));
    });
  });
  if (!regionalRanks.length) return null;
  const regionalMeanRank = regionalRanks.reduce((s, r) => s + r, 0) / regionalRanks.length;
  return {
    nationalMeanRank: Math.round(nationalMeanRank * 1000) / 1000,
    regionalMeanRank: Math.round(regionalMeanRank * 1000) / 1000,
    gap: Math.round((nationalMeanRank - regionalMeanRank) * 1000) / 1000,
    sampleCells: regionalRanks.length,
  };
}
