import type { LivingRegionsWorldView, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashNationalSeverityPeakConcentration {
  regionCount: number;
  peakSeverityTotal: number;
  concentrationIndex: number;
}

/** National Herfindahl concentration of regional peak open-need severity ordinals. */
export function nrDashBuildNationalSeverityPeakConcentration(
  lr: LivingRegionsWorldView | null
): NrDashNationalSeverityPeakConcentration | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const peaks = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const peakSeverityTotal = peaks.reduce((s, n) => s + n, 0);
  if (peakSeverityTotal <= 0) return null;
  const contributing = peaks.filter(p => p > 0).length;
  if (contributing <= 1) return null;
  let concentrationIndex = 0;
  peaks.forEach(peak => {
    if (peak <= 0) return;
    const share = peak / peakSeverityTotal;
    concentrationIndex += share * share;
  });
  return {
    regionCount: regionIds.length,
    peakSeverityTotal,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
