import type { LaborDemographicsInputs } from './types';

export function buildLaborDemographicsInputs(params: {
  turn: number;
  gameState?: any;
  gameSettings?: any;
  industries?: any;
  workforce?: any;
  households?: any;
  livingRegions?: any;
  economicGeography?: any;
  capabilities?: LaborDemographicsInputs['capabilities'];
}): LaborDemographicsInputs {
  const turn = Math.max(1, Math.floor(params.turn || 1));
  const gset = params.gameSettings || {};
  const enabled =
    gset.laborDemographicsEnabled !== false &&
    gset.nationalSystemsEnabled !== false &&
    gset.industriesEnabled !== false;
  return {
    turn,
    enabled,
    industries: params.industries || params.gameState?.industriesSupplyChainsState || null,
    workforce: params.workforce || params.gameState?.workforceState || null,
    households: params.households || params.gameState?.householdEconomyState || null,
    livingRegions: params.livingRegions || null,
    economicGeography: params.economicGeography || null,
    capabilities: params.capabilities || params.gameState?.capabilities || null
  };
}
