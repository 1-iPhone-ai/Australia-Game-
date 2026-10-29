import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashCriticalTierNeedsConcentration {
  criticalOpenCount: number;
  regionCount: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open critical LR needs across regions. */
export function nrDashBuildCriticalTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashCriticalTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const counts = regionIds.map(id =>
    lr.state.regions[id]!.needs.filter(n => n.status === 'open' && n.severity === 'critical').length
  );
  const criticalOpenCount = counts.reduce((s, n) => s + n, 0);
  if (criticalOpenCount <= 0) return null;
  const contributingRegions = counts.filter(c => c > 0).length;
  if (contributingRegions <= 1) return null;
  let concentrationIndex = 0;
  counts.forEach(count => {
    if (count <= 0) return;
    const share = count / criticalOpenCount;
    concentrationIndex += share * share;
  });
  return {
    criticalOpenCount,
    regionCount: regionIds.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
