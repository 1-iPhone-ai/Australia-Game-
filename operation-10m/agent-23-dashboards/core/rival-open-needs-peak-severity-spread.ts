import type { LivingRegionsWorldView, NrDashAuthSnapshot, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashRivalOpenNeedsPeakSeveritySpread {
  rivalRegionCount: number;
  minPeakRank: number;
  maxPeakRank: number;
  peakSeveritySpread: number;
}

/** Spread of peak open-need severity ranks across rival-owned snapshot rows. */
export function nrDashBuildRivalOpenNeedsPeakSeveritySpread(
  lr: LivingRegionsWorldView | null,
  snap: NrDashAuthSnapshot | null
): NrDashRivalOpenNeedsPeakSeveritySpread | null {
  if (!lr?.state.regions || !snap?.regions.length) return null;
  const rival = snap.regions.filter(r => r.owner === 'rival' && r.openNeeds > 0);
  if (rival.length <= 1) return null;
  const peaks = rival.map(row => {
    const open = lr.state.regions[row.regionId]?.needs.filter(n => n.status === 'open') ?? [];
    if (!open.length) return 0;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const minPeakRank = Math.min(...peaks);
  const maxPeakRank = Math.max(...peaks);
  const peakSeveritySpread = maxPeakRank - minPeakRank;
  if (peakSeveritySpread <= 0) return null;
  return {
    rivalRegionCount: rival.length,
    minPeakRank,
    maxPeakRank,
    peakSeveritySpread,
  };
}
