import type { NationalDependency, NationalSystemsState } from '../types.ts';

export interface NrDashDependencyImportanceCount {
  importance: NationalDependency['importance'];
  count: number;
}

export function nrDashBuildDependencyProfile(ns: NationalSystemsState | null): NrDashDependencyImportanceCount[] {
  if (!ns?.dependencies.length) return [];
  const counts: Record<NationalDependency['importance'], number> = {
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
  };
  ns.dependencies.forEach(d => {
    counts[d.importance] = (counts[d.importance] || 0) + 1;
  });
  return (['critical', 'high', 'moderate', 'low'] as const)
    .map(importance => ({ importance, count: counts[importance] }))
    .filter(x => x.count > 0);
}
