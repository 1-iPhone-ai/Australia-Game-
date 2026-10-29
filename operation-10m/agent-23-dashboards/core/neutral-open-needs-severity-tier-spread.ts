import type { LivingRegionsWorldView, NrDashAuthSnapshot, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashNeutralOpenNeedsSeverityTierSpread {
  neutralRegionCount: number;
  minTierRank: number;
  maxTierRank: number;
  severityTierSpread: number;
}

/** Spread of mean open-need severity ordinals across neutral-owned regions. */
export function nrDashBuildNeutralOpenNeedsSeverityTierSpread(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOpenNeedsSeverityTierSpread | null {
  if (!lr?.state.regions || !snap?.regions.length) return null;
  const neutral = snap.regions.filter(r => r.owner === 'neutral' && r.openNeeds > 0);
  if (neutral.length <= 1) return null;
  const means = neutral.map(row => {
    const open = lr.state.regions[row.regionId]?.needs.filter(n => n.status === 'open') ?? [];
    if (!open.length) return 0;
    const sum = open.reduce((s, n) => s + SEVERITY_ORD[n.severity], 0);
    return sum / open.length;
  });
  const minTierRank = Math.min(...means);
  const maxTierRank = Math.max(...means);
  const severityTierSpread = maxTierRank - minTierRank;
  if (severityTierSpread <= 0) return null;
  return {
    neutralRegionCount: neutral.length,
    minTierRank: Math.round(minTierRank * 1000) / 1000,
    maxTierRank: Math.round(maxTierRank * 1000) / 1000,
    severityTierSpread: Math.round(severityTierSpread * 1000) / 1000,
  };
}
