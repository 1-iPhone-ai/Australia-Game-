import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashModerateNeedsSpread {
  regionCount: number;
  totalModerateNeeds: number;
  meanModerateNeeds: number;
  stdDev: number;
}

/** Cross-region dispersion of open LR needs at moderate severity. */
export function nrDashBuildModerateNeedsSpread(
  lr: LivingRegionsWorldView | null
): NrDashModerateNeedsSpread | null {
  if (!lr?.state.regions) return null;
  const counts = Object.values(lr.state.regions).map(reg =>
    reg.needs.filter(n => n.status === 'open' && n.severity === 'moderate').length
  );
  const totalModerateNeeds = counts.reduce((s, n) => s + n, 0);
  if (totalModerateNeeds <= 0) return null;
  const meanModerateNeeds = totalModerateNeeds / counts.length;
  const variance =
    counts.reduce((s, n) => s + (n - meanModerateNeeds) ** 2, 0) / Math.max(counts.length, 1);
  return {
    regionCount: counts.length,
    totalModerateNeeds,
    meanModerateNeeds: Math.round(meanModerateNeeds * 1000) / 1000,
    stdDev: Math.round(Math.sqrt(variance) * 1000) / 1000,
  };
}
