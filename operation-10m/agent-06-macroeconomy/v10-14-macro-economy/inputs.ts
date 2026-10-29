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
    aiMemory: params?.aiMemory ?? params?.explainability ?? params?.nationalAiMemory,
    dashboardsMaps: params?.dashboardsMaps ?? params?.nationalDashboards ?? params?.mapsTelemetry,
    gameUi: params?.gameUi ?? params?.uiShell ?? params?.gameState?.uiState ?? params?.nationalSystems?.ui,
    uiShell: params?.uiShell,
    nationalUi: params?.nationalUi,
    utilitiesGrid:
      params?.utilitiesGrid ??
      params?.publicUtilities ??
      params?.gameState?.utilitiesState ??
      params?.nationalSystems?.utilities,
    publicUtilities: params?.publicUtilities,
    nationalUtilities: params?.nationalUtilities,
    negotiationState:
      params?.negotiationState ??
      params?.diplomacy ??
      params?.gameState?.negotiationState ??
      params?.nationalSystems?.negotiation,
    diplomacy: params?.diplomacy,
    consumerConfidence: params?.consumerConfidence ?? params?.households?.consumerConfidence,
    privateCapex: params?.privateCapex ?? params?.companies?.capexCycle ?? params?.privateSector?.capitalExpenditure,
    rentalMarket: params?.rentalMarket ?? params?.housingWellbeing?.rental ?? params?.housing?.rentalMarket,
    climatePolicy:
      params?.climatePolicy ??
      params?.energyEnvironment?.climatePolicy ??
      params?.industrialEnergy?.climate ??
      params?.nationalSystems?.climatePolicy,
    uiAccessibility:
      params?.uiAccessibility ??
      params?.gameUi?.accessibility ??
      params?.uiShell?.accessibility ??
      params?.nationalUi?.accessibility,
    historyTimeline:
      params?.historyTimeline ??
      params?.historyReplay?.timeline ??
      params?.replayArchive?.timeline ??
      params?.nationalHistory?.timeline,
    systemLiquidity:
      params?.systemLiquidity ??
      params?.creditMarkets?.liquidity ??
      params?.monetaryPolicy?.liquidity ??
      params?.nationalFinance?.liquidity,
    strategicGameplay:
      params?.strategicGameplay ??
      params?.strategicCapital?.gameplayCadence ??
      params?.nationalStrategic?.gameplay,
    historyArchiveIntegrity:
      params?.historyArchiveIntegrity ??
      params?.replayArchive?.integrity ??
      params?.historyReplay?.archive ??
      params?.nationalHistory?.archive,
    nationalStrategic: params?.nationalStrategic,
    integrationHealth:
      params?.integrationHealth ??
      params?.op10mIntegration?.health ??
      params?.nationalSystems?.integrationHealth ??
      params?.assemblyHealth,
    op10mIntegration: params?.op10mIntegration,
    assemblyHealth: params?.assemblyHealth,
    turnCadenceDrift:
      params?.turnCadenceDrift ??
      params?.turnsTime?.cadenceDrift ??
      params?.temporalCadence?.drift ??
      params?.gameClock?.cadence,
    researchMomentum:
      params?.researchMomentum ??
      params?.researchTech?.momentum ??
      params?.nationalResearch?.momentum,
    budgetOutlook:
      params?.budgetOutlook ??
      params?.publicFinance?.outlook ??
      params?.publicFinance?.budgetOutlook ??
      params?.nationalFinance?.budgetOutlook,
    modeShift:
      params?.modeShift ??
      params?.modesScenarios?.shift ??
      params?.scenarioRuntime?.modeShift ??
      params?.gameModes?.shift,
    supplyChainStress:
      params?.supplyChainStress ??
      params?.companies?.supplyChain ??
      params?.privateSector?.supplyChain,
    eventCascade:
      params?.eventCascade ??
      params?.dynamicEvents?.cascade ??
      params?.op10mEvents?.cascade ??
      params?.narrativeEvents?.cascade,
    demographicShift:
      params?.demographicShift ??
      params?.population?.shift ??
      params?.demographics?.shift ??
      params?.nationalPopulation?.shift,
    inflationExpectationsAnchor:
      params?.inflationExpectationsAnchor ??
      params?.nationalFinance?.expectationsAnchor ??
      params?.monetaryPolicy?.expectationsAnchor,
    metroMomentum:
      params?.metroMomentum ??
      params?.citiesRegions?.momentum ??
      params?.metropolitanSystems?.growthMomentum ??
      params?.urbanRegions?.momentum,
    transportThroughput:
      params?.transportThroughput ??
      params?.transportInfrastructure?.throughput ??
      params?.infrastructure?.freightThroughput ??
      params?.nationalInfrastructure?.throughput,
    energyTransitionPace:
      params?.energyTransitionPace ??
      params?.industrialEnergy?.transitionPace ??
      params?.energyEnvironment?.transition ??
      params?.climatePolicy?.transitionPace,
    housingAffordability:
      params?.housingAffordability ??
      params?.housingWellbeing?.affordability ??
      params?.housing?.affordability ??
      params?.rentalMarket?.affordability,
    tradeExposure:
      params?.tradeExposure ??
      params?.trade?.exposure ??
      params?.trade?.externalExposure ??
      params?.nationalSystems?.tradeExposure,
    guardianVigilance:
      params?.guardianVigilance ??
      params?.guardianCopilot?.vigilance ??
      params?.guardian?.riskVigilance ??
      params?.coPilotWarnings?.vigilance,
    commandCoordination:
      params?.commandCoordination ??
      params?.commandCenter?.coordination ??
      params?.nationalCommand?.coordination ??
      params?.aiCommandCenter?.coordination,
    teamAiCohesion:
      params?.teamAiCohesion ??
      params?.teamIntelligence?.cohesion ??
      params?.teamAi?.cohesion ??
      params?.nationalTeamAi?.cohesion,
    memoryRetention:
      params?.memoryRetention ??
      params?.aiMemory?.retention ??
      params?.explainability?.retention ??
      params?.nationalAiMemory?.retention,
    automationThroughput:
      params?.automationThroughput ??
      params?.idleAutomation?.throughput ??
      params?.automation?.throughput ??
      params?.nationalAutomation?.throughput,
    forecastCalibration:
      params?.forecastCalibration ??
      params?.forecastingLab?.calibration ??
      params?.macroForecasts?.calibration ??
      params?.nationalForecasts?.calibration,
    automationIdleGovernance:
      params?.automationIdleGovernance ??
      params?.idleAutomation?.governance ??
      params?.automation?.idleGovernance ??
      params?.nationalAutomation?.idleGovernance,
    forecastProjectionSync:
      params?.forecastProjectionSync ??
      params?.forecastingLab?.projectionSync ??
      params?.macroForecasts?.projectionSync ??
      params?.nationalForecasts?.wave35Sync,
    automationIdleGovernanceWave36Export:
      params?.automationIdleGovernanceWave36Export ??
      params?.idleAutomation?.governanceWave36Export ??
      params?.automation?.idleGovernanceWave36Export ??
      params?.nationalAutomation?.idleGovernanceWave36Export,
    forecastWave36ProjectionSync:
      params?.forecastWave36ProjectionSync ??
      params?.forecastingLab?.wave36ProjectionSync ??
      params?.macroForecasts?.wave36ProjectionSync ??
      params?.nationalForecasts?.wave36Sync,
    uiResponsivenessWave37Export:
      params?.uiResponsivenessWave37Export ??
      params?.uiResponsiveness?.wave37Export ??
      params?.gameUi?.responsivenessWave37Export ??
      params?.nationalUi?.responsivenessWave37Export,
    dashboardClarityWave37Export:
      params?.dashboardClarityWave37Export ??
      params?.dashboardClarity?.wave37Export ??
      params?.dashboards?.clarityWave37Export ??
      params?.nationalDashboards?.clarityWave37Export,
    replayWave38Export:
      params?.replayWave38Export ??
      params?.historyReplay?.wave38Export ??
      params?.replay?.wave38Export ??
      params?.nationalHistory?.replayWave38Export,
    integrationHealthWave38Export:
      params?.integrationHealthWave38Export ??
      params?.integrationHealth?.wave38Export ??
      params?.assembly?.integrationHealthWave38Export ??
      params?.nationalIntegration?.healthWave38Export,
    automationIdleGovernanceWave39Export:
      params?.automationIdleGovernanceWave39Export ??
      params?.automationIdleGovernance?.wave39Export ??
      params?.idleAutomation?.governanceWave39Export ??
      params?.automation?.idleGovernanceWave39Export,
    forecastWave39Export:
      params?.forecastWave39Export ??
      params?.forecastingLab?.wave39Export ??
      params?.macroForecasts?.wave39Export ??
      params?.nationalForecasts?.wave39Sync,
    uiResponsivenessWave40Export:
      params?.uiResponsivenessWave40Export ??
      params?.uiResponsiveness?.wave40Export ??
      params?.gameUi?.responsivenessWave40Export ??
      params?.nationalUi?.responsivenessWave40Export,
    dashboardClarityWave40Export:
      params?.dashboardClarityWave40Export ??
      params?.dashboardClarity?.wave40Export ??
      params?.dashboards?.clarityWave40Export ??
      params?.nationalDashboards?.clarityWave40Export,
    replayWave41Export:
      params?.replayWave41Export ??
      params?.historyReplay?.wave41Export ??
      params?.replay?.wave41Export ??
      params?.nationalHistory?.replayWave41Export,
    integrationHealthWave41Export:
      params?.integrationHealthWave41Export ??
      params?.integrationHealth?.wave41Export ??
      params?.assembly?.integrationHealthWave41Export ??
      params?.nationalIntegration?.healthWave41Export,
    automationIdleGovernanceWave42Export:
      params?.automationIdleGovernanceWave42Export ??
      params?.automationIdleGovernance?.wave42Export ??
      params?.idleAutomation?.governanceWave42Export ??
      params?.automation?.idleGovernanceWave42Export,
    forecastWave42Export:
      params?.forecastWave42Export ??
      params?.forecastingLab?.wave42Export ??
      params?.macroForecasts?.wave42Export ??
      params?.nationalForecasts?.wave42Sync,
    uiResponsivenessWave43Export:
      params?.uiResponsivenessWave43Export ??
      params?.uiResponsiveness?.wave43Export ??
      params?.gameUi?.responsivenessWave43Export ??
      params?.nationalUi?.responsivenessWave43Export,
    dashboardClarityWave43Export:
      params?.dashboardClarityWave43Export ??
      params?.dashboardClarity?.wave43Export ??
      params?.dashboards?.clarityWave43Export ??
      params?.nationalDashboards?.clarityWave43Export,
    automationIdleGovernanceWave44Export:
      params?.automationIdleGovernanceWave44Export ??
      params?.automationIdleGovernance?.wave44Export ??
      params?.idleAutomation?.governanceWave44Export ??
      params?.automation?.idleGovernanceWave44Export,
    forecastWave44Export:
      params?.forecastWave44Export ??
      params?.forecastingLab?.wave44Export ??
      params?.macroForecasts?.wave44Export ??
      params?.nationalForecasts?.wave44Sync,
    replayWave45Export:
      params?.replayWave45Export ??
      params?.historyReplay?.wave45Export ??
      params?.replay?.wave45Export ??
      params?.nationalHistory?.replayWave45Export,
    integrationHealthWave45Export:
      params?.integrationHealthWave45Export ??
      params?.integrationHealth?.wave45Export ??
      params?.assembly?.integrationHealthWave45Export ??
      params?.nationalIntegration?.healthWave45Export,
    uiResponsivenessWave46Export:
      params?.uiResponsivenessWave46Export ??
      params?.uiResponsiveness?.wave46Export ??
      params?.gameUi?.responsivenessWave46Export ??
      params?.nationalUi?.responsivenessWave46Export,
    dashboardClarityWave46Export:
      params?.dashboardClarityWave46Export ??
      params?.dashboardClarity?.wave46Export ??
      params?.dashboards?.clarityWave46Export ??
      params?.nationalDashboards?.clarityWave46Export,
    replayWave47Export:
      params?.replayWave47Export ??
      params?.historyReplay?.wave47Export ??
      params?.replay?.wave47Export ??
      params?.nationalHistory?.replayWave47Export,
    integrationHealthWave47Export:
      params?.integrationHealthWave47Export ??
      params?.integrationHealth?.wave47Export ??
      params?.assembly?.integrationHealthWave47Export ??
      params?.nationalIntegration?.healthWave47Export,
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
