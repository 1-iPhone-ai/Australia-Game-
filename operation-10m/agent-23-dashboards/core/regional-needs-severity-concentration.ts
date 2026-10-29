import type { LivingRegionsWorldView, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashRegionalNeedsSeverityConcentration {
  regionCount: number;
  weightedSeverityTotal: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of peak open-need severity weights across regions. */
export function nrDashBuildRegionalNeedsSeverityConcentration(
  lr: LivingRegionsWorldView | null
): NrDashRegionalNeedsSeverityConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const weights = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity])) + 1;
  });
  const weightedSeverityTotal = weights.reduce((s, n) => s + n, 0);
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
    regionCount: regionIds.length,
    weightedSeverityTotal,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
