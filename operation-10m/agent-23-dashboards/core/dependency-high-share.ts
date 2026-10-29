import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyHighShare {
  edgeCount: number;
  highPlusCount: number;
  highPlusShare: number;
}

/** Share of NS dependency edges marked high or critical importance. */
export function nrDashBuildDependencyHighShare(
  ns: NationalSystemsState | null
): NrDashDependencyHighShare | null {
  if (!ns?.dependencies?.length) return null;
  const highPlusCount = ns.dependencies.filter(
    d => d.importance === 'high' || d.importance === 'critical'
  ).length;
  return {
    edgeCount: ns.dependencies.length,
    highPlusCount,
    highPlusShare: Math.round((highPlusCount / ns.dependencies.length) * 1000) / 1000,
  };
}
