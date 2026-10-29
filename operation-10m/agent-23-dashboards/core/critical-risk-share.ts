import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashCriticalRiskShare {
  riskCount: number;
  criticalCount: number;
  criticalShare: number;
}

/** Share of LR regional risks marked critical severity (authoritative risks list). */
export function nrDashBuildCriticalRiskShare(
  lr: LivingRegionsWorldView | null
): NrDashCriticalRiskShare | null {
  if (!lr?.state.regions) return null;
  let riskCount = 0;
  let criticalCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.risks.forEach(r => {
      riskCount += 1;
      if (r.severity === 'critical') criticalCount += 1;
    });
  });
  if (riskCount <= 0) return null;
  return {
    riskCount,
    criticalCount,
    criticalShare: Math.round((criticalCount / riskCount) * 1000) / 1000,
  };
}
