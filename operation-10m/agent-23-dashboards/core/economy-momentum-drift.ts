import { LR_ECON_LABEL, LR_MOMENTUM_LABEL, NR_DASH_MOM_RANK } from './constants.ts';
import type { LREconomyBand, LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

const ECON_RANK: Record<LREconomyBand, number> = {
  depressed: 0,
  weak: 1,
  moderate: 2,
  strong: 3,
  booming: 4,
};

function economyRankFromLabel(label: string): number {
  for (const [key, text] of Object.entries(LR_ECON_LABEL)) {
    if (text === label) return ECON_RANK[key as LREconomyBand];
  }
  return 2;
}

function momentumRankFromLabel(label: string): number {
  for (const [key, text] of Object.entries(LR_MOMENTUM_LABEL)) {
    if (text === label) return NR_DASH_MOM_RANK[key as LRMomentumBand];
  }
  return 2;
}

export interface NrDashEconomyMomentumDriftRow {
  regionId: string;
  economyRank: number;
  momentumRank: number;
  drift: number;
}

export interface NrDashEconomyMomentumDrift {
  rows: NrDashEconomyMomentumDriftRow[];
  meanAbsDrift: number;
  outlierRegionId: string | null;
}

/** LR economy band vs momentum band rank gap (no forecasting). */
export function nrDashBuildEconomyMomentumDrift(snap: NrDashAuthSnapshot | null): NrDashEconomyMomentumDrift | null {
  if (!snap?.regions.length) return null;
  const rows: NrDashEconomyMomentumDriftRow[] = snap.regions.map(r => {
    const economyRank = economyRankFromLabel(r.economyBand);
    const momentumRank = momentumRankFromLabel(r.momentumBand);
    return {
      regionId: r.regionId,
      economyRank,
      momentumRank,
      drift: momentumRank - economyRank,
    };
  });
  rows.sort((a, b) => Math.abs(b.drift) - Math.abs(a.drift) || a.regionId.localeCompare(b.regionId));
  const meanAbsDrift =
    Math.round((rows.reduce((s, r) => s + Math.abs(r.drift), 0) / rows.length) * 1000) / 1000;
  return { rows, meanAbsDrift, outlierRegionId: rows[0]?.regionId ?? null };
}

export function nrDashTopEconomyMomentumDrift(
  snap: NrDashAuthSnapshot | null,
  limit = 3
): NrDashEconomyMomentumDriftRow[] {
  return nrDashBuildEconomyMomentumDrift(snap)?.rows.slice(0, limit) ?? [];
}
