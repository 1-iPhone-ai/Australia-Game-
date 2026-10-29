import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashLowNeedsShare {
  openNeedCount: number;
  lowCount: number;
  lowShare: number;
}

/** Share of open LR needs marked low severity (authoritative needs list). */
export function nrDashBuildLowNeedsShare(
  lr: LivingRegionsWorldView | null
): NrDashLowNeedsShare | null {
  if (!lr?.state.regions) return null;
  let openNeedCount = 0;
  let lowCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs.forEach(n => {
      if (n.status !== 'open') return;
      openNeedCount += 1;
      if (n.severity === 'low') lowCount += 1;
    });
  });
  if (openNeedCount <= 0) return null;
  return {
    openNeedCount,
    lowCount,
    lowShare: Math.round((lowCount / openNeedCount) * 1000) / 1000,
  };
}
