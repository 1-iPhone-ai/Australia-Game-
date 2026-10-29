import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashModerateRiskShare {
  riskCount: number;
  moderateCount: number;
  moderateShare: number;
}

/** Share of LR regional risks marked moderate severity (authoritative risks list). */
export function nrDashBuildModerateRiskShare(
  lr: LivingRegionsWorldView | null
): NrDashModerateRiskShare | null {
  if (!lr?.state.regions) return null;
  let riskCount = 0;
  let moderateCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.risks.forEach(r => {
      riskCount += 1;
      if (r.severity === 'moderate') moderateCount += 1;
    });
  });
  if (riskCount <= 0) return null;
  return {
    riskCount,
    moderateCount,
    moderateShare: Math.round((moderateCount / riskCount) * 1000) / 1000,
  };
}
