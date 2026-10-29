import { nrDashBuildConstraintProfile } from './constraint-profile.ts';
import type { NationalSystemsState } from '../types.ts';

export interface NrDashConstraintProfileSpread {
  networkKinds: number;
  meanRegionsPerConstraint: number;
  stdDev: number;
}

/** Dispersion of primary-constraint region counts across NS network kinds. */
export function nrDashBuildConstraintProfileSpread(
  ns: NationalSystemsState | null
): NrDashConstraintProfileSpread | null {
  const profile = nrDashBuildConstraintProfile(ns);
  if (!profile.length) return null;
  const counts = profile.map(p => p.regionCount);
  const meanRegionsPerConstraint = counts.reduce((s, n) => s + n, 0) / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanRegionsPerConstraint) ** 2, 0) / Math.max(counts.length, 1);
  return {
    networkKinds: profile.length,
    meanRegionsPerConstraint: Math.round(meanRegionsPerConstraint * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}
