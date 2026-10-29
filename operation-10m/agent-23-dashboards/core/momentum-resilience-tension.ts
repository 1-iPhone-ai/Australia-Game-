import { NR_DASH_MOM_RANK } from './constants.ts';
import type { LRMomentumBand, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashMomentumResilienceTensionRow {
  regionId: string;
  name: string;
  momentumRank: number;
  resilience: number;
  /** Positive = resilience ahead of momentum; negative = momentum ahead of resilience. */
  tensionScore: number;
}

export interface NrDashMomentumResilienceTensionSummary {
  rows: NrDashMomentumResilienceTensionRow[];
  meanAbsTension: number;
  /** Region with largest absolute mismatch. */
  outlierRegionId: string | null;
}

function momRank(band: string): number {
  return NR_DASH_MOM_RANK[band as LRMomentumBand] ?? 2;
}

/** Flag LR momentum vs NS resilience mismatches on merged snapshot rows. */
export function nrDashBuildMomentumResilienceTension(
  snap: NrDashAuthSnapshot | null
): NrDashMomentumResilienceTensionSummary | null {
  if (!snap?.regions.length) return null;
  const rows: NrDashMomentumResilienceTensionRow[] = [];
  snap.regions.forEach(r => {
    if (r.resilience == null) return;
    const momentumRank = momRank(r.momentumBand);
    const normalizedMom = (momentumRank / 5) * 100;
    const tensionScore = Math.round((r.resilience - normalizedMom) * 10) / 10;
    rows.push({
      regionId: r.regionId,
      name: r.name,
      momentumRank,
      resilience: r.resilience,
      tensionScore,
    });
  });
  if (!rows.length) return null;
  rows.sort((a, b) => Math.abs(b.tensionScore) - Math.abs(a.tensionScore) || a.regionId.localeCompare(b.regionId));
  const meanAbsTension =
    Math.round((rows.reduce((s, r) => s + Math.abs(r.tensionScore), 0) / rows.length) * 100) / 100;
  const outlierRegionId = rows[0] ? rows[0].regionId : null;
  return { rows, meanAbsTension, outlierRegionId };
}

export function nrDashTopTensionOutliers(snap: NrDashAuthSnapshot | null, limit = 3): NrDashMomentumResilienceTensionRow[] {
  const summary = nrDashBuildMomentumResilienceTension(snap);
  return summary ? summary.rows.slice(0, limit) : [];
}
