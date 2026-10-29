import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashHighRiskSpread {
  regionCount: number;
  totalHighRisks: number;
  meanHighRisks: number;
  stdDev: number;
}

/** Cross-region dispersion of LR high-severity risk counts on the snapshot. */
export function nrDashBuildHighRiskSpread(
  snap: NrDashAuthSnapshot | null
): NrDashHighRiskSpread | null {
  if (!snap?.regions.length) return null;
  const counts = snap.regions.map(r => r.highRisks);
  const totalHighRisks = counts.reduce((s, n) => s + n, 0);
  const meanHighRisks = totalHighRisks / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanHighRisks) ** 2, 0) / Math.max(counts.length, 1);
  return {
    regionCount: counts.length,
    totalHighRisks,
    meanHighRisks: Math.round(meanHighRisks * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}
