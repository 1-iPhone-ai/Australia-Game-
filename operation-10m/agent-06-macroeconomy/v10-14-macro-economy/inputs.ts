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
    modesScenarios: params?.modesScenarios ?? params?.gameState?.modesScenariosState ?? params?.nationalSystems?.modes,
    gameModes: params?.gameModes,
    scenarioRuntime: params?.scenarioRuntime ?? params?.gameState?.scenarioRuntime,
    guardianCopilot: params?.guardianCopilot ?? params?.guardian ?? params?.gameState?.guardianState,
    guardian: params?.guardian,
    coPilotWarnings: params?.coPilotWarnings,
    citiesRegions: params?.citiesRegions ?? params?.gameState?.citiesRegionsState ?? params?.nationalSystems?.cities,
    urbanRegions: params?.urbanRegions,
    metropolitanSystems: params?.metropolitanSystems,
    forecastingLab: params?.forecastingLab ?? params?.gameState?.forecastingLabState,
    macroForecasts: params?.macroForecasts,
    nationalForecasts: params?.nationalForecasts ?? params?.nationalSystems?.forecasting,
    commandCenter: params?.commandCenter ?? params?.gameState?.commandCenterState ?? params?.nationalSystems?.commandCenter,
    nationalCommand: params?.nationalCommand,
    aiCommandCenter: params?.aiCommandCenter,
    idleAutomation: params?.idleAutomation ?? params?.gameState?.automationState,
    automation: params?.automation,
    nationalAutomation: params?.nationalAutomation ?? params?.nationalSystems?.automation,
    teamIntelligence: params?.teamIntelligence ?? params?.gameState?.teamAiState ?? params?.nationalSystems?.teamAi,
    teamAi: params?.teamAi,
    nationalTeamAi: params?.nationalTeamAi,
    historyReplay: params?.historyReplay ?? params?.gameState?.historyReplayState,
    replayArchive: params?.replayArchive,
    nationalHistory: params?.nationalHistory ?? params?.nationalSystems?.historyReplay,
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
