import type { LivingRegionsWorldView, RegionalNeed } from '../types.ts';

const SEVERITY_ORD: Record<RegionalNeed['severity'], number> = {
  low: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

export interface NrDashOpenNeedsSeveritySpan {
  regionCount: number;
  minSeverityRank: number;
  maxSeverityRank: number;
  severitySpread: number;
}

/** Spread of peak open-need severity ranks across LR regions. */
export function nrDashBuildOpenNeedsSeveritySpan(
  lr: LivingRegionsWorldView | null
): NrDashOpenNeedsSeveritySpan | null {
  if (!lr?.state.regions) return null;
  const regionIds = Object.keys(lr.state.regions);
  const peakRanks = regionIds.map(id => {
    const open = lr.state.regions[id]!.needs.filter(n => n.status === 'open');
    if (!open.length) return null;
    return Math.max(...open.map(n => SEVERITY_ORD[n.severity]));
  });
  const active = peakRanks.filter((r): r is number => r != null);
  if (!active.length) return null;
  const minSeverityRank = Math.min(...active);
  const maxSeverityRank = Math.max(...active);
  return {
    regionCount: regionIds.length,
    minSeverityRank,
    maxSeverityRank,
    severitySpread: maxSeverityRank - minSeverityRank,
  };
}
