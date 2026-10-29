import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyCriticalShare {
  edgeCount: number;
  criticalCount: number;
  criticalShare: number;
}

/** Share of NS dependency edges marked critical importance. */
export function nrDashBuildDependencyCriticalShare(
  ns: NationalSystemsState | null
): NrDashDependencyCriticalShare | null {
  if (!ns?.dependencies?.length) return null;
  const criticalCount = ns.dependencies.filter(d => d.importance === 'critical').length;
  return {
    edgeCount: ns.dependencies.length,
    criticalCount,
    criticalShare: Math.round((criticalCount / ns.dependencies.length) * 1000) / 1000,
  };
}
