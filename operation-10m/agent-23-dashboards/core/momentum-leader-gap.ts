import { nrDashBuildCompareInsights } from './analytics.ts';
import type { NationalSystemsState, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashMomentumLeaderGap {
  leaderRegionId: string;
  laggardRegionId: string;
  leaderRank: number;
  laggardRank: number;
  rankGap: number;
}

/** Momentum rank spread between compare-tab leader and laggard (snapshot rows only). */
export function nrDashBuildMomentumLeaderGap(
  snap: NrDashAuthSnapshot | null,
  ns: NationalSystemsState | null
): NrDashMomentumLeaderGap | null {
  if (!snap?.regions.length) return null;
  const insights = nrDashBuildCompareInsights(snap, ns);
  const leader = insights.momentumLeaders[0];
  const laggard = insights.momentumLaggards[0];
  if (!leader || !laggard) return null;
  return {
    leaderRegionId: leader.regionId,
    laggardRegionId: laggard.regionId,
    leaderRank: leader.rank,
    laggardRank: laggard.rank,
    rankGap: leader.rank - laggard.rank,
  };
}
