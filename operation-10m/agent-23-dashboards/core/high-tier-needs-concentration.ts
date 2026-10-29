import type { LivingRegionsWorldView } from '../types.ts';

export interface NrDashHighTierNeedsConcentration {
  highTierOpenCount: number;
  activeHighTierSlots: number;
  concentrationIndex: number;
}

/** Herfindahl-style concentration of open LR needs at high and critical severity. */
export function nrDashBuildHighTierNeedsConcentration(
  lr: LivingRegionsWorldView | null
): NrDashHighTierNeedsConcentration | null {
  if (!lr?.state.regions) return null;
  let highCount = 0;
  let criticalCount = 0;
  Object.values(lr.state.regions).forEach(reg => {
    reg.needs
      .filter(n => n.status === 'open')
      .forEach(n => {
        if (n.severity === 'high') highCount += 1;
        if (n.severity === 'critical') criticalCount += 1;
      });
  });
  const highTierOpenCount = highCount + criticalCount;
  if (highTierOpenCount <= 0) return null;
  const slots = [highCount, criticalCount].filter(c => c > 0);
  if (slots.length <= 1) return null;
  let concentrationIndex = 0;
  if (highCount > 0) {
    const share = highCount / highTierOpenCount;
    concentrationIndex += share * share;
  }
  if (criticalCount > 0) {
    const share = criticalCount / highTierOpenCount;
    concentrationIndex += share * share;
  }
  return {
    highTierOpenCount,
    activeHighTierSlots: slots.length,
    concentrationIndex: Math.round(concentrationIndex * 1000) / 1000,
  };
}
