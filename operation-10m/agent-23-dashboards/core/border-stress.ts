import { nrDashBuildCorridorStressRows } from './corridor-stress.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashBorderStressRow {
  regionId: string;
  /** Max mean corridor stress on any land link touching this region. */
  maxCorridorStress: number;
  corridorCount: number;
}

/** Per-region land-border stress from adjacency corridor utilization peaks. */
export function nrDashBuildBorderStressRows(ns: NationalSystemsState | null): NrDashBorderStressRow[] {
  const corridors = nrDashBuildCorridorStressRows(ns);
  const byRegion = new Map<string, { max: number; count: number }>();
  corridors.forEach(c => {
    [c.regionA, c.regionB].forEach(regionId => {
      const cur = byRegion.get(regionId) ?? { max: 0, count: 0 };
      cur.max = Math.max(cur.max, c.meanPeakUtilization);
      cur.count += 1;
      byRegion.set(regionId, cur);
    });
  });
  return [...byRegion.entries()]
    .map(([regionId, { max, count }]) => ({
      regionId,
      maxCorridorStress: Math.round(max * 1000) / 1000,
      corridorCount: count,
    }))
    .sort((a, b) => b.maxCorridorStress - a.maxCorridorStress || a.regionId.localeCompare(b.regionId));
}

export function nrDashTopBorderStress(ns: NationalSystemsState | null, limit = 3): NrDashBorderStressRow[] {
  return nrDashBuildBorderStressRows(ns).slice(0, limit);
}

export function nrDashHottestBorderRegion(ns: NationalSystemsState | null): string | null {
  const top = nrDashBuildBorderStressRows(ns)[0];
  return top?.maxCorridorStress ? top.regionId : null;
}
