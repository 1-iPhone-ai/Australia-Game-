import { NATIONAL_RESILIENCE_LABEL } from './constants.ts';
import type { NationalResilienceBand, NrDashAuthSnapshot } from '../types.ts';

const RES_BAND_RANK: Record<string, number> = Object.fromEntries(
  (Object.keys(NATIONAL_RESILIENCE_LABEL) as NationalResilienceBand[]).map((band, i) => [
    NATIONAL_RESILIENCE_LABEL[band],
    i,
  ])
);

export interface NrDashResilienceBandSpan {
  regionCount: number;
  minRank: number;
  maxRank: number;
  rankSpread: number;
}

/** Spread of NS resilience band labels on merged snapshot rows. */
export function nrDashBuildResilienceBandSpan(
  snap: NrDashAuthSnapshot | null
): NrDashResilienceBandSpan | null {
  if (!snap?.regions.length) return null;
  const ranks = snap.regions
    .map(r => (r.resilienceBand ? (RES_BAND_RANK[r.resilienceBand] ?? null) : null))
    .filter((v): v is number => v != null);
  if (!ranks.length) return null;
  const minRank = Math.min(...ranks);
  const maxRank = Math.max(...ranks);
  return {
    regionCount: ranks.length,
    minRank,
    maxRank,
    rankSpread: maxRank - minRank,
  };
}
