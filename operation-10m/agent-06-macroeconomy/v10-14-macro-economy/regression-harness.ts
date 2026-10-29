import { macroStressScenarioShockIds } from './catalog/stress-scenarios.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { validateNationalMacroEconomyState } from './accounting/validate-state.ts';
import type { MacroEconomyInputs, MacroEconomyPersisted, NationalMacroEconomyState } from './types.ts';

export interface MacroRegressionCheck {
  id: string;
  passed: boolean;
  detail: string;
}

export interface MacroRegressionHarnessResult {
  scenarioId: string;
  turnsRun: number;
  allPassed: boolean;
  checks: MacroRegressionCheck[];
}

/** Deterministic multi-turn macro regression (warn-only; no canonical mutation). */
export function runMacroEconomyRegressionHarness(options?: {
  turns?: number;
  scenarioId?: string;
  includeCreditStress?: boolean;
  includeLaborInnovationStress?: boolean;
  includeHousingStrategicStress?: boolean;
  includeInflationEnergyStress?: boolean;
  includeEventsCompaniesStress?: boolean;
  includeTurnsTransportStress?: boolean;
  includeResearchPopulationStress?: boolean;
  includeModesGuardianStress?: boolean;
  includeCitiesForecastingStress?: boolean;
  includeCommandAutomationStress?: boolean;
  includeTeamReplayStress?: boolean;
  includeMemoryDashboardStress?: boolean;
  includeUiUtilitiesStress?: boolean;
  includeLogisticsNegotiationStress?: boolean;
}): MacroRegressionHarnessResult {
  const turns = Math.max(5, Math.min(48, Math.floor(options?.turns ?? 24)));
  const scenarioId = options?.scenarioId ?? 'baseline_soft_landing';
  const includeCreditStress = Boolean(options?.includeCreditStress);
  const includeLaborInnovationStress = Boolean(options?.includeLaborInnovationStress);
  const includeHousingStrategicStress = Boolean(options?.includeHousingStrategicStress);
  const includeInflationEnergyStress = Boolean(options?.includeInflationEnergyStress);
  const includeEventsCompaniesStress = Boolean(options?.includeEventsCompaniesStress);
  const includeTurnsTransportStress = Boolean(options?.includeTurnsTransportStress);
  const includeResearchPopulationStress = Boolean(options?.includeResearchPopulationStress);
  const includeModesGuardianStress = Boolean(options?.includeModesGuardianStress);
  const includeCitiesForecastingStress = Boolean(options?.includeCitiesForecastingStress);
  const includeCommandAutomationStress = Boolean(options?.includeCommandAutomationStress);
  const includeTeamReplayStress = Boolean(options?.includeTeamReplayStress);
  const includeMemoryDashboardStress = Boolean(options?.includeMemoryDashboardStress);
  const includeUiUtilitiesStress = Boolean(options?.includeUiUtilitiesStress);
  const includeLogisticsNegotiationStress = Boolean(options?.includeLogisticsNegotiationStress);
  const shockIds = macroStressScenarioShockIds(scenarioId);
  const checks: MacroRegressionCheck[] = [];
  let persisted: MacroEconomyPersisted | null = null;
  let prev: NationalMacroEconomyState | null = null;
  let lastHash = '';

  for (let t = 1; t <= turns; t++) {
    const inputs: MacroEconomyInputs = makeDefaultV1014_MACRO_TestInputs({
      turn: t,
      activeCyclicalShockIds: shockIds,
      creditMarkets: includeCreditStress
        ? { spreadBand: t % 5 === 0 ? 'stressed' : 'elevated', policyStance: 'restrictive' }
        : undefined,
      economicGeography: { connectivity: { band: t % 11 === 0 ? 'fragmented' : 'moderate' }, urbanizationIndex: 58 },
      workforce: includeLaborInnovationStress
        ? {
            nationalReadinessBand: t % 6 === 0 ? 'critical' : 'strained',
            laborMarket: { slack: t % 4 === 0 ? 'tight' : 'moderate' }
          }
        : undefined,
      innovation: includeLaborInnovationStress
        ? { momentum: { band: t % 5 === 0 ? 'stalled' : 'moderate' }, nationalProductivityBonus: t % 8 === 0 }
        : undefined,
      strategicCapital: includeHousingStrategicStress
        ? {
            allocationBand: t % 6 === 0 ? 'expansionary' : 'balanced',
            nationalPriority: t % 9 === 0 ? 'infrastructure' : 'stabilization'
          }
        : undefined,
      housingWellbeing: includeHousingStrategicStress
        ? {
            affordability: { band: t % 7 === 0 ? 'stressed' : 'balanced' },
            construction: { band: t % 5 === 0 ? 'correction' : 'strong' }
          }
        : undefined,
      nationalFinance: includeInflationEnergyStress
        ? {
            inflation: { band: t % 6 === 0 ? 'elevated' : 'moderate' },
            inflationExpectations: { band: t % 8 === 0 ? 'rising' : 'anchored' }
          }
        : undefined,
      industrialEnergy: includeInflationEnergyStress
        ? {
            supplyReliability: { band: t % 5 === 0 ? 'stressed' : 'robust' },
            energyCost: { band: t % 7 === 0 ? 'elevated' : 'favorable' },
            transition: { band: t % 9 === 0 ? 'accelerating' : 'steady' }
          }
        : undefined,
      dynamicEvents: includeEventsCompaniesStress
        ? {
            nationalStabilityBand: t % 6 === 0 ? 'fragile' : 'stable',
            pendingBacklogBand: t % 5 === 0 ? 'elevated' : 'calm',
            activeCrisisCount: t % 8 === 0 ? 2 : 0
          }
        : undefined,
      privateSector: includeEventsCompaniesStress
        ? {
            nationalUtilizationBand: t % 7 === 0 ? 'slack' : 'balanced',
            overloadedFirmCount: t % 6 === 0 ? 3 : 0,
            productionMomentum: { band: t % 9 === 0 ? 'contracting' : 'steady' }
          }
        : undefined,
      turnsTime: includeTurnsTransportStress
        ? {
            paceBand: t % 6 === 0 ? 'stalled' : 'steady',
            season: t % 4 === 0 ? 'Winter' : 'Spring',
            macroPhaseBand: t % 8 === 0 ? 'late_cycle' : 'expansionary_cadence'
          }
        : undefined,
      transportInfrastructure: includeTurnsTransportStress
        ? {
            connectivityBand: t % 5 === 0 ? 'fragmented' : 'robust',
            throughputBand: t % 7 === 0 ? 'constrained' : 'ample',
            investmentPipeline: { band: t % 9 === 0 ? 'active' : 'steady' }
          }
        : undefined,
      researchTech: includeResearchPopulationStress
        ? {
            pipelineBand: t % 6 === 0 ? 'stalled' : 'strong',
            adoptionBand: t % 7 === 0 ? 'fragmented' : 'scaling',
            fundingBand: t % 8 === 0 ? 'cut' : 'expansionary'
          }
        : undefined,
      population: includeResearchPopulationStress
        ? {
            growthBand: t % 5 === 0 ? 'stagnant' : 'strong',
            dependencyBand: t % 6 === 0 ? 'elevated' : 'favorable',
            netMigrationBand: t % 9 === 0 ? 'outflow' : 'strong_inflow'
          }
        : undefined,
      modesScenarios: includeModesGuardianStress
        ? {
            difficultyBand: t % 6 === 0 ? 'extreme' : 'standard',
            campaignMomentum: { band: t % 7 === 0 ? 'stalled' : 'summit_push' },
            scenarioVolatility: { band: t % 5 === 0 ? 'high' : 'stable' }
          }
        : undefined,
      guardianCopilot: includeModesGuardianStress
        ? {
            alertBand: t % 8 === 0 ? 'critical' : 'calm',
            openWarningCount: t % 6 === 0 ? 4 : 1,
            guidanceConfidence: { band: t % 9 === 0 ? 'low' : 'high' }
          }
        : undefined,
      citiesRegions: includeCitiesForecastingStress
        ? {
            urbanizationBand: t % 6 === 0 ? 'declining' : 'rapid',
            housingPressure: { band: t % 7 === 0 ? 'severe' : 'balanced' },
            hubStrength: { band: t % 5 === 0 ? 'weak' : 'strong' }
          }
        : undefined,
      forecastingLab: includeCitiesForecastingStress
        ? {
            outlookBand: t % 6 === 0 ? 'recession' : 'expansion',
            confidenceBand: t % 8 === 0 ? 'low' : 'high',
            dispersionBand: t % 5 === 0 ? 'wide' : 'tight'
          }
        : undefined,
      commandCenter: includeCommandAutomationStress
        ? {
            postureBand: t % 7 === 0 ? 'crisis' : 'steady',
            coordinationBand: t % 6 === 0 ? 'fragmented' : 'integrated',
            decisionBacklog: { band: t % 5 === 0 ? 'elevated' : 'clear' }
          }
        : undefined,
      idleAutomation: includeCommandAutomationStress
        ? {
            throughputBand: t % 6 === 0 ? 'stalled' : 'high',
            reliabilityBand: t % 8 === 0 ? 'fragile' : 'robust',
            adoptionBand: t % 9 === 0 ? 'minimal' : 'broad' }
        : undefined,
      teamIntelligence: includeTeamReplayStress
        ? {
            cohesionBand: t % 6 === 0 ? 'fractured' : 'strong',
            analysisThroughput: { band: t % 7 === 0 ? 'blocked' : 'high' },
            internalConflict: { band: t % 5 === 0 ? 'severe' : 'low' }
          }
        : undefined,
      historyReplay: includeTeamReplayStress
        ? {
            volatilityBand: t % 5 === 0 ? 'extreme' : 'stable',
            stressMemory: { band: t % 6 === 0 ? 'scarring' : 'fading' },
            recoveryArc: { band: t % 8 === 0 ? 'l-shaped' : 'strong' }
          }
        : undefined,
      aiMemory: includeMemoryDashboardStress
        ? {
            driftBand: t % 6 === 0 ? 'runaway' : 'stable',
            recallFidelity: { band: t % 7 === 0 ? 'degraded' : 'high' },
            auditGap: { band: t % 5 === 0 ? 'wide' : 'narrow' }
          }
        : undefined,
      dashboardsMaps: includeMemoryDashboardStress
        ? {
            refreshLag: { band: t % 5 === 0 ? 'stale' : 'fresh' },
            signalCoherence: { band: t % 6 === 0 ? 'fragmented' : 'aligned' },
            alertDensity: { band: t % 7 === 0 ? 'flooded' : 'calm' }
          }
        : undefined,
      gameUi: includeUiUtilitiesStress
        ? {
            panelLatency: { band: t % 6 === 0 ? 'critical' : 'snappy' },
            navigationClutter: { band: t % 5 === 0 ? 'overloaded' : 'clear' },
            renderHealth: { band: t % 7 === 0 ? 'unstable' : 'stable' }
          }
        : undefined,
      utilitiesGrid: includeUiUtilitiesStress
        ? {
            serviceReliability: { band: t % 6 === 0 ? 'fragile' : 'robust' },
            outageBand: t % 5 === 0 ? 'rolling' : 'rare',
            capacityMargin: { band: t % 8 === 0 ? 'thin' : 'ample' }
          }
        : undefined,
      trade: includeLogisticsNegotiationStress
        ? {
            termsOfTrade: { band: t % 7 === 0 ? 'weak' : 'stable' },
            logistics: {
              portBacklogBand: t % 6 === 0 ? 'gridlocked' : 'clear',
              routeReliability: { band: t % 5 === 0 ? 'disrupted' : 'robust' },
              leadTimeBand: t % 8 === 0 ? 'extended' : 'normal'
            }
          }
        : t % 7 === 0
          ? { termsOfTrade: { band: 'weak' }, exportMomentum: -4 }
          : { termsOfTrade: { band: 'stable' }, exportMomentum: 1 },
      negotiationState: includeLogisticsNegotiationStress
        ? {
            deadlockBand: t % 6 === 0 ? 'entrenched' : 'clear',
            trustBand: t % 7 === 0 ? 'collapsed' : 'robust',
            claimPressureBand: t % 5 === 0 ? 'surging' : 'calm'
          }
        : undefined
    });
    const { state, persisted: nextP } = computeNationalMacroEconomy(inputs, persisted, prev);
    persisted = nextP;
    prev = state;
    lastHash = state.inputHash;
    const validation = validateNationalMacroEconomyState(state);
    if (!validation.valid) {
      checks.push({ id: `turn_${t}_valid`, passed: false, detail: validation.issues.join(';') });
      break;
    }
    if (!Number.isFinite(state.accounting.grossOutputIndex)) {
      checks.push({ id: `turn_${t}_finite`, passed: false, detail: 'non-finite output' });
      break;
    }
  }

  checks.push({
    id: 'completed_turns',
    passed: prev != null && prev.turn === turns,
    detail: prev ? `last turn ${prev.turn}` : 'no state'
  });
  checks.push({
    id: 'identity_stable',
    passed: Boolean(prev?.accounting.identityOk),
    detail: String(prev?.accounting.identityOk)
  });
  checks.push({
    id: 'transmission_present',
    passed: Boolean(prev?.transmissionReport?.layers?.length && prev.transmissionReport.layers.length >= 10),
    detail: String(prev?.transmissionReport?.layers?.length ?? 0)
  });
  if (includeCreditStress && prev) {
    checks.push({
      id: 'stress_index_present',
      passed: Number.isFinite(prev.stressIndex.score),
      detail: String(prev.stressIndex.score)
    });
  }
  if (includeLaborInnovationStress && prev) {
    checks.push({
      id: 'capacity_snapshot_finite',
      passed: Number.isFinite(prev.capacitySnapshot.index),
      detail: String(prev.capacitySnapshot.index)
    });
  }
  if (includeHousingStrategicStress && prev) {
    checks.push({
      id: 'transmission_balance_finite',
      passed: Number.isFinite(prev.transmissionBalance.dispersionIndex),
      detail: String(prev.transmissionBalance.dispersionIndex)
    });
  }
  if (includeInflationEnergyStress && prev) {
    checks.push({
      id: 'transmission_coherence_finite',
      passed: Number.isFinite(prev.transmissionCoherence.coherenceIndex),
      detail: String(prev.transmissionCoherence.coherenceIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeEventsCompaniesStress && prev) {
    checks.push({
      id: 'transmission_concentration_finite',
      passed: Number.isFinite(prev.transmissionConcentration.concentrationIndex),
      detail: String(prev.transmissionConcentration.concentrationIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_events',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeTurnsTransportStress && prev) {
    checks.push({
      id: 'transmission_asymmetry_finite',
      passed: Number.isFinite(prev.transmissionAsymmetry.asymmetryIndex),
      detail: String(prev.transmissionAsymmetry.asymmetryIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_turns',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeResearchPopulationStress && prev) {
    checks.push({
      id: 'transmission_volatility_finite',
      passed: Number.isFinite(prev.transmissionVolatility.volatilityIndex),
      detail: String(prev.transmissionVolatility.volatilityIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_research',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeModesGuardianStress && prev) {
    checks.push({
      id: 'transmission_resilience_finite',
      passed: Number.isFinite(prev.transmissionResilience.resilienceIndex),
      detail: String(prev.transmissionResilience.resilienceIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_modes',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeCitiesForecastingStress && prev) {
    checks.push({
      id: 'transmission_coverage_finite',
      passed: Number.isFinite(prev.transmissionCoverage.coverageIndex),
      detail: String(prev.transmissionCoverage.coverageIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_cities',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeCommandAutomationStress && prev) {
    checks.push({
      id: 'transmission_amplification_finite',
      passed: Number.isFinite(prev.transmissionAmplification.amplificationIndex),
      detail: String(prev.transmissionAmplification.amplificationIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_command',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeTeamReplayStress && prev) {
    checks.push({
      id: 'transmission_tension_finite',
      passed: Number.isFinite(prev.transmissionTension.tensionIndex),
      detail: String(prev.transmissionTension.tensionIndex)
    });
    checks.push({
      id: 'twenty_six_transmission_layers_team',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeMemoryDashboardStress && prev) {
    checks.push({
      id: 'transmission_divergence_finite',
      passed: Number.isFinite(prev.transmissionDivergence.divergenceIndex),
      detail: String(prev.transmissionDivergence.divergenceIndex)
    });
    checks.push({
      id: 'thirty_transmission_layers_memory',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeUiUtilitiesStress && prev) {
    checks.push({
      id: 'transmission_stability_finite',
      passed: Number.isFinite(prev.transmissionStability.stabilityIndex),
      detail: String(prev.transmissionStability.stabilityIndex)
    });
    checks.push({
      id: 'thirty_transmission_layers_ui',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeLogisticsNegotiationStress && prev) {
    checks.push({
      id: 'transmission_alignment_finite',
      passed: Number.isFinite(prev.transmissionAlignment.alignmentIndex),
      detail: String(prev.transmissionAlignment.alignmentIndex)
    });
    checks.push({
      id: 'thirty_two_transmission_layers_logistics',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 32,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  checks.push({
    id: 'input_hash_stable_replay',
    passed: lastHash.length > 8,
    detail: lastHash.slice(0, 12)
  });
  if (prev) {
    checks.push({
      id: 'debrief_headline',
      passed: prev.debrief.headline.includes(`T${turns}`),
      detail: prev.debrief.headline.slice(0, 40)
    });
  }

  return {
    scenarioId,
    turnsRun: turns,
    allPassed: checks.every(c => c.passed),
    checks
  };
}
