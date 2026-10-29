import type { LivingRegionsWorldView, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashRegionalSeverityPeakConcentration {
  regionCount: number;
  weightedPeakTotal: number;
  concentrationIndex: number;
}

/** Herfindahl concentration of regional peak severity weighted by open-need counts. */
export function nrDashBuildRegionalSeverityPeakConcentration(
  lr: LivingRegionsWorldView | null
): NrDashRegionalSeverityPeakConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const weights = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return 0;
    const peak = Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
    return peak * open.length;
  });
  const weightedPeakTotal = weights.reduce((s, w) => s + w, 0);
  if (weightedPeakTotal <= 0) return null;
  const contributing = weights.filter(w => w > 0).length;
  if (contributing <= 1) return null;
  let concentrationIndex = 0;
  weights.forEach(weight => {
    if (weight <= 0) return;
    const share = weight / weightedPeakTotal;
    concentrationIndex += share * share;
  });
  return {
    regionCount: regionIds.length,
    weightedPeakTotal,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
