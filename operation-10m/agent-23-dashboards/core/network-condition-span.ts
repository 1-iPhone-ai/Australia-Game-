import { NATIONAL_NETWORKS, NS_COND_RANK } from './constants.ts';
import type { NationalNetworkCondition, NationalSystemsState } from '../types.ts';

export interface NrDashNetworkConditionSpan {
  cellCount: number;
  meanRank: number;
  stdDev: number;
}

function condRank(c: NationalNetworkCondition | undefined): number {
  return NS_COND_RANK[c ?? 'healthy'] ?? 1;
}

/** Dispersion of NS regional network condition ranks across the heat grid. */
export function nrDashBuildNetworkConditionSpan(
  ns: NationalSystemsState | null
): NrDashNetworkConditionSpan | null {
  if (!ns?.regions) return null;
  const ranks: number[] = [];
  Object.values(ns.regions).forEach(reg => {
    NATIONAL_NETWORKS.forEach(n => {
      ranks.push(condRank(reg.networks[n]?.condition));
    });
  });
  if (!ranks.length) return null;
  const meanRank = ranks.reduce((s, r) => s + r, 0) / ranks.length;
  const variance = ranks.reduce((s, r) => s + (r - meanRank) ** 2, 0) / Math.max(ranks.length, 1);
  return {
    cellCount: ranks.length,
    meanRank: Math.round(meanRank * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}
