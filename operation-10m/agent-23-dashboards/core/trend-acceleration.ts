import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashTrendAcceleration {
  sampleSize: number;
  meanAcceleration: number;
  stdDev: number;
  /** 1 − normalized σ (1 = all regions accelerating similarly). */
  coherenceScore: number;
  outlierRegionId: string | null;
}

function accelerationFromHistory(history: number[]): number | null {
  const pts = history.filter(v => Number.isFinite(v));
  if (pts.length < 3) return null;
  const mid = pts[Math.floor(pts.length / 2)];
  const first = pts[0];
  const last = pts[pts.length - 1];
  return Math.round((last - mid - (mid - first)) * 1000) / 1000;
}

/** Second-order momentum history curvature across regions (no forecasting). */
export function nrDashBuildTrendAcceleration(snap: NrDashAuthSnapshot | null): NrDashTrendAcceleration | null {
  if (!snap?.regions.length) return null;
  const entries = snap.regions
    .map(r => ({ regionId: r.regionId, acc: accelerationFromHistory(r.momentumHistory) }))
    .filter(e => e.acc != null) as { regionId: string; acc: number }[];
  if (!entries.length) return null;
  const values = entries.map(e => e.acc);
  const meanAcceleration = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanAcceleration) ** 2, 0) / Math.max(values.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const maxStd = Math.max(...values.map(v => Math.abs(v)), 0.001);
  const coherenceScore = Math.round(Math.max(0, 1 - stdDev / maxStd) * 1000) / 1000;
  const outlier = [...entries].sort((a, b) => Math.abs(b.acc) - Math.abs(a.acc))[0];
  return {
    sampleSize: entries.length,
    meanAcceleration: Math.round(meanAcceleration * 1000) / 1000,
    stdDev,
    coherenceScore,
    outlierRegionId: outlier?.regionId ?? null,
  };
}
