import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNationalResilienceGap {
  nationalScore: number;
  regionalMean: number;
  gap: number;
  sampleSize: number;
}

/** Delta between NS national resilience score and mean regional resilience on the snapshot. */
export function nrDashBuildNationalResilienceGap(
  snap: NrDashAuthSnapshot | null
): NrDashNationalResilienceGap | null {
  if (!snap?.regions.length || snap.nationalResilience == null) return null;
  const vals = snap.regions
    .map(r => r.resilience)
    .filter((v): v is number => v != null && Number.isFinite(v));
  if (!vals.length) return null;
  const regionalMean = Math.round((vals.reduce((s, n) => s + n, 0) / vals.length) * 10) / 10;
  const nationalScore = snap.nationalResilience;
  return {
    nationalScore,
    regionalMean,
    gap: Math.round((nationalScore - regionalMean) * 10) / 10,
    sampleSize: vals.length,
  };
}
