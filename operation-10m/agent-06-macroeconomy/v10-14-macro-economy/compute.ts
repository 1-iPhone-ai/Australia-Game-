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
  const shocked = applyMacroShockAdjustments(inputs, withReplay, pushEv);
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
    replay: replaySpillover
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
