import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashLowRiskShare {
  riskCount: number;
  lowCount: number;
  lowShare: number;
}

/** Share of LR regional risks marked low severity (authoritative risks list). */
export function nrDashBuildLowRiskShare(lr: LivingRegionsWorldView | null): NrDashLowRiskShare | null {
  if (!lr?.state.regions) return null;
  let riskCount = 0;
  let lowCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.risks.forEach(r => {
      riskCount += 1;
      if (r.severity === 'low') lowCount += 1;
    });
  });
  if (riskCount <= 0) return null;
  return {
    riskCount,
    lowCount,
    lowShare: Math.round((lowCount / riskCount) * 1000) / 1000,
  };
}
