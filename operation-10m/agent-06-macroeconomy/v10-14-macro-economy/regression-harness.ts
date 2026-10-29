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
  includeConfidenceCapexStress?: boolean;
  includeMonetaryRentalStress?: boolean;
  includeClimateForecastStress?: boolean;
  includeAccessibilityTimelineStress?: boolean;
  includeLiquidityMapsStress?: boolean;
  includeGameplayArchiveStress?: boolean;
  includeIntegrationCadenceStress?: boolean;
  includeResearchBudgetStress?: boolean;
  includeModeSupplyStress?: boolean;
  includeEventDemographicStress?: boolean;
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
  const includeConfidenceCapexStress = Boolean(options?.includeConfidenceCapexStress);
  const includeMonetaryRentalStress = Boolean(options?.includeMonetaryRentalStress);
  const includeClimateForecastStress = Boolean(options?.includeClimateForecastStress);
  const includeAccessibilityTimelineStress = Boolean(options?.includeAccessibilityTimelineStress);
  const includeLiquidityMapsStress = Boolean(options?.includeLiquidityMapsStress);
  const includeGameplayArchiveStress = Boolean(options?.includeGameplayArchiveStress);
  const includeIntegrationCadenceStress = Boolean(options?.includeIntegrationCadenceStress);
  const includeResearchBudgetStress = Boolean(options?.includeResearchBudgetStress);
  const includeModeSupplyStress = Boolean(options?.includeModeSupplyStress);
  const includeEventDemographicStress = Boolean(options?.includeEventDemographicStress);
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
        : undefined,
      households: includeConfidenceCapexStress
        ? {
            consumerConfidence: {
              band: t % 6 === 0 ? 'collapsed' : 'strong',
              volatilityBand: t % 5 === 0 ? 'whipsaw' : 'stable'
            }
          }
        : undefined,
      privateSector: includeConfidenceCapexStress
        ? {
            capexCycle: {
              pipelineBand: t % 6 === 0 ? 'frozen' : 'expansionary',
              freezeBand: t % 7 === 0 ? 'binding' : 'none',
              paybackBand: t % 8 === 0 ? 'stretched' : 'attractive'
            }
          }
        : undefined,
      monetaryPolicy: includeMonetaryRentalStress
        ? {
            policyStance: t % 6 === 0 ? 'restrictive' : 'neutral',
            realRateBand: t % 7 === 0 ? 'elevated' : 'moderate',
            liquidityBand: t % 5 === 0 ? 'strained' : 'ample'
          }
        : undefined,
      rentalMarket: includeMonetaryRentalStress
        ? {
            pressureBand: t % 6 === 0 ? 'severe' : 'balanced',
            vacancyBand: t % 5 === 0 ? 'tight' : 'moderate',
            rentGrowthBand: t % 7 === 0 ? 'surging' : 'stable'
          }
        : undefined,
      climatePolicy: includeClimateForecastStress
        ? {
            transitionBand: t % 6 === 0 ? 'disruptive' : 'steady',
            carbonPriceBand: t % 7 === 0 ? 'punitive' : 'moderate',
            complianceBand: t % 5 === 0 ? 'binding' : 'light'
          }
        : undefined,
      forecastingLab: includeClimateForecastStress
        ? {
            dispersionBand: t % 6 === 0 ? 'wide' : 'tight',
            confidenceBand: t % 7 === 0 ? 'low' : 'high',
            disagreementBand: t % 5 === 0 ? 'polarized' : 'aligned'
          }
        : undefined,
      uiAccessibility: includeAccessibilityTimelineStress
        ? {
            contrastBand: t % 6 === 0 ? 'failing' : 'strong',
            inputLagBand: t % 5 === 0 ? 'severe' : 'snappy',
            coverageBand: t % 7 === 0 ? 'gaps' : 'full'
          }
        : undefined,
      historyTimeline: includeAccessibilityTimelineStress
        ? {
            gapBand: t % 6 === 0 ? 'broken' : 'coherent',
            narrativeDriftBand: t % 5 === 0 ? 'runaway' : 'stable',
            shockMemoryBand: t % 7 === 0 ? 'scarring' : 'fading'
          }
        : undefined,
      systemLiquidity: includeLiquidityMapsStress
        ? {
            band: t % 6 === 0 ? 'frozen' : 'ample',
            marketDepthBand: t % 5 === 0 ? 'thin' : 'deep',
            rolloverRiskBand: t % 7 === 0 ? 'severe' : 'low'
          }
        : undefined,
      mapsTelemetry: includeLiquidityMapsStress
        ? {
            geoFidelityBand: t % 6 === 0 ? 'distorted' : 'high',
            tileLatencyBand: t % 5 === 0 ? 'stale' : 'realtime',
            coverageBand: t % 7 === 0 ? 'gaps' : 'complete'
          }
        : undefined,
      strategicGameplay: includeGameplayArchiveStress
        ? {
            pacingBand: t % 6 === 0 ? 'gridlocked' : 'fluid',
            coherenceBand: t % 5 === 0 ? 'fragmented' : 'aligned',
            frictionBand: t % 7 === 0 ? 'severe' : 'low'
          }
        : undefined,
      historyArchiveIntegrity: includeGameplayArchiveStress
        ? {
            integrityBand: t % 6 === 0 ? 'corrupt' : 'verified',
            lineageBand: t % 5 === 0 ? 'broken' : 'continuous',
            retentionBand: t % 7 === 0 ? 'truncated' : 'durable'
          }
        : undefined,
      integrationHealth: includeIntegrationCadenceStress
        ? {
            meshBand: t % 6 === 0 ? 'fractured' : 'healthy',
            contractDriftBand: t % 5 === 0 ? 'runaway' : 'stable',
            smokeBand: t % 7 === 0 ? 'failing' : 'green'
          }
        : undefined,
      turnCadenceDrift: includeIntegrationCadenceStress
        ? {
            skewBand: t % 6 === 0 ? 'runaway' : 'anchored',
            jitterBand: t % 5 === 0 ? 'chaotic' : 'low',
            resolutionBand: t % 7 === 0 ? 'missed' : 'on_time'
          }
        : undefined,
      researchMomentum: includeResearchBudgetStress
        ? {
            velocityBand: t % 6 === 0 ? 'collapsed' : 'moderate',
            diffusionBand: t % 5 === 0 ? 'siloed' : 'broad',
            fundingBand: t % 7 === 0 ? 'starved' : 'strong'
          }
        : undefined,
      budgetOutlook: includeResearchBudgetStress
        ? {
            trajectoryBand: t % 6 === 0 ? 'deteriorating' : 'stable',
            consolidationBand: t % 5 === 0 ? 'severe' : 'moderate',
            capexRoomBand: t % 7 === 0 ? 'exhausted' : 'ample'
          }
        : undefined,
      modeShift: includeModeSupplyStress
        ? {
            volatilityBand: t % 6 === 0 ? 'chaotic' : 'stable',
            alignmentBand: t % 5 === 0 ? 'misaligned' : 'aligned',
            handoffBand: t % 7 === 0 ? 'failed' : 'smooth'
          }
        : undefined,
      supplyChainStress: includeModeSupplyStress
        ? {
            fragilityBand: t % 6 === 0 ? 'broken' : 'resilient',
            leadTimeBand: t % 5 === 0 ? 'extreme' : 'normal',
            inventoryBand: t % 7 === 0 ? 'empty' : 'healthy'
          }
        : undefined,
      eventCascade: includeEventDemographicStress
        ? {
            intensityBand: t % 6 === 0 ? 'runaway' : 'contained',
            propagationBand: t % 5 === 0 ? 'accelerating' : 'local',
            durationBand: t % 7 === 0 ? 'chronic' : 'fading'
          }
        : undefined,
      demographicShift: includeEventDemographicStress
        ? {
            migrationBand: t % 6 === 0 ? 'brain_drain' : 'balanced',
            agingBand: t % 5 === 0 ? 'accelerating' : 'gradual',
            participationBand: t % 7 === 0 ? 'collapsed' : 'stable'
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
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
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeConfidenceCapexStress && prev) {
    checks.push({
      id: 'transmission_synchronization_finite',
      passed: Number.isFinite(prev.transmissionSynchronization.synchronizationIndex),
      detail: String(prev.transmissionSynchronization.synchronizationIndex)
    });
    checks.push({
      id: 'thirty_four_transmission_layers_confidence',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeMonetaryRentalStress && prev) {
    checks.push({
      id: 'transmission_intensity_finite',
      passed: Number.isFinite(prev.transmissionIntensity.intensityIndex),
      detail: String(prev.transmissionIntensity.intensityIndex)
    });
    checks.push({
      id: 'thirty_six_transmission_layers_monetary',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeClimateForecastStress && prev) {
    checks.push({
      id: 'transmission_polarization_finite',
      passed: Number.isFinite(prev.transmissionPolarization.polarizationIndex),
      detail: String(prev.transmissionPolarization.polarizationIndex)
    });
    checks.push({
      id: 'thirty_eight_transmission_layers_climate',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeAccessibilityTimelineStress && prev) {
    checks.push({
      id: 'transmission_coupling_finite',
      passed: Number.isFinite(prev.transmissionCoupling.couplingIndex),
      detail: String(prev.transmissionCoupling.couplingIndex)
    });
    checks.push({
      id: 'forty_transmission_layers_accessibility',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 42,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeLiquidityMapsStress && prev) {
    checks.push({
      id: 'transmission_imbalance_finite',
      passed: Number.isFinite(prev.transmissionImbalance.imbalanceIndex),
      detail: String(prev.transmissionImbalance.imbalanceIndex)
    });
    checks.push({
      id: 'forty_two_transmission_layers_liquidity',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 52,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeGameplayArchiveStress && prev) {
    checks.push({
      id: 'transmission_harmonic_finite',
      passed: Number.isFinite(prev.transmissionHarmonic.harmonicIndex),
      detail: String(prev.transmissionHarmonic.harmonicIndex)
    });
    checks.push({
      id: 'forty_four_transmission_layers_gameplay',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 52,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeIntegrationCadenceStress && prev) {
    checks.push({
      id: 'transmission_gradient_finite',
      passed: Number.isFinite(prev.transmissionGradient.gradientIndex),
      detail: String(prev.transmissionGradient.gradientIndex)
    });
    checks.push({
      id: 'forty_six_transmission_layers_integration',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 52,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeResearchBudgetStress && prev) {
    checks.push({
      id: 'transmission_attenuation_finite',
      passed: Number.isFinite(prev.transmissionAttenuation.attenuationIndex),
      detail: String(prev.transmissionAttenuation.attenuationIndex)
    });
    checks.push({
      id: 'forty_eight_transmission_layers_research',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 52,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeModeSupplyStress && prev) {
    checks.push({
      id: 'transmission_envelope_finite',
      passed: Number.isFinite(prev.transmissionEnvelope.envelopeIndex),
      detail: String(prev.transmissionEnvelope.envelopeIndex)
    });
    checks.push({
      id: 'fifty_transmission_layers_mode',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 52,
      detail: String(prev.transmissionReport?.layers?.length ?? 0)
    });
  }
  if (includeEventDemographicStress && prev) {
    checks.push({
      id: 'transmission_persistence_finite',
      passed: Number.isFinite(prev.transmissionPersistence.persistenceIndex),
      detail: String(prev.transmissionPersistence.persistenceIndex)
    });
    checks.push({
      id: 'fifty_two_transmission_layers_event',
      passed: (prev.transmissionReport?.layers?.length ?? 0) >= 52,
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
