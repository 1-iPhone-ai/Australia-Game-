import { nrDashBuildCapacityHeadroom } from './capacity-headroom.ts';
import { nrDashBuildUtilizationSkew } from './utilization-skew.ts';
import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashUtilHeadroomDivergence {
  utilizationSpread: number;
  headroomSpread: number;
  /** Util spread minus headroom spread (positive = util more dispersed). */
  divergence: number;
}

/** Compare national utilization skew spread to capacity headroom spread. */
export function nrDashBuildUtilHeadroomDivergence(
  snap: NrDashAuthSnapshot | null
): NrDashUtilHeadroomDivergence | null {
  const skew = nrDashBuildUtilizationSkew(snap);
  const headroom = nrDashBuildCapacityHeadroom(snap);
  if (!skew || !headroom) return null;
  const divergence = Math.round((skew.spread - headroom.spread) * 1000) / 1000;
  return {
    utilizationSpread: skew.spread,
    headroomSpread: headroom.spread,
    divergence,
  };
}
