import type { LivingRegionsWorldView, NrDashAuthSnapshot, RegionalNeed } from '../types.ts';

export interface NrDashNonYouOpenNeedsTierConcentration {
  nonYouRegionCount: number;
  openNeedCount: number;
  tierBucketCount: number;
  concentrationIndex: number;
}

/** Herfindahl concentration of open-need counts by severity tier on non-you snapshot rows. */
export function nrDashBuildNonYouOpenNeedsTierConcentration(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashNonYouOpenNeedsTierConcentration | null {
  if (!lr?.state.regions || !snap?.regions.length) return null;
  const rows = snap.regions.filter(r => r.owner !== 'you' && r.openNeeds > 0);
  if (rows.length <= 1) return null;
  const tierCounts: Record<RegionalNeed['severity'], number> = {
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
  };
  let openNeedCount = 0;
  rows.forEach(row => {
    const open = lr.state.regions[row.regionId]?.needs.filter(n => n.status === 'open') ?? [];
    open.forEach(n => {
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
    nonYouRegionCount: rows.length,
    openNeedCount,
    tierBucketCount: buckets.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
