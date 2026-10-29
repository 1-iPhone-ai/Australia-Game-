import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyProviderLoad {
  edgeCount: number;
  meanEdgesPerProvider: number;
  stdDev: number;
  topProviderId: string | null;
}

/** Dispersion of dependency edge counts by provider region (NS authoritative). */
export function nrDashBuildDependencyProviderLoad(
  ns: NationalSystemsState | null
): NrDashDependencyProviderLoad | null {
  if (!ns?.dependencies?.length) return null;
  const counts = new Map<string, number>();
  ns.dependencies.forEach(d => {
    counts.set(d.providerRegionId, (counts.get(d.providerRegionId) ?? 0) + 1);
  });
  const values = [...counts.values()];
  const meanEdgesPerProvider = values.reduce((s, n) => s + n, 0) / values.length;
  const variance =
    values.reduce((s, n) => s + (n - meanEdgesPerProvider) ** 2, 0) / Math.max(values.length, 1);
  let topProviderId: string | null = null;
  let topCount = 0;
  counts.forEach((count, id) => {
    if (count > topCount) {
      topCount = count;
      topProviderId = id;
    }
  });
  return {
    edgeCount: ns.dependencies.length,
    meanEdgesPerProvider: Math.round(meanEdgesPerProvider * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    topProviderId,
  };
}
