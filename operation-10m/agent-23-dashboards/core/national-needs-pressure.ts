import type { NrDashAuthSnapshot } from '../types.ts';

export interface NrDashNationalNeedsPressure {
  totalOpenNeeds: number;
  nationalResilience: number | null;
  /** Open needs per ten resilience points (higher = more pressure). */
  pressureIndex: number;
}

/** LR open-needs total vs NS national resilience score (merged snapshot). */
export function nrDashBuildNationalNeedsPressure(
  snap: NrDashAuthSnapshot | null
): NrDashNationalNeedsPressure | null {
  if (!snap?.regions.length) return null;
  const totalOpenNeeds = snap.regions.reduce((s, r) => s + r.openNeeds, 0);
  if (snap.nationalResilience == null) return null;
  const pressureIndex =
    Math.round((totalOpenNeeds / Math.max(snap.nationalResilience / 10, 1)) * 1000) / 1000;
  return {
    totalOpenNeeds,
    nationalResilience: snap.nationalResilience,
    pressureIndex,
  };
}
