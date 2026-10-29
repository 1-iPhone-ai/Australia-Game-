import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashModerateTierNeedsConcentration {
  moderateOpenCount: number;
  regionCount: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open moderate LR needs across regions. */
export function nrDashBuildModerateTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashModerateTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const counts = regionIds.map(id =>
    lr.state.regions[id]!.needs.filter(n => n.status === 'open' && n.severity === 'moderate').length
  );
  const moderateOpenCount = counts.reduce((s, n) => s + n, 0);
  if (moderateOpenCount <= 0) return null;
  const contributingRegions = counts.filter(c => c > 0).length;
  if (contributingRegions <= 1) return null;
  let concentrationIndex = 0;
  counts.forEach(count => {
    if (count <= 0) return;
    const share = count / moderateOpenCount;
    concentrationIndex += share * share;
  });
  return {
    moderateOpenCount,
    regionCount: regionIds.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
