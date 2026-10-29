import type { LivingRegionsWorldView, NrDashAuthSnapshot, RegionalNeed } from '../types.ts';

export interface NrDashNeutralOpenNeedsTierConcentration {
  neutralRegionCount: number;
  openNeedCount: number;
  tierBucketCount: number;
  concentrationIndex: number;
}

/** Herfindahl concentration of open-need counts by severity tier on neutral-owned regions. */
export function nrDashBuildNeutralOpenNeedsTierConcentration(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOpenNeedsTierConcentration | null {
  if (!lr?.state.regions || !snap?.regions.length) return null;
  const neutralIds = new Set(snap.regions.filter(r => r.owner === 'neutral').map(r => r.regionId));
  if (neutralIds.size <= 1) return null;
  const tierCounts: Record<RegionalNeed['severity'], number> = {
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
  };
  let openNeedCount = 0;
  neutralIds.forEach(id => {
    const reg = lr.state.regions[id];
    if (!reg) return;
    reg.needs.filter(n => n.status === 'open').forEach(n => {
      tierCounts[n.severity] += 1;
      openNeedCount += 1;
    });
  });
  if (openNeedCount <= 0) return null;
  const buckets = (Object.keys(tierCounts) as RegionalNeed['severity'][]).filter(t => tierCounts[t] > 0);
  if (buckets.length <= 1) return null;
  let concentrationIndex = 0;
  buckets.forEach(tier => {
    const share = tierCounts[tier] / openNeedCount;
    concentrationIndex += share * share;
  });
  return {
    neutralRegionCount: neutralIds.size,
    openNeedCount,
    tierBucketCount: buckets.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
