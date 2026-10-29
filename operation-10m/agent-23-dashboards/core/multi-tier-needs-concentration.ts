import type { LivingRegionsWorldView, RegionalNeed } from '../types.ts';

const NEED_TIER_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashMultiTierNeedsConcentration {
  openNeedCount: number;
  activeTierCount: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open LR needs across severity tiers. */
export function nrDashBuildMultiTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashMultiTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  const tierCounts = [0, 0, 0, 0];
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs
      .filter(n => n.status === 'open')
      .forEach(n => {
        tierCounts[NEED_TIER_ORD[n.severity]] += 1;
      });
  });
  const openNeedCount = tierCounts.reduce((s, n) => s + n, 0);
  if (openNeedCount <= 0) return null;
  const activeTierCount = tierCounts.filter(c => c > 0).length;
  if (activeTierCount <= 1) return null;
  let concentrationIndex = 0;
  tierCounts.forEach(count => {
    if (count <= 0) return;
    const share = count / openNeedCount;
    concentrationIndex += share * share;
  });
  return {
    openNeedCount,
    activeTierCount,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
