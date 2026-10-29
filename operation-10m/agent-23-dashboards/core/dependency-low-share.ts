import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyLowShare {
  edgeCount: number;
  lowCount: number;
  lowShare: number;
}

/** Share of NS dependency edges marked low importance. */
export function nrDashBuildDependencyLowShare(
  ns: NationalSystemsState | null
): NrDashDependencyLowShare | null {
  if (!ns?.dependencies?.length) return null;
  const lowCount = ns.dependencies.filter(d => d.importance === 'low').length;
  return {
    edgeCount: ns.dependencies.length,
    lowCount,
    lowShare: Math.round((lowCount / ns.dependencies.length) * 1000) / 1000,
  };
}
