import type { NationalSystemsState } from '../types.ts';

export interface NrDashBottleneckConcentration {
  activeCount: number;
  topRegionId: string | null;
  /** Herfindahl-style share² sum across regions (1 = all bottlenecks in one region). */
  concentrationIndex: number;
  topRegionShare: number;
}

/** How clustered active NS bottlenecks are by region (authoritative list only). */
export function nrDashBuildBottleneckConcentration(ns: NationalSystemsState | null): NrDashBottleneckConcentration | null {
  if (!ns?.bottlenecks?.length) return null;
  const counts = new Map<string, number>();
  ns.bottlenecks.forEach(b => {
    const id = b.regionId ?? 'unknown';
    counts.set(id, (counts.get(id) ?? 0) + 1);
  });
  const activeCount = ns.bottlenecks.length;
  let topRegionId: string | null = null;
  let topCount = 0;
  counts.forEach((n, id) => {
    if (n > topCount) {
      topCount = n;
      topRegionId = id === 'unknown' ? null : id;
    }
  });
  let concentrationIndex = 0;
  counts.forEach(n => {
    const share = n / activeCount;
    concentrationIndex += share * share;
  });
  return {
    activeCount,
    topRegionId,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    topRegionShare: Math.round((topCount / activeCount) * 1000) / 1000,
  };
}
