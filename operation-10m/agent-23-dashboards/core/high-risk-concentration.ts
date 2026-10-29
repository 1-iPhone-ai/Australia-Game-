import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashHighRiskConcentration {
  totalHighRisks: number;
  topRegionId: string | null;
  concentrationIndex: number;
  topRegionShare: number;
}

/** Herfindahl clustering of LR high-severity risk counts across regions. */
export function nrDashBuildHighRiskConcentration(
  snap: NrDashAuthSnapshot | null
): NrDashHighRiskConcentration | null {
  if (!snap?.regions.length) return null;
  const totalHighRisks = snap.regions.reduce((s, r) => s + r.highRisks, 0);
  if (totalHighRisks <= 0) return null;
  let topRegionId: string | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  snap.regions.forEach(r => {
    if (r.highRisks > topCount) {
      topCount = r.highRisks;
      topRegionId = r.regionId;
    }
    const share = r.highRisks / totalHighRisks;
    concentrationIndex += share * share;
  });
  return {
    totalHighRisks,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topCount / totalHighRisks) * 1000) / 1000,
  };
}
