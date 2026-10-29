import { agent23ListAdjacencyPairs } from './adjacency.ts';
import { NATIONAL_NETWORKS } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashCorridorStressRow {
  corridorKey: string;
  regionA: string;
  regionB: string;
  /** Mean peak utilization across the two endpoint regions (0..1). */
  meanPeakUtilization: number;
  /** Worst condition rank label across both regions' network cells. */
  worstLabel: string;
}

function regionPeakUtilization(ns: NationalSystemsState, regionId: string): number {
  const reg = ns.regions[regionId];
  if (!reg) return 0;
  let peak = 0;
  NATIONAL_NETWORKS.forEach(n => {
    const u = reg.networks[n]?.utilization ?? 0;
    if (u > peak) peak = u;
  });
  return peak;
}

/** Land-corridor stress from NS utilization at adjacency endpoints (state-derived). */
export function nrDashBuildCorridorStressRows(ns: NationalSystemsState | null): NrDashCorridorStressRow[] {
  if (!ns) return [];
  return agent23ListAdjacencyPairs().map(({ a, b, key }) => {
    const peakA = regionPeakUtilization(ns, a);
    const peakB = regionPeakUtilization(ns, b);
    const meanPeakUtilization = Math.round(((peakA + peakB) / 2) * 1000) / 1000;
    const worst = Math.max(peakA, peakB);
    const worstLabel = worst >= 0.9 ? 'critical corridor' : worst >= 0.75 ? 'strained corridor' : 'stable corridor';
    return { corridorKey: key, regionA: a, regionB: b, meanPeakUtilization, worstLabel };
  });
}

export function nrDashTopCorridorStress(ns: NationalSystemsState | null, limit = 5): NrDashCorridorStressRow[] {
  return nrDashBuildCorridorStressRows(ns)
    .sort((x, y) => y.meanPeakUtilization - x.meanPeakUtilization || x.corridorKey.localeCompare(y.corridorKey))
    .slice(0, limit);
}
