import { V1014_MACRO_CORE_REGIONS } from './constants.ts';
import type { MacroEconomyInputs } from './types.ts';

export function buildMacroEconomyInputs(params: any): MacroEconomyInputs {
  const turn = Math.max(1, Math.floor(Number(params?.turn) || 1));
  const gset = params?.gameSettings || {};
  return {
    turn,
    enabled: gset.macroEconomyEnabled !== false && gset.nationalSystemsEnabled !== false,
    livingRegions: params?.livingRegions ?? params?.gameState?.livingRegionsState,
    nationalSystems: params?.nationalSystems,
    industries: params?.industries,
    innovation: params?.innovation,
    workforce: params?.workforce,
    strategicCapital: params?.strategicCapital,
    housingWellbeing: params?.housingWellbeing ?? params?.housing,
    housing: params?.housing,
    publicFinance: params?.publicFinance,
    households: params?.households,
    trade: params?.trade ?? params?.gameState?.tradeState,
    economicGeography: params?.economicGeography,
    creditMarkets: params?.creditMarkets ?? params?.gameState?.creditMarketsState,
    monetaryPolicy: params?.monetaryPolicy,
    nationalFinance: params?.nationalFinance,
    industrialEnergy: params?.industrialEnergy ?? params?.energyEnvironment ?? params?.nationalSystems?.industrialEnergy,
    energyEnvironment: params?.energyEnvironment,
    dynamicEvents: params?.dynamicEvents ?? params?.gameState?.dynamicEventsState ?? params?.nationalSystems?.dynamicEvents,
    narrativeEvents: params?.narrativeEvents ?? params?.gameState?.narrativeEventsState,
    op10mEvents: params?.op10mEvents ?? params?.gameState?.op10mEventsState,
    companies: params?.companies ?? params?.privateSector,
    privateSector: params?.privateSector ?? params?.nationalPrivateSector,
    nationalPrivateSector: params?.nationalPrivateSector ?? params?.gameState?.privateSectorState,
    turnsTime: params?.turnsTime ?? params?.gameState?.turnsTimeState ?? params?.nationalSystems?.turnsTime,
    temporalCadence: params?.temporalCadence,
    gameClock: params?.gameClock ?? params?.gameState?.gameClock,
    transportInfrastructure:
      params?.transportInfrastructure ??
      params?.infrastructure ??
      params?.gameState?.transportInfrastructureState,
    infrastructure: params?.infrastructure,
    nationalInfrastructure: params?.nationalInfrastructure ?? params?.nationalSystems?.infrastructure,
    researchTech: params?.researchTech ?? params?.gameState?.researchTechState ?? params?.nationalSystems?.researchTech,
    research: params?.research,
    nationalResearch: params?.nationalResearch,
    population: params?.population ?? params?.gameState?.populationState ?? params?.nationalSystems?.population,
    demographics: params?.demographics,
    nationalPopulation: params?.nationalPopulation,
    highInflationScenarioActive: Boolean(params?.highInflationScenarioActive || gset.selectedScenarioId === 'high_inflation'),
    creditShockActive: Boolean(params?.creditShockActive)
  };
}

export function makeDefaultV1014_MACRO_TestInputs(overrides: Partial<MacroEconomyInputs> = {}): MacroEconomyInputs {
  return {
    turn: 5,
    enabled: true,
    livingRegions: {
      regions: Object.fromEntries(
        V1014_MACRO_CORE_REGIONS.map(c => [
          c,
          {
            economy: { score: 55, band: 'moderate' },
            momentum: { band: 'stable' },
            development: { score: 50 }
          }
        ])
      )
    },
    ...overrides
  };
}
