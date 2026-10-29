import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashHighRiskRegionDensity {
  regionCount: number;
  highRiskRegionCount: number;
  density: number;
}

/** Share of LR regions reporting at least one high-severity risk. */
export function nrDashBuildHighRiskRegionDensity(
  snap: NrDashAuthSnapshot | null
): NrDashHighRiskRegionDensity | null {
  if (!snap?.regions.length) return null;
  const highRiskRegionCount = snap.regions.filter(r => r.highRisks > 0).length;
  return {
    regionCount: snap.regions.length,
    highRiskRegionCount,
    density: Math.round((highRiskRegionCount / snap.regions.length) * 1000) / 1000,
  };
}
