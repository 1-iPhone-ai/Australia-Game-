import type { V1014EnergyDepthRegionId } from './types';
import { V1014_ENERGY_DEPTH_INDUSTRY_COUPLING_MATRIX } from './catalog/industry-coupling-matrix';

export function V1014_ENERGY_DEPTH_couplingRowsForRegion(
  regionId: V1014EnergyDepthRegionId,
): typeof V1014_ENERGY_DEPTH_INDUSTRY_COUPLING_MATRIX {
  return V1014_ENERGY_DEPTH_INDUSTRY_COUPLING_MATRIX.filter(r => r.regionId === regionId);
}

export function V1014_ENERGY_DEPTH_aggregateCouplingElasticity(
  regionId: V1014EnergyDepthRegionId,
  industry: string,
): number {
  const rows = V1014_ENERGY_DEPTH_couplingRowsForRegion(regionId).filter(r => r.industry === industry);
  if (rows.length === 0) return 0.2;
  return rows.reduce((s, r) => s + r.elasticity, 0) / rows.length;
}

export function V1014_ENERGY_DEPTH_couplingCarbonWeight(
  regionId: V1014EnergyDepthRegionId,
  scenarioId: string,
): number {
  const row = V1014_ENERGY_DEPTH_INDUSTRY_COUPLING_MATRIX.find(
    r => r.regionId === regionId && r.scenarioId === scenarioId,
  );
  return row?.carbonWeight ?? 0.15;
}

export function V1014_ENERGY_DEPTH_crossRef20TLabel(regionId: V1014EnergyDepthRegionId): string[] {
  return [...new Set(V1014_ENERGY_DEPTH_couplingRowsForRegion(regionId).map(r => r.crossRef20T))];
}
