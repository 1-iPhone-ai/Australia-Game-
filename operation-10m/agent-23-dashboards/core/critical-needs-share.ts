import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashCriticalNeedsShare {
  openNeedCount: number;
  criticalCount: number;
  criticalShare: number;
}

/** Share of open LR needs marked critical severity (authoritative needs list). */
export function nrDashBuildCriticalNeedsShare(
  lr: LivingRegionsWorldView | null
): NrDashCriticalNeedsShare | null {
  if (!lr?.state.regions) return null;
  let openNeedCount = 0;
  let criticalCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs.forEach(n => {
      if (n.status !== 'open') return;
      openNeedCount += 1;
      if (n.severity === 'critical') criticalCount += 1;
    });
  });
  if (openNeedCount <= 0) return null;
  return {
    openNeedCount,
    criticalCount,
    criticalShare: Math.round((criticalCount / openNeedCount) * 1000) / 1000,
  };
}
