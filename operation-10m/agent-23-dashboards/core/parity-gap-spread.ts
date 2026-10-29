import { nrDashBuildParityGapRows } from './parity-gap.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashParityGapSpread {
  sampleSize: number;
  meanAbsGap: number;
  stdDev: number;
  outlierRegionId: string | null;
}

/** Cross-region dispersion of momentum↔resilience parity gap scores (merged rows). */
export function nrDashBuildParityGapSpread(snap: NrDashAuthSnapshot | null): NrDashParityGapSpread | null {
  if (!snap?.regions.length) return null;
  const scored = nrDashBuildParityGapRows(snap)
    .filter(r => r.gapScore != null)
    .map(r => ({ regionId: r.regionId, gapScore: r.gapScore as number }));
  if (!scored.length) return null;
  const absValues = scored.map(r => Math.abs(r.gapScore));
  const meanAbsGap =
    Math.round((absValues.reduce((s, n) => s + n, 0) / absValues.length) * 1000) / 1000;
  const mean = absValues.reduce((s, n) => s + n, 0) / absValues.length;
  const variance =
    absValues.reduce((s, n) => s + (n - mean) ** 2, 0) / Math.max(absValues.length, 1);
  const ranked = [...scored].sort(
    (a, b) => Math.abs(b.gapScore) - Math.abs(a.gapScore) || a.regionId.localeCompare(b.regionId)
  );
  return {
    sampleSize: scored.length,
    meanAbsGap,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    outlierRegionId: ranked[0]?.regionId ?? null,
  };
}
