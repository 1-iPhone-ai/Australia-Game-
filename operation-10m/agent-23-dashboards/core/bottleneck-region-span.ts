import { COMM_REGION_CODES } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashBottleneckRegionSpan {
  regionSlots: number;
  distinctRegions: number;
  spanRatio: number;
}

/** Fraction of canonical region slots touched by at least one active NS bottleneck. */
export function nrDashBuildBottleneckRegionSpan(
  ns: NationalSystemsState | null
): NrDashBottleneckRegionSpan | null {
  if (!ns) return null;
  const regionSlots = COMM_REGION_CODES.length;
  const touched = new Set<string>();
  ns.bottlenecks.forEach(b => {
    if (b.regionId) touched.add(b.regionId);
  });
  const distinctRegions = touched.size;
  return {
    regionSlots,
    distinctRegions,
    spanRatio: Math.round((distinctRegions / regionSlots) * 1000) / 1000,
  };
}
