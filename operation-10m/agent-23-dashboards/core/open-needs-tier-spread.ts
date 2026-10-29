import type { LivingRegionsWorldView, RegionalNeed } from '../types.ts';

const NEED_TIER_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashOpenNeedsTierSpread {
  regionCount: number;
  tierSlotCount: number;
  minTierCount: number;
  maxTierCount: number;
  tierSpread: number;
}

/** Spread between min and max open-need counts across severity tiers (national LR totals). */
export function nrDashBuildOpenNeedsTierSpread(
  lr: LivingRegionsWorldView | null
): NrDashOpenNeedsTierSpread | null {
  if (!lr?.state.regions) return null;
  const tierCounts = [0, 0, 0, 0];
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs
      .filter(n => n.status === 'open')
      .forEach(n => {
        tierCounts[NEED_TIER_ORD[n.severity]] += 1;
      });
  });
  const totalOpen = tierCounts.reduce((s, n) => s + n, 0);
  if (totalOpen <= 0) return null;
  const active = tierCounts.filter(c => c > 0);
  const minTierCount = Math.min(...active);
  const maxTierCount = Math.max(...active);
  return {
    regionCount: Object.keys(lr.state.regions).length,
    tierSlotCount: tierCounts.length,
    minTierCount,
    maxTierCount,
    tierSpread: maxTierCount - minTierCount,
  };
}
