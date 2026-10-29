import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashCriticalNeedsSpread {
  regionCount: number;
  totalCriticalNeeds: number;
  meanCriticalNeeds: number;
  stdDev: number;
}

/** Cross-region dispersion of open LR needs at critical severity. */
export function nrDashBuildCriticalNeedsSpread(
  lr: LivingRegionsWorldView | null
): NrDashCriticalNeedsSpread | null {
  if (!lr?.state.regions) return null;
  const counts = Object.values(lr.state.regions).map(reg =>
    reg.needs.filter(n => n.status === 'open' && n.severity === 'critical').length
  );
  const totalCriticalNeeds = counts.reduce((s, n) => s + n, 0);
  if (totalCriticalNeeds <= 0) return null;
  const meanCriticalNeeds = totalCriticalNeeds / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanCriticalNeeds) ** 2, 0) / Math.max(counts.length, 1);
  return {
    regionCount: counts.length,
    totalCriticalNeeds,
    meanCriticalNeeds: Math.round(meanCriticalNeeds * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}
