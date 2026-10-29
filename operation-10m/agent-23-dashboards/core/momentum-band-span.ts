import { LR_MOMENTUM_LABEL, NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

const LR_MOM_BAND_RANK: Record<string, number> = Object.fromEntries(
  (Object.keys(LR_MOMENTUM_LABEL) as LRMomentumBand[]).map(band => [LR_MOMENTUM_LABEL[band], NR_DASH_MOM_RANK[band]])
);

export interface NrDashMomentumBandSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of LR momentum band ordinals across snapshot rows. */
export function nrDashBuildMomentumBandSpan(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumBandSpan | null {
  if (!snap?.regions.length) return null;
  const ranks = snap.regions.map(r => LR_MOM_BAND_RANK[r.momentumBand] ?? 0);
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}
