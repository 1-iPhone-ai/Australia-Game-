import { NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot, NrDashRegionalRow } from '../types.ts';

export interface NrDashMomentumDivergence {
  minRank: number;
  maxRank: number;
  spread: number;
  /** Mean absolute deviation from median rank (state rows only). */
  dispersion: number;
  hottestRegionId: string | null;
  coldestRegionId: string | null;
}

function rankRow(r: NrDashRegionalRow): number {
  return NR_DASH_MOM_RANK[r.momentumBand as LRMomentumBand] ?? 2;
}

export function nrDashBuildMomentumDivergence(snap: NrDashAuthSnapshot): NrDashMomentumDivergence | null {
  if (!snap.regions.length) return null;
  const ranks = snap.regions.map(r => ({ id: r.regionId, rank: rankRow(r) }));
  const values = ranks.map(r => r.rank);
  const minRank = Math.min(...values);
  const maxRank = Math.max(...values);
  const median = values.slice().sort((a, b) => a - b)[Math.floor(values.length / 2)] ?? 2;
  const dispersion =
    values.reduce((s, v) => s + Math.abs(v - median), 0) / Math.max(1, values.length);
  const hottest = ranks.find(r => r.rank === maxRank);
  const coldest = ranks.find(r => r.rank === minRank);
  return {
    minRank,
    maxRank,
    spread: maxRank - minRank,
    dispersion: Math.round(dispersion * 100) / 100,
    hottestRegionId: hottest?.id ?? null,
    coldestRegionId: coldest?.id ?? null,
  };
}
