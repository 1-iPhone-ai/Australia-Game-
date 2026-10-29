import type { LivingRegionsWorldView, NrDashAuthSnapshot, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashRegionalOpenNeedsPeakSeveritySpread {
  regionalRegionCount: number;
  minPeakRank: number;
  maxPeakRank: number;
  peakSeveritySpread: number;
}

/** Spread of peak open-need severity ranks across non-you snapshot rows with open needs. */
export function nrDashBuildRegionalOpenNeedsPeakSeveritySpread(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashRegionalOpenNeedsPeakSeveritySpread | null {
  if (!lr?.state.regions || !snap?.regions.length) return null;
  const regional = snap.regions.filter(r => r.owner !== 'you' && r.openNeeds > 0);
  if (regional.length <= 1) return null;
  const peaks = regional.map(row => {
    const open = lr.state.regions[row.regionId]?.needs.filter(n => n.status === 'open') ?? [];
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const minPeakRank = Math.min(...peaks);
  const maxPeakRank = Math.max(...peaks);
  const peakSeveritySpread = maxPeakRank - minPeakRank;
  if (peakSeveritySpread <= 0) return null;
  return {
    regionalRegionCount: regional.length,
    minPeakRank,
    maxPeakRank,
    peakSeveritySpread,
  };
}
