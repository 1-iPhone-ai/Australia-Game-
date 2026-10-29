import { LR_DEV_LABEL } from './constants.ts';
import type { LRDevTier, NrDashAuthSnapshot } from '../types.ts';

const LR_DEV_RANK: Record<string, number> = Object.fromEntries(
  (Object.keys(LR_DEV_LABEL) as LRDevTier[]).map((tier, i) => [LR_DEV_LABEL[tier], i])
);

export interface NrDashDevelopmentTierSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of LR development tier ordinals across snapshot rows. */
export function nrDashBuildDevelopmentTierSpan(
  snap: NrDashAuthSnapshot | null
): NrDashDevelopmentTierSpan | null {
  if (!snap?.regions.length) return null;
  const ranks = snap.regions.map(r => LR_DEV_RANK[r.developmentTier] ?? 0);
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}
