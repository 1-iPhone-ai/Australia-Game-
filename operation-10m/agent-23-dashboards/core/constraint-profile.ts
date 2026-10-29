import { NATIONAL_NETWORK_LABEL, NATIONAL_NETWORKS } from './constants.ts';
import type { NationalNetworkKind, NationalSystemsState } from '../types.ts';

export interface NrDashConstraintCount {
  network: NationalNetworkKind;
  label: string;
  regionCount: number;
}

/** Count regions whose primaryConstraint matches each network (NS authoritative). */
export function nrDashBuildConstraintProfile(ns: NationalSystemsState | null): NrDashConstraintCount[] {
  if (!ns) return [];
  const counts: Record<NationalNetworkKind, number> = {
    freight: 0,
    energy: 0,
    water: 0,
    trade: 0,
    digital: 0,
  };
  Object.values(ns.regions).forEach(r => {
    if (r.primaryConstraint) counts[r.primaryConstraint] += 1;
  });
  return NATIONAL_NETWORKS.map(network => ({
    network,
    label: NATIONAL_NETWORK_LABEL[network],
    regionCount: counts[network],
  })).filter(x => x.regionCount > 0);
}
