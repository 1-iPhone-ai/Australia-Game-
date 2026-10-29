import { buildNationalAccountingLedger } from './accounting/ledger.ts';
import { applyMacroFiscalSpillover, readMacroFiscalSpilloverFromV1012 } from './bridge-v1012-fiscal.ts';
import { applyMacroHouseholdSpillover, readMacroHouseholdSpilloverFromV1013 } from './bridge-v1013-households.ts';
import { applyMacroIndustrySpillover, readMacroIndustrySpilloverFromV101 } from './bridge-v101-industries.ts';
import { applyMacroTradeSpillover, readMacroTradeSpilloverFromV1015 } from './bridge-v1015-trade.ts';
import { applyMacroGeographySpillover, readMacroGeographySpillover } from './bridge-economic-geography.ts';
import { applyMacroCreditSpillover, readMacroCreditSpilloverFromV1016 } from './bridge-v1016-credit.ts';
import { applyMacroInnovationSpillover, readMacroInnovationSpilloverFromV104 } from './bridge-v104-innovation.ts';
import { applyMacroWorkforceSpillover, readMacroWorkforceSpilloverFromV107 } from './bridge-v107-workforce.ts';
import { applyMacroStrategicSpillover, readMacroStrategicSpilloverFromV109 } from './bridge-v109-strategic.ts';
import { applyMacroHousingSpillover, readMacroHousingSpilloverFromV1014Housing } from './bridge-v1014-housing.ts';
import { applyMacroInflationSpillover, readMacroInflationSpilloverFromV1010 } from './bridge-v1010-inflation.ts';
import { applyMacroEnergySpillover, readMacroEnergySpilloverFromV1018 } from './bridge-v1018-energy.ts';
import { applyMacroEventsSpillover, readMacroEventsSpilloverFromV105 } from './bridge-v105-events.ts';
import { applyMacroCompaniesSpillover, readMacroCompaniesSpilloverFromV108 } from './bridge-v108-companies.ts';
import { applyMacroTurnsSpillover, readMacroTurnsSpilloverFromV102 } from './bridge-v102-turns.ts';
import { applyMacroTransportSpillover, readMacroTransportSpilloverFromV1017 } from './bridge-v1017-transport.ts';
import { applyMacroResearchSpillover, readMacroResearchSpilloverFromV103 } from './bridge-v103-research.ts';
import { applyMacroPopulationSpillover, readMacroPopulationSpilloverFromV109Pop } from './bridge-v109-population.ts';
import { applyMacroModesSpillover, readMacroModesSpilloverFromV1006 } from './bridge-v1006-modes.ts';
import { applyMacroGuardianSpillover, readMacroGuardianSpilloverFromV1016Guardian } from './bridge-v1016-guardian.ts';
import { applyMacroCitiesSpillover, readMacroCitiesSpilloverFromV1011Cities } from './bridge-v1011-cities.ts';
import { applyMacroForecastingSpillover, readMacroForecastingSpilloverFromV1021 } from './bridge-v1021-forecasting.ts';
import { applyMacroCommandSpillover, readMacroCommandSpilloverFromV1017Command } from './bridge-v1017-command.ts';
import { applyMacroAutomationSpillover, readMacroAutomationSpilloverFromV1020 } from './bridge-v1020-automation.ts';
import { applyMacroTeamAiSpillover, readMacroTeamAiSpilloverFromV1018Team } from './bridge-v1018-team-ai.ts';
import { applyMacroReplaySpillover, readMacroReplaySpilloverFromV1024 } from './bridge-v1024-replay.ts';
import { applyMacroMemorySpillover, readMacroMemorySpilloverFromV1019 } from './bridge-v1019-memory.ts';
import { applyMacroDashboardsSpillover, readMacroDashboardsSpilloverFromV1023 } from './bridge-v1023-dashboards.ts';
import { applyMacroUiSpillover, readMacroUiSpilloverFromV1022 } from './bridge-v1022-ui.ts';
import { applyMacroUtilitiesSpillover, readMacroUtilitiesSpilloverFromV1012Utilities } from './bridge-v1012-utilities.ts';
import { applyMacroTradeLogisticsSpillover, readMacroTradeLogisticsSpilloverFromV1015 } from './bridge-v1015-logistics.ts';
import { applyMacroNegotiationSpillover, readMacroNegotiationSpilloverFromV1005 } from './bridge-v1005-negotiation.ts';
import { applyMacroHouseholdConfidenceSpillover, readMacroHouseholdConfidenceSpilloverFromV1013 } from './bridge-v1013-confidence.ts';
import { applyMacroCapexSpillover, readMacroCapexSpilloverFromV1008 } from './bridge-v1008-capex.ts';
import { applyMacroMonetarySpillover, readMacroMonetarySpilloverFromV1010Monetary } from './bridge-v1010-monetary.ts';
import { applyMacroRentalSpillover, readMacroRentalSpilloverFromV1014Rental } from './bridge-v1014-rental.ts';
import { applyMacroClimatePolicySpillover, readMacroClimatePolicySpilloverFromV1018Climate } from './bridge-v1018-climate-policy.ts';
import { applyMacroForecastDispersionSpillover, readMacroForecastDispersionSpilloverFromV1021 } from './bridge-v1021-forecast-dispersion.ts';
import { applyMacroAccessibilitySpillover, readMacroAccessibilitySpilloverFromV1022 } from './bridge-v1022-accessibility.ts';
import { applyMacroTimelineSpillover, readMacroTimelineSpilloverFromV1024 } from './bridge-v1024-timeline.ts';
import { applyMacroLiquiditySpillover, readMacroLiquiditySpilloverFromV1016Liquidity } from './bridge-v1016-liquidity.ts';
import { applyMacroMapsTelemetrySpillover, readMacroMapsTelemetrySpilloverFromV1023 } from './bridge-v1023-maps-telemetry.ts';
import {
  applyMacroStrategicGameplaySpillover,
  readMacroStrategicGameplaySpilloverFromV1001
} from './bridge-v1001-strategic-gameplay.ts';
import {
  applyMacroArchiveIntegritySpillover,
  readMacroArchiveIntegritySpilloverFromV1024
} from './bridge-v1024-archive-integrity.ts';
import {
  applyMacroIntegrationHealthSpillover,
  readMacroIntegrationHealthSpilloverFromV1025
} from './bridge-v1025-integration-health.ts';
import {
  applyMacroCadenceDriftSpillover,
  readMacroCadenceDriftSpilloverFromV1002
} from './bridge-v1002-cadence-drift.ts';
import {
  applyMacroResearchMomentumSpillover,
  readMacroResearchMomentumSpilloverFromV1003
} from './bridge-v1003-research-momentum.ts';
import {
  applyMacroBudgetOutlookSpillover,
  readMacroBudgetOutlookSpilloverFromV1007
} from './bridge-v1007-budget-outlook.ts';
import { applyMacroModeShiftSpillover, readMacroModeShiftSpilloverFromV1004 } from './bridge-v1004-mode-shift.ts';
import {
  applyMacroSupplyChainSpillover,
  readMacroSupplyChainSpilloverFromV1008
} from './bridge-v1008-supply-chain.ts';
import {
  applyMacroEventCascadeSpillover,
  readMacroEventCascadeSpilloverFromV1005
} from './bridge-v1005-event-cascade.ts';
import {
  applyMacroDemographicShiftSpillover,
  readMacroDemographicShiftSpilloverFromV1009
} from './bridge-v1009-demographic-shift.ts';
import {
  applyMacroExpectationsAnchorSpillover,
  readMacroExpectationsAnchorSpilloverFromV1010
} from './bridge-v1010-expectations-anchor.ts';
import {
  applyMacroMetroMomentumSpillover,
  readMacroMetroMomentumSpilloverFromV1011
} from './bridge-v1011-metro-momentum.ts';
import { evaluateMacroConsistencyGates } from './consistency-gates.ts';
import { buildMacroDerivedSignals, composeMacroEconomyDebrief } from './macro-debrief.ts';
import { buildMacroTransmissionReport } from './macro-transmission.ts';
import { buildMacroStressIndexSnapshot } from './macro-stress-index.ts';
import { buildMacroPolicyStanceSnapshot } from './policy-stance-snapshot.ts';
import { buildMacroCapacitySnapshot } from './macro-capacity-snapshot.ts';
import { buildMacroTransmissionBalanceSnapshot } from './macro-transmission-balance.ts';
import { buildMacroTransmissionCoherenceSnapshot } from './macro-transmission-coherence.ts';
import { buildMacroTransmissionConcentrationSnapshot } from './macro-transmission-concentration.ts';
import { buildMacroTransmissionAsymmetrySnapshot } from './macro-transmission-asymmetry.ts';
import { buildMacroTransmissionVolatilitySnapshot } from './macro-transmission-volatility.ts';
import { buildMacroTransmissionResilienceSnapshot } from './macro-transmission-resilience.ts';
import { buildMacroTransmissionCoverageSnapshot } from './macro-transmission-coverage.ts';
import { buildMacroTransmissionAmplificationSnapshot } from './macro-transmission-amplification.ts';
import { buildMacroTransmissionTensionSnapshot } from './macro-transmission-tension.ts';
import { buildMacroTransmissionDivergenceSnapshot } from './macro-transmission-divergence.ts';
import { buildMacroTransmissionStabilitySnapshot } from './macro-transmission-stability.ts';
import { buildMacroTransmissionAlignmentSnapshot } from './macro-transmission-alignment.ts';
import { buildMacroTransmissionSynchronizationSnapshot } from './macro-transmission-synchronization.ts';
import { buildMacroTransmissionIntensitySnapshot } from './macro-transmission-intensity.ts';
import { buildMacroTransmissionPolarizationSnapshot } from './macro-transmission-polarization.ts';
import { buildMacroTransmissionCouplingSnapshot } from './macro-transmission-coupling.ts';
import { buildMacroTransmissionImbalanceSnapshot } from './macro-transmission-imbalance.ts';
import { buildMacroTransmissionHarmonicSnapshot } from './macro-transmission-harmonic.ts';
import { buildMacroTransmissionGradientSnapshot } from './macro-transmission-gradient.ts';
import { buildMacroTransmissionAttenuationSnapshot } from './macro-transmission-attenuation.ts';
import { buildMacroTransmissionEnvelopeSnapshot } from './macro-transmission-envelope.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { buildMacroTransmissionCentralitySnapshot } from './macro-transmission-centrality.ts';
import { appendMacroCycleTransitionMemory } from './cycle-memory.ts';
import { V1014_MACRO_LIMITS } from './constants.ts';
import { resolveActiveCyclicalShockIds } from './catalog/cyclical-shocks.ts';
import { clampMacroScores } from './investment.ts';
import {
  v1014macroBandInvestment,
  v1014macroBandProductivity,
  v1014macroBandUtilization,
  v1014macroClamp,
  v1014macroCycleFromScore
} from './math.ts';
import { nationalSectorProductivityFromScore } from './productivity.ts';
import { deriveUtilizationIndex } from './production.ts';
import {
  buildRegionalContributions,
  computeRegionalWeightRows,
  v1014macroNormalizeRegionalShares
} from './regional-aggregation.ts';
import { computeNationalSectorOutputMix } from './sector-decomposition.ts';
import { computeRegionalDivergenceSnapshot } from './regional-divergence.ts';
import { projectMacroEconomyOutlook } from './outlook-projection.ts';
import { macroEconomyInputHash, sanitizeMacroEconomyPersisted } from './persisted.ts';
import {
  applyMacroShockAdjustments,
  applyMacroStructuralAdjustments,
  createMacroEvidencePush
} from './shocks.ts';
import {
  V1014_MACRO_SCHEMA_VERSION,
  type MacroEconomyEvidence,
  type MacroEconomyInputs,
  type MacroEconomyPersisted,
  type NationalMacroEconomyState
} from './types.ts';

export function computeNationalMacroEconomy(
  inputs: MacroEconomyInputs,
  persistedIn: MacroEconomyPersisted | null | undefined,
  prevState: NationalMacroEconomyState | null | undefined
): { state: NationalMacroEconomyState; persisted: MacroEconomyPersisted } {
  const persisted = sanitizeMacroEconomyPersisted(persistedIn, inputs.turn);
  const hash = macroEconomyInputHash(inputs);
  if (prevState && persisted.lastInputHash === hash && prevState.inputHash === hash) {
    return { state: prevState, persisted };
  }

  const evList: MacroEconomyEvidence[] = [];
  const pushEv = createMacroEvidencePush(evList, inputs.turn);
  const activeShockIds = resolveActiveCyclicalShockIds(inputs);

  let productivityScore = persisted.productivityScore;
  let investmentScore = persisted.investmentScore;
  let cycleScore = persisted.cycleScore;

  const weights = computeRegionalWeightRows(inputs, pushEv);
  const shares = v1014macroNormalizeRegionalShares(weights);
  const shareSum = Object.values(shares).reduce((a, b) => a + b, 0);

  const structural = applyMacroStructuralAdjustments(
    inputs,
    { productivityScore, investmentScore, cycleScore },
    pushEv
  );
  const fiscalSpillover = readMacroFiscalSpilloverFromV1012(inputs);
  const householdSpillover = readMacroHouseholdSpilloverFromV1013(inputs);
  const industrySpillover = readMacroIndustrySpilloverFromV101(inputs);
  const tradeSpillover = readMacroTradeSpilloverFromV1015(inputs);
  const geographySpillover = readMacroGeographySpillover(inputs);
  const creditSpillover = readMacroCreditSpilloverFromV1016(inputs);
  const innovationSpillover = readMacroInnovationSpilloverFromV104(inputs);
  const workforceSpillover = readMacroWorkforceSpilloverFromV107(inputs);
  const strategicSpillover = readMacroStrategicSpilloverFromV109(inputs);
  const housingSpillover = readMacroHousingSpilloverFromV1014Housing(inputs);
  const inflationSpillover = readMacroInflationSpilloverFromV1010(inputs);
  const energySpillover = readMacroEnergySpilloverFromV1018(inputs);
  const eventsSpillover = readMacroEventsSpilloverFromV105(inputs);
  const companiesSpillover = readMacroCompaniesSpilloverFromV108(inputs);
  const turnsSpillover = readMacroTurnsSpilloverFromV102(inputs);
  const transportSpillover = readMacroTransportSpilloverFromV1017(inputs);
  const researchSpillover = readMacroResearchSpilloverFromV103(inputs);
  const populationSpillover = readMacroPopulationSpilloverFromV109Pop(inputs);
  const modesSpillover = readMacroModesSpilloverFromV1006(inputs);
  const guardianSpillover = readMacroGuardianSpilloverFromV1016Guardian(inputs);
  const citiesSpillover = readMacroCitiesSpilloverFromV1011Cities(inputs);
  const forecastingSpillover = readMacroForecastingSpilloverFromV1021(inputs);
  const commandSpillover = readMacroCommandSpilloverFromV1017Command(inputs);
  const automationSpillover = readMacroAutomationSpilloverFromV1020(inputs);
  const teamAiSpillover = readMacroTeamAiSpilloverFromV1018Team(inputs);
  const replaySpillover = readMacroReplaySpilloverFromV1024(inputs);
  const memorySpillover = readMacroMemorySpilloverFromV1019(inputs);
  const dashboardsSpillover = readMacroDashboardsSpilloverFromV1023(inputs);
  const uiSpillover = readMacroUiSpilloverFromV1022(inputs);
  const utilitiesSpillover = readMacroUtilitiesSpilloverFromV1012Utilities(inputs);
  const logisticsSpillover = readMacroTradeLogisticsSpilloverFromV1015(inputs);
  const negotiationSpillover = readMacroNegotiationSpilloverFromV1005(inputs);
  const confidenceSpillover = readMacroHouseholdConfidenceSpilloverFromV1013(inputs);
  const capexSpillover = readMacroCapexSpilloverFromV1008(inputs);
  const monetarySpillover = readMacroMonetarySpilloverFromV1010Monetary(inputs);
  const rentalSpillover = readMacroRentalSpilloverFromV1014Rental(inputs);
  const climateSpillover = readMacroClimatePolicySpilloverFromV1018Climate(inputs);
  const forecastDispersionSpillover = readMacroForecastDispersionSpilloverFromV1021(inputs);
  const accessibilitySpillover = readMacroAccessibilitySpilloverFromV1022(inputs);
  const timelineSpillover = readMacroTimelineSpilloverFromV1024(inputs);
  const liquiditySpillover = readMacroLiquiditySpilloverFromV1016Liquidity(inputs);
  const mapsTelemetrySpillover = readMacroMapsTelemetrySpilloverFromV1023(inputs);
  const strategicGameplaySpillover = readMacroStrategicGameplaySpilloverFromV1001(inputs);
  const archiveIntegritySpillover = readMacroArchiveIntegritySpilloverFromV1024(inputs);
  const integrationHealthSpillover = readMacroIntegrationHealthSpilloverFromV1025(inputs);
  const cadenceDriftSpillover = readMacroCadenceDriftSpilloverFromV1002(inputs);
  const researchMomentumSpillover = readMacroResearchMomentumSpilloverFromV1003(inputs);
  const budgetOutlookSpillover = readMacroBudgetOutlookSpilloverFromV1007(inputs);
  const modeShiftSpillover = readMacroModeShiftSpilloverFromV1004(inputs);
  const supplyChainSpillover = readMacroSupplyChainSpilloverFromV1008(inputs);
  const eventCascadeSpillover = readMacroEventCascadeSpilloverFromV1005(inputs);
  const demographicShiftSpillover = readMacroDemographicShiftSpilloverFromV1009(inputs);
  const expectationsAnchorSpillover = readMacroExpectationsAnchorSpilloverFromV1010(inputs);
  const metroMomentumSpillover = readMacroMetroMomentumSpilloverFromV1011(inputs);
  const withFiscal = applyMacroFiscalSpillover(structural, fiscalSpillover);
  const withHousehold = applyMacroHouseholdSpillover(withFiscal, householdSpillover);
  const withIndustry = applyMacroIndustrySpillover(withHousehold, industrySpillover);
  const withTrade = applyMacroTradeSpillover(withIndustry, tradeSpillover);
  const withGeography = applyMacroGeographySpillover(withTrade, geographySpillover);
  const withCredit = applyMacroCreditSpillover(withGeography, creditSpillover);
  const withInnovation = applyMacroInnovationSpillover(withCredit, innovationSpillover);
  const withWorkforce = applyMacroWorkforceSpillover(withInnovation, workforceSpillover);
  const withStrategic = applyMacroStrategicSpillover(withWorkforce, strategicSpillover);
  const withHousing = applyMacroHousingSpillover(withStrategic, housingSpillover);
  const withInflation = applyMacroInflationSpillover(withHousing, inflationSpillover);
  const withEnergy = applyMacroEnergySpillover(withInflation, energySpillover);
  const withEvents = applyMacroEventsSpillover(withEnergy, eventsSpillover);
  const withCompanies = applyMacroCompaniesSpillover(withEvents, companiesSpillover);
  const withTurns = applyMacroTurnsSpillover(withCompanies, turnsSpillover);
  const withTransport = applyMacroTransportSpillover(withTurns, transportSpillover);
  const withResearch = applyMacroResearchSpillover(withTransport, researchSpillover);
  const withPopulation = applyMacroPopulationSpillover(withResearch, populationSpillover);
  const withModes = applyMacroModesSpillover(withPopulation, modesSpillover);
  const withGuardian = applyMacroGuardianSpillover(withModes, guardianSpillover);
  const withCities = applyMacroCitiesSpillover(withGuardian, citiesSpillover);
  const withForecasting = applyMacroForecastingSpillover(withCities, forecastingSpillover);
  const withCommand = applyMacroCommandSpillover(withForecasting, commandSpillover);
  const withAutomation = applyMacroAutomationSpillover(withCommand, automationSpillover);
  const withTeamAi = applyMacroTeamAiSpillover(withAutomation, teamAiSpillover);
  const withReplay = applyMacroReplaySpillover(withTeamAi, replaySpillover);
  const withMemory = applyMacroMemorySpillover(withReplay, memorySpillover);
  const withDashboards = applyMacroDashboardsSpillover(withMemory, dashboardsSpillover);
  const withUi = applyMacroUiSpillover(withDashboards, uiSpillover);
  const withUtilities = applyMacroUtilitiesSpillover(withUi, utilitiesSpillover);
  const withLogistics = applyMacroTradeLogisticsSpillover(withUtilities, logisticsSpillover);
  const withNegotiation = applyMacroNegotiationSpillover(withLogistics, negotiationSpillover);
  const withConfidence = applyMacroHouseholdConfidenceSpillover(withNegotiation, confidenceSpillover);
  const withCapex = applyMacroCapexSpillover(withConfidence, capexSpillover);
  const withMonetary = applyMacroMonetarySpillover(withCapex, monetarySpillover);
  const withRental = applyMacroRentalSpillover(withMonetary, rentalSpillover);
  const withClimate = applyMacroClimatePolicySpillover(withRental, climateSpillover);
  const withForecastDispersion = applyMacroForecastDispersionSpillover(withClimate, forecastDispersionSpillover);
  const withAccessibility = applyMacroAccessibilitySpillover(withForecastDispersion, accessibilitySpillover);
  const withTimeline = applyMacroTimelineSpillover(withAccessibility, timelineSpillover);
  const withLiquidity = applyMacroLiquiditySpillover(withTimeline, liquiditySpillover);
  const withMapsTelemetry = applyMacroMapsTelemetrySpillover(withLiquidity, mapsTelemetrySpillover);
  const withStrategicGameplay = applyMacroStrategicGameplaySpillover(withMapsTelemetry, strategicGameplaySpillover);
  const withArchiveIntegrity = applyMacroArchiveIntegritySpillover(withStrategicGameplay, archiveIntegritySpillover);
  const withIntegrationHealth = applyMacroIntegrationHealthSpillover(withArchiveIntegrity, integrationHealthSpillover);
  const withCadenceDrift = applyMacroCadenceDriftSpillover(withIntegrationHealth, cadenceDriftSpillover);
  const withResearchMomentum = applyMacroResearchMomentumSpillover(withCadenceDrift, researchMomentumSpillover);
  const withBudgetOutlook = applyMacroBudgetOutlookSpillover(withResearchMomentum, budgetOutlookSpillover);
  const withModeShift = applyMacroModeShiftSpillover(withBudgetOutlook, modeShiftSpillover);
  const withSupplyChain = applyMacroSupplyChainSpillover(withModeShift, supplyChainSpillover);
  const withEventCascade = applyMacroEventCascadeSpillover(withSupplyChain, eventCascadeSpillover);
  const withDemographicShift = applyMacroDemographicShiftSpillover(withEventCascade, demographicShiftSpillover);
  const withExpectationsAnchor = applyMacroExpectationsAnchorSpillover(withDemographicShift, expectationsAnchorSpillover);
  const withMetroMomentum = applyMacroMetroMomentumSpillover(withExpectationsAnchor, metroMomentumSpillover);
  const shocked = applyMacroShockAdjustments(inputs, withMetroMomentum, pushEv);
  ({ productivityScore, investmentScore, cycleScore } = clampMacroScores(shocked));

  const productivityBand = v1014macroBandProductivity(productivityScore);
  const investmentClimate = v1014macroBandInvestment(investmentScore);
  const utilizationIndex = deriveUtilizationIndex(cycleScore, investmentScore);
  const utilizationBand = v1014macroBandUtilization(utilizationIndex);
  const cyclePhase = v1014macroCycleFromScore(cycleScore, persisted.cycleHysteresis);

  const regionalContributions = buildRegionalContributions({
    inputs,
    shares,
    investmentScore,
    utilizationIndex,
    evidence: evList
  });

  const accounting = buildNationalAccountingLedger({
    productivityScore,
    utilizationIndex,
    investmentScore,
    regionalSumShare: shareSum
  });

  const sectorProductivity = nationalSectorProductivityFromScore(productivityScore);
  const sectorOutputMix = computeNationalSectorOutputMix(regionalContributions);
  const regionalDivergence = computeRegionalDivergenceSnapshot(regionalContributions);
  const transmissionReport = buildMacroTransmissionReport({
    turn: inputs.turn,
    fiscal: fiscalSpillover,
    household: householdSpillover,
    industry: industrySpillover,
    trade: tradeSpillover,
    geography: geographySpillover,
    credit: creditSpillover,
    innovation: innovationSpillover,
    workforce: workforceSpillover,
    strategic: strategicSpillover,
    housing: housingSpillover,
    inflation: inflationSpillover,
    energy: energySpillover,
    events: eventsSpillover,
    companies: companiesSpillover,
    turns: turnsSpillover,
    transport: transportSpillover,
    research: researchSpillover,
    population: populationSpillover,
    modes: modesSpillover,
    guardian: guardianSpillover,
    cities: citiesSpillover,
    forecasting: forecastingSpillover,
    command: commandSpillover,
    automation: automationSpillover,
    teamAi: teamAiSpillover,
    replay: replaySpillover,
    memory: memorySpillover,
    dashboards: dashboardsSpillover,
    ui: uiSpillover,
    utilities: utilitiesSpillover,
    logistics: logisticsSpillover,
    negotiation: negotiationSpillover,
    confidence: confidenceSpillover,
    capex: capexSpillover,
    monetary: monetarySpillover,
    rental: rentalSpillover,
    climate: climateSpillover,
    forecastDispersion: forecastDispersionSpillover,
    accessibility: accessibilitySpillover,
    timeline: timelineSpillover,
    liquidity: liquiditySpillover,
    mapsTelemetry: mapsTelemetrySpillover,
    strategicGameplay: strategicGameplaySpillover,
    archiveIntegrity: archiveIntegritySpillover,
    integrationHealth: integrationHealthSpillover,
    cadenceDrift: cadenceDriftSpillover,
    researchMomentum: researchMomentumSpillover,
    budgetOutlook: budgetOutlookSpillover,
    modeShift: modeShiftSpillover,
    supplyChain: supplyChainSpillover,
    eventCascade: eventCascadeSpillover,
    demographicShift: demographicShiftSpillover,
    expectationsAnchor: expectationsAnchorSpillover,
    metroMomentum: metroMomentumSpillover
  });

  const transmissionBalance = buildMacroTransmissionBalanceSnapshot(transmissionReport);
  const transmissionCoherence = buildMacroTransmissionCoherenceSnapshot(transmissionReport, cyclePhase);
  const transmissionConcentration = buildMacroTransmissionConcentrationSnapshot(transmissionReport);
  const transmissionAsymmetry = buildMacroTransmissionAsymmetrySnapshot(transmissionReport);
  const transmissionVolatility = buildMacroTransmissionVolatilitySnapshot(transmissionReport);
  const transmissionResilience = buildMacroTransmissionResilienceSnapshot(transmissionReport);
  const transmissionCoverage = buildMacroTransmissionCoverageSnapshot(transmissionReport);
  const transmissionAmplification = buildMacroTransmissionAmplificationSnapshot(transmissionReport);
  const transmissionTension = buildMacroTransmissionTensionSnapshot(transmissionReport);
  const transmissionDivergence = buildMacroTransmissionDivergenceSnapshot(transmissionReport);
  const transmissionStability = buildMacroTransmissionStabilitySnapshot(transmissionReport);
  const transmissionAlignment = buildMacroTransmissionAlignmentSnapshot(transmissionReport);
  const transmissionSynchronization = buildMacroTransmissionSynchronizationSnapshot(transmissionReport);
  const transmissionIntensity = buildMacroTransmissionIntensitySnapshot(transmissionReport);
  const transmissionPolarization = buildMacroTransmissionPolarizationSnapshot(transmissionReport);
  const transmissionCoupling = buildMacroTransmissionCouplingSnapshot(transmissionReport);
  const transmissionImbalance = buildMacroTransmissionImbalanceSnapshot(transmissionReport);
  const transmissionHarmonic = buildMacroTransmissionHarmonicSnapshot(transmissionReport);
  const transmissionGradient = buildMacroTransmissionGradientSnapshot(transmissionReport);
  const transmissionAttenuation = buildMacroTransmissionAttenuationSnapshot(transmissionReport);
  const transmissionEnvelope = buildMacroTransmissionEnvelopeSnapshot(transmissionReport);
  const transmissionPersistence = buildMacroTransmissionPersistenceSnapshot(transmissionReport);
  const transmissionCentrality = buildMacroTransmissionCentralitySnapshot(transmissionReport);

  const capacitySnapshot = buildMacroCapacitySnapshot({
    state: {
      utilizationIndex,
      utilizationBand,
      investmentClimate
    },
    industry: industrySpillover,
    workforce: workforceSpillover
  });

  let nextPersisted: MacroEconomyPersisted = {
    ...persisted,
    revision: persisted.revision + 1,
    initializedTurn: persisted.initializedTurn ?? inputs.turn,
    lastUpdatedTurn: inputs.turn,
    lastInputHash: hash,
    cycleHysteresis: cyclePhase,
    cycleScore,
    productivityHysteresis: productivityBand,
    productivityScore,
    investmentHysteresis: investmentClimate,
    investmentScore
  };

  nextPersisted = appendMacroCycleTransitionMemory(nextPersisted, {
    turn: inputs.turn,
    previousPhase: persisted.cycleHysteresis,
    nextPhase: cyclePhase
  });

  const partialStateForOutlook: NationalMacroEconomyState = {
    schemaVersion: V1014_MACRO_SCHEMA_VERSION,
    revision: nextPersisted.revision,
    turn: inputs.turn,
    inputHash: hash,
    cyclePhase,
    cycleMomentum: v1014macroClamp((cycleScore - 50) / 50, -1, 1),
    cycleDurationTurns: prevState?.cyclePhase === cyclePhase ? (prevState?.cycleDurationTurns ?? 0) + 1 : 1,
    productivityBand,
    productivityIndex: productivityScore,
    investmentClimate,
    grossInvestmentIndex: investmentScore,
    utilizationBand,
    utilizationIndex,
    regionalContributions,
    accounting,
    sectorProductivity,
    sectorOutputMix,
    activeCyclicalShockIds: activeShockIds,
    fiscalSpilloverSummary: fiscalSpillover.summary,
    householdSpilloverSummary: householdSpillover.summary,
    industrySpilloverSummary: industrySpillover.summary,
    tradeSpilloverSummary: tradeSpillover.summary,
    geographySpilloverSummary: geographySpillover.summary,
    creditSpilloverSummary: creditSpillover.summary,
    innovationSpilloverSummary: innovationSpillover.summary,
    workforceSpilloverSummary: workforceSpillover.summary,
    strategicSpilloverSummary: strategicSpillover.summary,
    housingSpilloverSummary: housingSpillover.summary,
    inflationSpilloverSummary: inflationSpillover.summary,
    energySpilloverSummary: energySpillover.summary,
    eventsSpilloverSummary: eventsSpillover.summary,
    companiesSpilloverSummary: companiesSpillover.summary,
    turnsSpilloverSummary: turnsSpillover.summary,
    transportSpilloverSummary: transportSpillover.summary,
    researchSpilloverSummary: researchSpillover.summary,
    populationSpilloverSummary: populationSpillover.summary,
    modesSpilloverSummary: modesSpillover.summary,
    guardianSpilloverSummary: guardianSpillover.summary,
    citiesSpilloverSummary: citiesSpillover.summary,
    forecastingSpilloverSummary: forecastingSpillover.summary,
    commandSpilloverSummary: commandSpillover.summary,
    automationSpilloverSummary: automationSpillover.summary,
    teamAiSpilloverSummary: teamAiSpillover.summary,
    replaySpilloverSummary: replaySpillover.summary,
    memorySpilloverSummary: memorySpillover.summary,
    dashboardsSpilloverSummary: dashboardsSpillover.summary,
    uiSpilloverSummary: uiSpillover.summary,
    utilitiesSpilloverSummary: utilitiesSpillover.summary,
    logisticsSpilloverSummary: logisticsSpillover.summary,
    negotiationSpilloverSummary: negotiationSpillover.summary,
    confidenceSpilloverSummary: confidenceSpillover.summary,
    capexSpilloverSummary: capexSpillover.summary,
    monetarySpilloverSummary: monetarySpillover.summary,
    rentalSpilloverSummary: rentalSpillover.summary,
    climateSpilloverSummary: climateSpillover.summary,
    forecastDispersionSpilloverSummary: forecastDispersionSpillover.summary,
    accessibilitySpilloverSummary: accessibilitySpillover.summary,
    timelineSpilloverSummary: timelineSpillover.summary,
    liquiditySpilloverSummary: liquiditySpillover.summary,
    mapsTelemetrySpilloverSummary: mapsTelemetrySpillover.summary,
    strategicGameplaySpilloverSummary: strategicGameplaySpillover.summary,
    archiveIntegritySpilloverSummary: archiveIntegritySpillover.summary,
    integrationHealthSpilloverSummary: integrationHealthSpillover.summary,
    cadenceDriftSpilloverSummary: cadenceDriftSpillover.summary,
    researchMomentumSpilloverSummary: researchMomentumSpillover.summary,
    budgetOutlookSpilloverSummary: budgetOutlookSpillover.summary,
    modeShiftSpilloverSummary: modeShiftSpillover.summary,
    supplyChainSpilloverSummary: supplyChainSpillover.summary,
    eventCascadeSpilloverSummary: eventCascadeSpillover.summary,
    demographicShiftSpilloverSummary: demographicShiftSpillover.summary,
    expectationsAnchorSpilloverSummary: expectationsAnchorSpillover.summary,
    metroMomentumSpilloverSummary: metroMomentumSpillover.summary,
    capacitySnapshot,
    transmissionBalance,
    transmissionCoherence,
    transmissionConcentration,
    transmissionAsymmetry,
    transmissionVolatility,
    transmissionResilience,
    transmissionCoverage,
    transmissionAmplification,
    transmissionTension,
    transmissionDivergence,
    transmissionStability,
    transmissionAlignment,
    transmissionSynchronization,
    transmissionIntensity,
    transmissionPolarization,
    transmissionCoupling,
    transmissionImbalance,
    transmissionHarmonic,
    transmissionGradient,
    transmissionAttenuation,
    transmissionEnvelope,
    transmissionPersistence,
    transmissionCentrality,
    transmissionReport,
    stressIndex: {
      score: 0,
      band: 'calm',
      drivers: [],
      transmissionStress: 0,
      gateStress: 0
    },
    policyStance: {
      stance: 'neutral',
      fiscalTilt: 0,
      creditTilt: 0,
      summary: ''
    },
    regionalDivergence,
    outlookProjection: {
      horizonTurns: 3,
      projectedCyclePhase: cyclePhase,
      projectedInvestmentClimate: investmentClimate,
      projectedProductivityBand: productivityBand,
      projectedOutputIndex: accounting.grossOutputIndex,
      confidence: 0.9
    },
    consistencyGates: [],
    debrief: { headline: '', bullets: [] },
    derivedSignals: [],
    evidence: evList.slice(0, V1014_MACRO_LIMITS.maxEvidence),
    outlook: { phase: cyclePhase, productivity: productivityBand, investment: investmentClimate }
  };

  const outlookProjection = projectMacroEconomyOutlook(partialStateForOutlook, inputs, 3);

  const stateBase: NationalMacroEconomyState = {
    ...partialStateForOutlook,
    outlookProjection
  };
  const consistencyGates = evaluateMacroConsistencyGates(stateBase, inputs);
  const stressIndex = buildMacroStressIndexSnapshot({ ...stateBase, consistencyGates });
  const policyStance = buildMacroPolicyStanceSnapshot({
    inputs,
    state: stateBase,
    fiscal: fiscalSpillover,
    credit: creditSpillover
  });
  const debrief = composeMacroEconomyDebrief({ ...stateBase, consistencyGates, stressIndex, policyStance });
  const derivedSignals = buildMacroDerivedSignals(stateBase, persisted.cycleHysteresis);

  const state: NationalMacroEconomyState = {
    ...stateBase,
    consistencyGates,
    stressIndex,
    policyStance,
    debrief,
    derivedSignals
  };

  return { state, persisted: nextPersisted };
}
