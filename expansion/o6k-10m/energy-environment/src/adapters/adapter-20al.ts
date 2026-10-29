import type { V1014EnergyDepthInputs, V1014EnergyDepthRegionId } from '../types';
import { V1014_ENERGY_DEPTH_REGIONS } from '../types';
import { V1014_ENERGY_DEPTH_clamp } from '../primitives';

/** Cross-wire SECTION 20AL industrial energy into depth inputs. */
export function V1014_ENERGY_DEPTH_adaptIndustrialEnergy(
  base: V1014EnergyDepthInputs,
  industrial: V1014EnergyDepthInputs['industrialEnergy'],
): V1014EnergyDepthInputs {
  return { ...base, industrialEnergy: industrial };
}

export function V1014_ENERGY_DEPTH_extractionPressureFromIndustrial(
  regionId: V1014EnergyDepthRegionId,
  industrial: V1014EnergyDepthInputs['industrialEnergy'],
): number {
  const rs = industrial?.regionalScores?.[regionId];
  if (!rs) return 25;
  const ext = rs.extractionScore ?? 30;
  const con = rs.constraintPressure ?? 0;
  return V1014_ENERGY_DEPTH_clamp(ext * 0.85 + con * 0.15, 0, 100);
}

export function V1014_ENERGY_DEPTH_renewableBoostFromIndustrial(
  industrial: V1014EnergyDepthInputs['industrialEnergy'],
): number {
  const share = industrial?.nationalRenewableShare ?? 0.2;
  return V1014_ENERGY_DEPTH_clamp(share, 0, 1);
}
