import type { LivingRegionsWorldView, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashNationalSeverityTierSpread {
  regionCount: number;
  minMeanRank: number;
  maxMeanRank: number;
  tierSpread: number;
}

/** Spread of mean open-need severity ranks across LR regions (national view). */
export function nrDashBuildNationalSeverityTierSpread(
  lr: LivingRegionsWorldView | null
): NrDashNationalSeverityTierSpread | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const means = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return null;
    const sum = open.reduce((s, n) => s + SEVERITY_ORD[n.severity], 0);
    return sum / open.length;
  });
  const active = means.filter((m): m is number => m != null);
  if (active.length <= 1) return null;
  const minMeanRank = Math.min(...active);
  const maxMeanRank = Math.max(...active);
  return {
    regionCount: regionIds.length,
    minMeanRank: Math.round(minMeanRank * 1000) / 1000,
    maxMeanRank: Math.round(maxMeanRank * 1000) / 1000,
    tierSpread: Math.round((maxMeanRank - minMeanRank) * 1000) / 1000,
  };
}
