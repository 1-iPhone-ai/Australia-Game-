import { LR_ECON_LABEL } from './constants.ts';
import type { LREconomyBand, NrDashAuthSnapshot } from '../types.ts';

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

export interface NrDashEconomyResilienceDriftRow {
  regionId: string;
  economyRank: number;
  resilienceBandRank: number;
  drift: number;
}

export interface NrDashEconomyResilienceDrift {
  rows: NrDashEconomyResilienceDriftRow[];
  meanAbsDrift: number;
  outlierRegionId: string | null;
}

/** LR economy band rank vs NS resilience scaled to 0..4 (merged snapshot rows). */
export function nrDashBuildEconomyResilienceDrift(
  snap: NrDashAuthSnapshot | null
): NrDashEconomyResilienceDrift | null {
  if (!snap?.regions.length) return null;
  const rows: NrDashEconomyResilienceDriftRow[] = [];
  snap.regions.forEach(r => {
    if (r.resilience == null) return;
    const economyRank = economyRankFromLabel(r.economyBand);
    const resilienceBandRank = Math.round((r.resilience / 100) * 4 * 10) / 10;
    rows.push({
      regionId: r.regionId,
      economyRank,
      resilienceBandRank,
      drift: Math.round((resilienceBandRank - economyRank) * 10) / 10,
    });
  });
  if (!rows.length) return null;
  rows.sort((a, b) => Math.abs(b.drift) - Math.abs(a.drift) || a.regionId.localeCompare(b.regionId));
  const meanAbsDrift =
    Math.round((rows.reduce((s, r) => s + Math.abs(r.drift), 0) / rows.length) * 1000) / 1000;
  return { rows, meanAbsDrift, outlierRegionId: rows[0]?.regionId ?? null };
}

export function nrDashTopEconomyResilienceDrift(
  snap: NrDashAuthSnapshot | null,
  limit = 3
): NrDashEconomyResilienceDriftRow[] {
  return nrDashBuildEconomyResilienceDrift(snap)?.rows.slice(0, limit) ?? [];
}
