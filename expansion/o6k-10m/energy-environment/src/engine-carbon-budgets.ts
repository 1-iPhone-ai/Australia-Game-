import type { V1014EnergyDepthCarbonBand, V1014EnergyDepthRegionId } from './types';
import { V1014_ENERGY_DEPTH_bandCarbon, V1014_ENERGY_DEPTH_clamp } from './primitives';
import { V1014_ENERGY_DEPTH_EMISSIONS_FACTORS } from './catalog/emissions-factors';
import { V1014_ENERGY_DEPTH_CARBON_BUDGETS } from './catalog/carbon-budgets';

export function V1014_ENERGY_DEPTH_emissionsFactorForSector(sector: string, scope = 'national'): number {
  const row =
    V1014_ENERGY_DEPTH_EMISSIONS_FACTORS.find(e => e.sector === sector && e.scope === scope) ??
    V1014_ENERGY_DEPTH_EMISSIONS_FACTORS.find(e => e.sector === sector);
  return row?.kgCo2ePerMwh ?? 0.35;
}

export function V1014_ENERGY_DEPTH_selectCarbonPathway(pathwayId: string) {
  return (
    V1014_ENERGY_DEPTH_CARBON_BUDGETS.find(b => b.id === pathwayId) ??
    V1014_ENERGY_DEPTH_CARBON_BUDGETS.find(b => b.scope === 'national') ??
    V1014_ENERGY_DEPTH_CARBON_BUDGETS[0]
  );
}

export function V1014_ENERGY_DEPTH_rollForwardCarbon(
  pathwayId: string,
  cumulativeMt: number,
  regionalEmissions: Partial<Record<V1014EnergyDepthRegionId, number>>,
  turnDelta = 1,
): { cumulativeMt: number; band: V1014EnergyDepthCarbonBand; nationalBudgetMt: number } {
  const pathway = V1014_ENERGY_DEPTH_selectCarbonPathway(pathwayId);
  const budget = pathway.cumulativeBudgetMtCO2e;
  let add = 0;
  for (const [rid, mt] of Object.entries(regionalEmissions)) {
    const weight = pathway.sectorWeights[rid] ?? pathway.sectorWeights.energy ?? 0.2;
    add += (mt ?? 0) * weight;
  }
  const nationalRate = pathway.annualBudgetMtCO2e / 365;
  const next = cumulativeMt + add + nationalRate * turnDelta * 0.01;
  const band = V1014_ENERGY_DEPTH_bandCarbon(next, budget);
  return {
    cumulativeMt: V1014_ENERGY_DEPTH_clamp(next, 0, budget * 1.5),
    band,
    nationalBudgetMt: budget,
  };
}

export function V1014_ENERGY_DEPTH_regionalEmissionIncrement(
  regionId: V1014EnergyDepthRegionId,
  loadMw: number,
  extractionPressure: number,
  renewableShare: number,
): number {
  const fossilIntensity = (1 - renewableShare) * V1014_ENERGY_DEPTH_emissionsFactorForSector('grid_mix') * 0.0012;
  const extraction = extractionPressure * 0.00008;
  return (loadMw * fossilIntensity + extraction) * 0.001;
}
