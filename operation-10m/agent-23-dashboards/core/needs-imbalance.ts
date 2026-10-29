import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNeedsImbalance {
  totalOpenNeeds: number;
  meanPerRegion: number;
  stdDev: number;
  neediestRegionId: string | null;
  neediestOpenNeeds: number;
  /** max/min among regions with needs > 0, null when flat. */
  spreadRatio: number | null;
}

/** Regional open-needs dispersion from snapshot rows (LR-derived counts). */
export function nrDashBuildNeedsImbalance(snap: NrDashAuthSnapshot | null): NrDashNeedsImbalance | null {
  if (!snap?.regions.length) return null;
  const counts = snap.regions.map(r => r.openNeeds);
  const totalOpenNeeds = counts.reduce((s, n) => s + n, 0);
  const meanPerRegion = totalOpenNeeds / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanPerRegion) ** 2, 0) / Math.max(counts.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 100) / 100;
  const ranked = [...snap.regions].sort((a, b) => b.openNeeds - a.openNeeds || a.regionId.localeCompare(b.regionId));
  const neediest = ranked[0];
  const positives = counts.filter(n => n > 0);
  const spreadRatio =
    positives.length >= 2
      ? Math.round((Math.max(...positives) / Math.min(...positives)) * 100) / 100
      : null;
  return {
    totalOpenNeeds,
    meanPerRegion: Math.round(meanPerRegion * 100) / 100,
    stdDev,
    neediestRegionId: neediest?.openNeeds ? neediest.regionId : null,
    neediestOpenNeeds: neediest?.openNeeds ?? 0,
    spreadRatio,
  };
}
