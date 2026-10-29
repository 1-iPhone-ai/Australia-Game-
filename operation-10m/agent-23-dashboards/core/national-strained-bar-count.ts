import { NS_COND_RANK } from './constants.ts';
import type { NationalNetworkCondition, NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNationalStrainedBarCount {
  networkCount: number;
  strainedPlusCount: number;
  density: number;
}

const strainedPlus = (condition: NationalNetworkCondition) => NS_COND_RANK[condition] >= NS_COND_RANK.strained;

/** Count of authoritative national network bars at strained+ condition. */
export function nrDashBuildNationalStrainedBarCount(
  snap: NrDashAuthSnapshot | null
): NrDashNationalStrainedBarCount | null {
  if (!snap?.networks.length) return null;
  const strainedPlusCount = snap.networks.filter(n => strainedPlus(n.condition)).length;
  return {
    networkCount: snap.networks.length,
    strainedPlusCount,
    density: Math.round((strainedPlusCount / snap.networks.length) * 1000) / 1000,
  };
}
