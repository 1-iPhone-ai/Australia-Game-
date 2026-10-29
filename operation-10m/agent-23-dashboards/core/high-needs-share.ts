import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashHighNeedsShare {
  openNeedCount: number;
  highCount: number;
  highShare: number;
}

/** Share of open LR needs marked high severity (authoritative needs list). */
export function nrDashBuildHighNeedsShare(
  lr: LivingRegionsWorldView | null
): NrDashHighNeedsShare | null {
  if (!lr?.state.regions) return null;
  let openNeedCount = 0;
  let highCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs.forEach(n => {
      if (n.status !== 'open') return;
      openNeedCount += 1;
      if (n.severity === 'high') highCount += 1;
    });
  });
  if (openNeedCount <= 0) return null;
  return {
    openNeedCount,
    highCount,
    highShare: Math.round((highCount / openNeedCount) * 1000) / 1000,
  };
}
