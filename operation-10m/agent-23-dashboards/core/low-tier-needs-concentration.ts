import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashLowTierNeedsConcentration {
  lowOpenCount: number;
  regionCount: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open low-severity LR needs across regions. */
export function nrDashBuildLowTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashLowTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const counts = regionIds.map(id =>
    lr.state.regions[id]!.needs.filter(n => n.status === 'open' && n.severity === 'low').length
  );
  const lowOpenCount = counts.reduce((s, n) => s + n, 0);
  if (lowOpenCount <= 0) return null;
  const contributingRegions = counts.filter(c => c > 0).length;
  if (contributingRegions <= 1) return null;
  let concentrationIndex = 0;
  counts.forEach(count => {
    if (count <= 0) return;
    const share = count / lowOpenCount;
    concentrationIndex += share * share;
  });
  return {
    lowOpenCount,
    regionCount: regionIds.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
