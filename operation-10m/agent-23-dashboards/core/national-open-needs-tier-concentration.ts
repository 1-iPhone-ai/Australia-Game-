import type { LivingRegionsWorldView, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashNationalOpenNeedsTierConcentration {
  tierBucketCount: number;
  openNeedCount: number;
  concentrationIndex: number;
}

/** Herfindahl concentration of national open-need counts by severity tier. */
export function nrDashBuildNationalOpenNeedsTierConcentration(
  lr: LivingRegionsWorldView | null
): NrDashNationalOpenNeedsTierConcentration | null {
  if (!lr?.state.regions) return null;
  const tierCounts: Record<RegionalNeed['severity'], number> = {
    low: 0,
    moderate: 0,
    high: 0,
    critical: 0,
  };
  let openNeedCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
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
    tierBucketCount: buckets.length,
    openNeedCount,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
