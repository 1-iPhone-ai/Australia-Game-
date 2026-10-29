import { COMM_REGION_CODES } from './constants.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashNationalBottleneckDensity {
  regionCount: number;
  activeBottlenecks: number;
  density: number;
}

/** Active NS bottlenecks per canonical region slot (state list length). */
export function nrDashBuildNationalBottleneckDensity(
  ns: NationalSystemsState | null
): NrDashNationalBottleneckDensity | null {
  if (!ns) return null;
  const regionCount = COMM_REGION_CODES.length;
  const activeBottlenecks = ns.bottlenecks.length;
  return {
    regionCount,
    activeBottlenecks,
    density: Math.round((activeBottlenecks / regionCount) * 1000) / 1000,
  };
}
