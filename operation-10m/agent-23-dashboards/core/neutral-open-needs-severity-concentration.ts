import type { LivingRegionsWorldView, NrDashAuthSnapshot, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashNeutralOpenNeedsSeverityConcentration {
  neutralRegionCount: number;
  weightedSeverityTotal: number;
  concentrationIndex: number;
}

/** Herfindahl concentration of mean open-need severity on neutral-owned snapshot rows. */
export function nrDashBuildNeutralOpenNeedsSeverityConcentration(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashNeutralOpenNeedsSeverityConcentration | null {
  if (!lr?.state.regions || !snap?.regions.length) return null;
  const neutral = snap.regions.filter(r => r.owner === 'neutral');
  if (neutral.length <= 1) return null;
  const weights = neutral.map(row => {
    const open = lr.state.regions[row.regionId]?.needs.filter(n => n.status === 'open') ?? [];
    if (!open.length || row.openNeeds <= 0) return 0;
    const meanRank = open.reduce((s, n) => s + SEVERITY_ORD[n.severity], 0) / open.length;
    return meanRank * row.openNeeds;
  });
  const weightedSeverityTotal = weights.reduce((s, w) => s + w, 0);
  if (weightedSeverityTotal <= 0) return null;
  const contributing = weights.filter(w => w > 0).length;
  if (contributing <= 1) return null;
  let concentrationIndex = 0;
  weights.forEach(weight => {
    if (weight <= 0) return;
    const share = weight / weightedSeverityTotal;
    concentrationIndex += share * share;
  });
  return {
    neutralRegionCount: neutral.length,
    weightedSeverityTotal: Math.round(weightedSeverityTotal * 1000) / 1000,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
