import { nrDashBuildHeatCells } from './heat-matrix.ts';
import type { NationalNetworkCondition, NationalSystemsState } from '../types.ts';

const CONDITION_WEIGHT: Record<NationalNetworkCondition, number> = {
  surplus: 0,
  healthy: 1,
  strained: 2,
  bottlenecked: 3,
  critical: 4,
};

export interface NrDashStrainDiversity {
  cellCount: number;
  meanWeight: number;
  stdDev: number;
  /** Normalized 0..1 spread of condition weights across the heat grid. */
  diversityIndex: number;
  dominantCondition: NationalNetworkCondition | null;
}

/** Dispersion of NS condition severity across the region × network heat grid. */
export function nrDashBuildStrainDiversity(ns: NationalSystemsState | null): NrDashStrainDiversity | null {
  if (!ns) return null;
  const heat = nrDashBuildHeatCells(ns);
  if (!heat.cells.length) return null;
  const weights = heat.cells.map(c => CONDITION_WEIGHT[c.tone] ?? 0);
  const meanWeight = weights.reduce((s, w) => s + w, 0) / weights.length;
  const variance =
    weights.reduce((s, w) => s + (w - meanWeight) ** 2, 0) / Math.max(weights.length, 1);
  const stdDev = Math.round(Math.sqrt(variance) * 1000) / 1000;
  const maxWeight = 4;
  const diversityIndex = Math.round((stdDev / maxWeight) * 1000) / 1000;
  const counts = new Map<NationalNetworkCondition, number>();
  heat.cells.forEach(c => counts.set(c.tone, (counts.get(c.tone) ?? 0) + 1));
  let dominantCondition: NationalNetworkCondition | null = null;
  let best = 0;
  counts.forEach((n, cond) => {
    if (n > best) {
      best = n;
      dominantCondition = cond;
    }
  });
  return {
    cellCount: heat.cells.length,
    meanWeight: Math.round(meanWeight * 1000) / 1000,
    stdDev,
    diversityIndex,
    dominantCondition,
  };
}
