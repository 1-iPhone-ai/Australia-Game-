import { NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashParityGapRow {
  regionId: string;
  name: string;
  momentumRank: number;
  resilience: number | null;
  /** resilience minus normalized momentum rank (0..100 scale), when resilience present. */
  gapScore: number | null;
}

function momRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Compare LR momentum band rank to NS resilience score (both from snapshot row). */
export function nrDashBuildParityGapRows(snap: NrDashAuthSnapshot): NrDashParityGapRow[] {
  return snap.regions.map(r => {
    const momentumRank = momRank(r.momentumBand);
    const normalizedMom = (momentumRank / 5) * 100;
    const gapScore =
      r.resilience != null ? Math.round((r.resilience - normalizedMom) * 10) / 10 : null;
    return {
      regionId: r.regionId,
      name: r.name,
      momentumRank,
      resilience: r.resilience,
      gapScore,
    };
  });
}

export function nrDashTopParityOutliers(snap: NrDashAuthSnapshot, limit = 3): NrDashParityGapRow[] {
  return nrDashBuildParityGapRows(snap)
    .filter(r => r.gapScore != null)
    .sort((a, b) => Math.abs(b.gapScore!) - Math.abs(a.gapScore!))
    .slice(0, limit);
}
