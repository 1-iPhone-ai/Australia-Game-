import type { V1014EnergyDepthGridBand, V1014EnergyDepthInputs } from '../types';

/** Cross-wire SECTION 20Y — elevate energy domain exposure when grid is strained. */
export function V1014_ENERGY_DEPTH_adaptSystemicRiskEnergyExposure(
  systemic: V1014EnergyDepthInputs['systemicRisk'],
  gridBand: V1014EnergyDepthGridBand,
): number {
  const base = systemic?.domains?.energy?.exposure ?? 20;
  const bump: Record<V1014EnergyDepthGridBand, number> = {
    secure: 0,
    comfortable: 2,
    strained: 8,
    critical: 18,
    blackout_risk: 28,
  };
  return Math.min(100, base + bump[gridBand]);
}

export function V1014_ENERGY_DEPTH_systemicRiskBandFromExposure(exposure: number): string {
  if (exposure >= 75) return 'critical';
  if (exposure >= 55) return 'fragile';
  if (exposure >= 35) return 'exposed';
  return 'stable';
}
