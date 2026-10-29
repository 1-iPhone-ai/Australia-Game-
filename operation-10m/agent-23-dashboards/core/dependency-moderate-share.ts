import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyModerateShare {
  edgeCount: number;
  moderateCount: number;
  moderateShare: number;
}

/** Share of NS dependency edges marked moderate importance. */
export function nrDashBuildDependencyModerateShare(
  ns: NationalSystemsState | null
): NrDashDependencyModerateShare | null {
  if (!ns?.dependencies?.length) return null;
  const moderateCount = ns.dependencies.filter(d => d.importance === 'moderate').length;
  return {
    edgeCount: ns.dependencies.length,
    moderateCount,
    moderateShare: Math.round((moderateCount / ns.dependencies.length) * 1000) / 1000,
  };
}
