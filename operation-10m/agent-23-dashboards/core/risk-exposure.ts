import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashRiskExposureRow {
  regionId: string;
  name: string;
  openNeeds: number;
  highRisks: number;
  /** Weighted LR exposure index (needs + 2× high risks). */
  exposureScore: number;
}

export interface NrDashRiskExposureSummary {
  rows: NrDashRiskExposureRow[];
  totalExposure: number;
  stdDev: number;
  hotspotRegionId: string | null;
}

/** Aggregate open needs and high-severity risks per region (snapshot rows only). */
export function nrDashBuildRiskExposure(snap: NrDashAuthSnapshot | null): NrDashRiskExposureSummary | null {
  if (!snap?.regions.length) return null;
  const rows: NrDashRiskExposureRow[] = snap.regions.map(r => ({
    regionId: r.regionId,
    name: r.name,
    openNeeds: r.openNeeds,
    highRisks: r.highRisks,
    exposureScore: r.openNeeds + r.highRisks * 2,
  }));
  rows.sort((a, b) => b.exposureScore - a.exposureScore || a.regionId.localeCompare(b.regionId));
  const scores = rows.map(r => r.exposureScore);
  const totalExposure = scores.reduce((s, n) => s + n, 0);
  const mean = totalExposure / scores.length;
  const variance = scores.reduce((s, n) => s + (n - mean) ** 2, 0) / Math.max(scores.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;
  const hotspot = rows[0]?.exposureScore ? rows[0].regionId : null;
  return { rows, totalExposure, stdDev, hotspotRegionId: hotspot };
}

export function nrDashTopRiskExposureRows(snap: NrDashAuthSnapshot | null, limit = 3): NrDashRiskExposureRow[] {
  const summary = nrDashBuildRiskExposure(snap);
  return summary ? summary.rows.slice(0, limit) : [];
}
