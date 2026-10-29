import type { LivingRegionsWorldView, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashRegionalPeakSeveritySpread {
  regionCount: number;
  minPeakRank: number;
  maxPeakRank: number;
  peakSpread: number;
}

/** Spread of per-region peak open-need severity ordinals across LR regions. */
export function nrDashBuildRegionalPeakSeveritySpread(
  lr: LivingRegionsWorldView | null
): NrDashRegionalPeakSeveritySpread | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const peaks = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const contributing = peaks.filter(p => p > 0);
  if (contributing.length <= 1) return null;
  const minPeakRank = Math.min(...contributing);
  const maxPeakRank = Math.max(...contributing);
  const peakSpread = maxPeakRank - minPeakRank;
  if (peakSpread <= 0) return null;
  return {
    regionCount: regionIds.length,
    minPeakRank,
    maxPeakRank,
    peakSpread: Math.round(peakSpread * 1000) / 1000,
  };
}
