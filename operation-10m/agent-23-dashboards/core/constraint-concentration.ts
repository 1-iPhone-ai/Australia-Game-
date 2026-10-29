import { NATIONAL_NETWORKS } from './constants.ts';
import type { NationalNetworkKind, NationalSystemsState } from '../types.ts';

export interface NrDashConstraintConcentration {
  regionCount: number;
  dominantNetwork: NationalNetworkKind | null;
  concentrationIndex: number;
  dominantShare: number;
}

/** Herfindahl clustering of NS primaryConstraint assignments across regions. */
export function nrDashBuildConstraintConcentration(
  ns: NationalSystemsState | null
): NrDashConstraintConcentration | null {
  if (!ns?.regions) return null;
  const counts: Record<NationalNetworkKind, number> = {
    freight: 0,
    energy: 0,
    water: 0,
    trade: 0,
    digital: 0,
  };
  let regionCount = 0;
  Object.values(ns.regions).forEach(r => {
    if (!r.primaryConstraint) return;
    regionCount += 1;
    counts[r.primaryConstraint] += 1;
  });
  if (regionCount <= 0) return null;
  let dominantNetwork: NationalNetworkKind | null = null;
  let topCount = 0;
  let concentrationIndex = 0;
  NATIONAL_NETWORKS.forEach(network => {
    const c = counts[network];
    if (c > topCount) {
      topCount = c;
      dominantNetwork = network;
    }
    const share = c / regionCount;
    concentrationIndex += share * share;
  });
  return {
    regionCount,
    dominantNetwork,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
    dominantShare: Math.round((topCount / regionCount) * 1000) / 1000,
  };
}
