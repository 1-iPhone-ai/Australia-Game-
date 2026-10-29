import { nrDashBuildTrendDeltas } from './trend-delta.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashMomentumDeltaSpread {
  sampleSize: number;
  meanAbsDelta: number;
  stdDev: number;
  outlierRegionId: string | null;
}

/** Cross-region dispersion of LR momentum history deltas (last − first). */
export function nrDashBuildMomentumDeltaSpread(snap: NrDashAuthSnapshot | null): NrDashMomentumDeltaSpread | null {
  if (!snap?.regions.length) return null;
  const deltas = nrDashBuildTrendDeltas(snap.regions)
    .filter(r => r.delta != null)
    .map(r => ({ regionId: r.regionId, delta: r.delta as number }));
  if (!deltas.length) return null;
  const absValues = deltas.map(d => Math.abs(d.delta));
  const meanAbsDelta =
    Math.round((absValues.reduce((s, n) => s + n, 0) / absValues.length) * 1000) / 1000;
  const mean = absValues.reduce((s, n) => s + n, 0) / absValues.length;
  const variance =
    absValues.reduce((s, n) => s + (n - mean) ** 2, 0) / Math.max(absValues.length, 1);
  const ranked = [...deltas].sort(
    (a, b) => Math.abs(b.delta) - Math.abs(a.delta) || a.regionId.localeCompare(b.regionId)
  );
  return {
    sampleSize: deltas.length,
    meanAbsDelta,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    outlierRegionId: ranked[0]?.regionId ?? null,
  };
}
