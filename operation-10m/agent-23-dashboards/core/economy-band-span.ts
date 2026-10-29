import { LR_ECON_LABEL } from './constants.ts';
import type { LREconomyBand, NrDashAuthSnapshot } from '../types.ts';

const LR_ECON_RANK: Record<string, number> = Object.fromEntries(
  (Object.keys(LR_ECON_LABEL) as LREconomyBand[]).map((band, i) => [LR_ECON_LABEL[band], i])
);

export interface NrDashEconomyBandSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of LR economy band ordinals across snapshot rows. */
export function nrDashBuildEconomyBandSpan(
  snap: NrDashAuthSnapshot | null
): NrDashEconomyBandSpan | null {
  if (!snap?.regions.length) return null;
  const ranks = snap.regions.map(r => LR_ECON_RANK[r.economyBand] ?? 0);
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}
