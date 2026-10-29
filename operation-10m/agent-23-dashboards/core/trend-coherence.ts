import { nrDashBuildTrendDeltas } from './trend-delta.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashTrendCoherence {
  sampleSize: number;
  meanDelta: number;
  stdDev: number;
  /** 1 − normalized σ of deltas (1 = all regions move together). */
  coherenceScore: number;
  divergentRegionId: string | null;
}

/** How aligned regional momentum history deltas are (no forecasting). */
export function nrDashBuildTrendCoherence(snap: NrDashAuthSnapshot | null): NrDashTrendCoherence | null {
  if (!snap?.regions.length) return null;
  const deltas = nrDashBuildTrendDeltas(snap.regions).filter(d => d.delta != null);
  if (!deltas.length) return null;
  const values = deltas.map(d => d.delta!);
  const meanDelta = values.reduce((s, v) => s + v, 0) / values.length;
  const variance =
    values.reduce((s, v) => s + (v - meanDelta) ** 2, 0) / Math.max(values.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const maxStd = Math.max(...values.map(v => Math.abs(v)), 0.001);
  const coherenceScore = Math.round(Math.max(0, 1 - stdDev / maxStd) * 1000) / 1000;
  const divergent = [...deltas].sort((a, b) => Math.abs(b.delta!) - Math.abs(a.delta!))[0];
  return {
    sampleSize: deltas.length,
    meanDelta: Math.round(meanDelta * 1000) / 1000,
    stdDev,
    coherenceScore,
    divergentRegionId: divergent?.regionId ?? null,
  };
}
