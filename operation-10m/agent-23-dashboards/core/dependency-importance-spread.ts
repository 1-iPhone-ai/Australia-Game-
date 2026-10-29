import type { NationalSystemsState } from '../types.ts';

const IMPORTANCE_WEIGHT: Record<string, number> = {
  moderate: 1,
  high: 1.25,
  critical: 1.5,
};

export interface NrDashDependencyImportanceSpread {
  edgeCount: number;
  meanWeight: number;
  stdDev: number;
  maxWeight: number;
}

/** Dispersion of authoritative dependency edge importance weights. */
export function nrDashBuildDependencyImportanceSpread(
  ns: NationalSystemsState | null
): NrDashDependencyImportanceSpread | null {
  if (!ns?.dependencies?.length) return null;
  const weights = ns.dependencies.map(d => IMPORTANCE_WEIGHT[d.importance] ?? 1);
  const meanWeight = weights.reduce((s, w) => s + w, 0) / weights.length;
  const variance =
    weights.reduce((s, w) => s + (w - meanWeight) ** 2, 0) / Math.max(weights.length, 1);
  return {
    edgeCount: weights.length,
    meanWeight: Math.round(meanWeight * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
    maxWeight: Math.max(...weights),
  };
}
