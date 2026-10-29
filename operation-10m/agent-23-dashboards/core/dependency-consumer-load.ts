import type { NationalSystemsState } from '../types.ts';

export interface NrDashDependencyConsumerLoad {
  edgeCount: number;
  meanEdgesPerConsumer: number;
  stdDev: number;
  topConsumerId: string | null;
}

/** Dispersion of dependency edge counts by consumer region (NS authoritative). */
export function nrDashBuildDependencyConsumerLoad(
  ns: NationalSystemsState | null
): NrDashDependencyConsumerLoad | null {
  if (!ns?.dependencies?.length) return null;
  const counts = new Map<string, number>();
  ns.dependencies.forEach(d => {
    counts.set(d.consumerRegionId, (counts.get(d.consumerRegionId) ?? 0) + 1);
  });
  const values = [...counts.values()];
  const meanEdgesPerConsumer = values.reduce((s, n) => s + n, 0) / values.length;
  const variance =
    values.reduce((s, n) => s + (n - meanEdgesPerConsumer) ** 2, 0) / Math.max(values.length, 1);
  let topConsumerId: string | null = null;
  let topCount = 0;
  counts.forEach((count, id) => {
    if (count > topCount) {
      topCount = count;
      topConsumerId = id;
    }
  });
  return {
    edgeCount: ns.dependencies.length,
    meanEdgesPerConsumer: Math.round(meanEdgesPerConsumer * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    topConsumerId,
  };
}
