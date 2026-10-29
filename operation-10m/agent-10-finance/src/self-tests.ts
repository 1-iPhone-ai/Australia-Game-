import { V1014_FINSTAB_CORE_REGIONS, V1014_FINSTAB_LIMITS, V1014_FINSTAB_SCHEMA_VERSION } from './definitions/constants.js';
import {
  computeNationalMacroFinancialConditions,
  createInitialMacroFinancialPersisted,
  macroFinancialEconomyCostMultiplier,
  macroFinancialInputHash,
  macroFinancialLoanSpreadMultiplier,
  makeDefaultMacroFinancialTestInputs,
  sanitizeMacroFinancialPersisted,
  buildMacroFinancialInputs,
} from './compute/national-macro-financial.js';
import {
  detectMacroFinancialQuery,
  macroFinancialActionAlignment,
  macroFinancialGuardianWarning,
  macroFinancialWorldRoots,
  answerMacroFinancialQuestion,
} from './integration/query-co-pilot.js';
import { evaluatePolicyTransmissionChannels, sumActiveTransmissionWeight } from './transmission/channels.js';
import { applyMacroCostOfLivingToEconomyLayer, compareInflationBands } from './inflation/pass-through.js';
import { quoteAdvancedLoanPricing, refinanceTimingSignal } from './credit/loan-pricing.js';
import { runFinancialShockSequence } from './shocks/scenario-runner.js';
import { referencePolicyRate } from './rates/reference-rate.js';
import { stepResourceMarketPriceDeterministic, cycleMarketTrendDeterministic } from './prices/market-dynamics.js';
import { assessInvestmentClimateLink } from './investment/climate-link.js';
import {
  validateNationalMacroFinancialState,
  auditModifierIntegrity,
  dedupeMacroFinancialEvidence,
} from './persistence/validate-state.js';
import { simulateMacroFinancialTurns, detectSimulationStressSpiral } from './integration/regression-harness.js';
import {
  applyMacroFinancialScenarioPreset,
  getMacroFinancialScenarioPreset,
  MACRO_FINANCIAL_SCENARIO_PRESETS,
} from './catalog/fiscal-inflation-scenarios.js';
import { exportMacroFinancialSaveBridge, importMacroFinancialSaveBridge } from './integration/save-bridge.js';
import { effectiveTierLoanRate } from './credit/tier-spreads.js';
import { assessWagePriceSpiral, wageSpiralInflationScoreAdjustment } from './inflation/wage-price-spiral.js';
import { recommendMonetaryStance, stanceDriftTowardRecommendation } from './rates/monetary-reaction.js';
import { decomposeMacroCpiBasket, macroCpiBasketWeightSum } from './inflation/cpi-basket.js';
import { stepInflationExpectations, initialInflationAnchoringScore } from './inflation/expectations-anchor.js';
import { mergeAgent06IntoMacroFinancialInputs, agent06BridgeIntegrationNote } from './integration/agent06-macro-bridge.js';
import { projectInflationForecastPath } from './integration/inflation-forecast.js';
import { assessPhillipsSlack, phillipsSlackInflationScoreAdjustment } from './inflation/phillips-slack.js';
import { computeCoreHeadlineSpread } from './inflation/core-headline-spread.js';
import { classifyInflationShockDrivers } from './inflation/supply-demand-shock.js';
import { assessFiscalDominance } from './fiscal/fiscal-dominance.js';
import { assessInflationTargetBreach, inflationScoreToImpliedTargetPercent } from './rates/inflation-target-breach.js';
import {
  stepInflationRegimeTracker,
  createInitialInflationRegimeTracker,
  inflationRegimePersistenceHalfLifeTurns,
} from './integration/inflation-regime-tracker.js';
import { buildAgent21InflationForecastBundle, agent21ForecastBridgeIntegrationNote } from './integration/agent21-forecast-bridge.js';
import { assessRealRateGap, realRateGapTighteningBias } from './rates/real-rate-gap.js';
import {
  createInitialInflationMomentumState,
  stepInflationMomentum,
  inflationMomentumInflationScoreNudge,
} from './inflation/inflation-momentum.js';
import { estimateDisinflationSacrifice } from './inflation/disinflation-sacrifice.js';
import { assessCreditInflationFeedback } from './credit/credit-inflation-feedback.js';
import {
  mergeAgent07IntoMacroFinancialInputs,
  agent07FiscalBridgeIntegrationNote,
} from './integration/agent07-fiscal-bridge.js';
import {
  mergeAgent09IntoMacroFinancialInputs,
  agent09HouseholdBridgeIntegrationNote,
} from './integration/agent09-household-bridge.js';
import {
  assessImportPricePassThrough,
  importPassThroughInflationScoreAdjustment,
} from './inflation/import-price-pass-through.js';
import {
  assessTermPremiumInflationSignal,
  termPremiumTighteningBias,
} from './rates/term-premium-inflation-signal.js';
import {
  assessEnergyPricePassThrough,
  energyPassThroughInflationScoreAdjustment,
} from './inflation/energy-price-pass-through.js';
import {
  assessShelterRentInflation,
  shelterRentInflationScoreAdjustment,
} from './inflation/shelter-rent-inflation.js';
import {
  mergeAgent15IntoMacroFinancialInputs,
  agent15TradeBridgeIntegrationNote,
} from './integration/agent15-trade-bridge.js';
import {
  mergeAgent08IntoMacroFinancialInputs,
  agent08CorporateBridgeIntegrationNote,
} from './integration/agent08-corporate-bridge.js';
import {
  mergeAgent11IntoMacroFinancialInputs,
  agent11CitiesBridgeIntegrationNote,
} from './integration/agent11-cities-bridge.js';
import {
  mergeAgent13IntoMacroFinancialInputs,
  agent13EnergyBridgeIntegrationNote,
} from './integration/agent13-energy-bridge.js';
import {
  assessFoodGroceryPassThrough,
  foodGroceryPassThroughInflationScoreAdjustment,
} from './inflation/food-grocery-pass-through.js';
import {
  assessTransportLogisticsInflation,
  transportLogisticsInflationScoreAdjustment,
} from './inflation/transport-logistics-inflation.js';
import {
  mergeAgent14IntoMacroFinancialInputs,
  agent14HousingBridgeIntegrationNote,
} from './integration/agent14-housing-bridge.js';
import {
  mergeAgent12IntoMacroFinancialInputs,
  agent12TransportBridgeIntegrationNote,
} from './integration/agent12-transport-bridge.js';
import {
  assessHealthcareServicesInflation,
  healthcareServicesInflationScoreAdjustment,
} from './inflation/healthcare-services-inflation.js';
import {
  assessInsurancePremiumPassThrough,
  insurancePremiumPassThroughInflationScoreAdjustment,
} from './inflation/insurance-premium-pass-through.js';
import {
  mergeAgent03IntoMacroFinancialInputs,
  agent03ResearchBridgeIntegrationNote,
} from './integration/agent03-research-bridge.js';
import {
  mergeAgent05IntoMacroFinancialInputs,
  agent05EventsBridgeIntegrationNote,
} from './integration/agent05-events-bridge.js';
import {
  assessEducationTuitionInflation,
  educationTuitionInflationScoreAdjustment,
} from './inflation/education-tuition-inflation.js';
import {
  assessCommunicationsServicesInflation,
  communicationsServicesInflationScoreAdjustment,
} from './inflation/communications-services-inflation.js';
import {
  mergeAgent04IntoMacroFinancialInputs,
  agent04ModesBridgeIntegrationNote,
} from './integration/agent04-modes-bridge.js';
import {
  mergeAgent16IntoMacroFinancialInputs,
  agent16GuardianBridgeIntegrationNote,
} from './integration/agent16-guardian-bridge.js';
import {
  assessRecreationLeisureInflation,
  recreationLeisureInflationScoreAdjustment,
} from './inflation/recreation-leisure-inflation.js';
import {
  assessProfessionalServicesFeeInflation,
  professionalServicesFeeInflationScoreAdjustment,
} from './inflation/professional-services-fee-inflation.js';
import {
  mergeAgent17IntoMacroFinancialInputs,
  agent17CommandBridgeIntegrationNote,
} from './integration/agent17-command-bridge.js';
import {
  mergeAgent18IntoMacroFinancialInputs,
  agent18TeamBridgeIntegrationNote,
} from './integration/agent18-team-bridge.js';
import {
  assessChildcareServicesInflation,
  childcareServicesInflationScoreAdjustment,
} from './inflation/childcare-services-inflation.js';
import {
  assessGovernmentChargesInflation,
  governmentChargesInflationScoreAdjustment,
} from './inflation/government-charges-inflation.js';
import {
  mergeAgent02IntoMacroFinancialInputs,
  agent02TurnsBridgeIntegrationNote,
} from './integration/agent02-turns-bridge.js';
import {
  mergeAgent20IntoMacroFinancialInputs,
  agent20AutomationBridgeIntegrationNote,
} from './integration/agent20-automation-bridge.js';
import {
  assessWaterUtilitiesInflation,
  waterUtilitiesInflationScoreAdjustment,
} from './inflation/water-utilities-inflation.js';
import {
  assessDomesticTravelInflation,
  domesticTravelInflationScoreAdjustment,
} from './inflation/domestic-travel-inflation.js';
import {
  mergeAgent01IntoMacroFinancialInputs,
  agent01StrategicBridgeIntegrationNote,
} from './integration/agent01-strategic-bridge.js';
import {
  mergeAgent19IntoMacroFinancialInputs,
  agent19MemoryBridgeIntegrationNote,
} from './integration/agent19-memory-bridge.js';
import {
  assessConstructionMaterialsInflation,
  constructionMaterialsInflationScoreAdjustment,
} from './inflation/construction-materials-inflation.js';
import {
  assessRetailTradeMarginInflation,
  retailTradeMarginInflationScoreAdjustment,
} from './inflation/retail-trade-margin-inflation.js';
import {
  assessFinancialServicesFeeInflation,
  financialServicesFeeInflationScoreAdjustment,
} from './inflation/financial-services-fee-inflation.js';
import {
  assessAgriculturalFarmgateInflation,
  agriculturalFarmgateInflationScoreAdjustment,
} from './inflation/agricultural-farmgate-inflation.js';
import {
  assessPublicUtilitiesGridTariffInflation,
  publicUtilitiesGridTariffInflationScoreAdjustment,
} from './inflation/public-utilities-grid-tariff-inflation.js';
import {
  assessUiInflationSaliencePassThrough,
  uiInflationSaliencePassThroughScoreAdjustment,
} from './inflation/ui-inflation-salience-pass-through.js';
import {
  assessHousingMortgageEssentialInflation,
  housingMortgageEssentialInflationScoreAdjustment,
} from './inflation/housing-mortgage-essential-inflation.js';
import {
  assessMacroTransmissionMergeInflation,
  macroTransmissionMergeInflationScoreAdjustment,
} from './inflation/macro-transmission-merge-inflation.js';
import {
  assessDynamicEventsInflationSpillover,
  dynamicEventsInflationSpilloverScoreAdjustment,
} from './inflation/dynamic-events-inflation-spillover.js';
import {
  assessDashboardMapInflationOverlay,
  dashboardMapInflationOverlayScoreAdjustment,
} from './inflation/dashboard-map-inflation-overlay.js';
import {
  assessPublicFinanceDebtServiceInflation,
  publicFinanceDebtServiceInflationScoreAdjustment,
} from './inflation/public-finance-debt-service-inflation.js';
import {
  assessPopulationLaborWageInflation,
  populationLaborWageInflationScoreAdjustment,
} from './inflation/population-labor-wage-inflation.js';
import {
  assessWholesaleEnergyTransitionInflation,
  wholesaleEnergyTransitionInflationScoreAdjustment,
} from './inflation/wholesale-energy-transition-inflation.js';
import {
  assessUrbanRentDispersionInflation,
  urbanRentDispersionInflationScoreAdjustment,
} from './inflation/urban-rent-dispersion-inflation.js';
import {
  assessCorporatePricingPassThroughInflation,
  corporatePricingPassThroughInflationScoreAdjustment,
} from './inflation/corporate-pricing-pass-through-inflation.js';
import {
  assessTradeExchangeImportInflation,
  tradeExchangeImportInflationScoreAdjustment,
} from './inflation/trade-exchange-import-inflation.js';
import {
  assessGuardianInflationInterventionInflation,
  guardianInflationInterventionScoreAdjustment,
} from './inflation/guardian-inflation-intervention-inflation.js';
import {
  assessTeamIntelligenceConsensusInflation,
  teamIntelligenceConsensusInflationScoreAdjustment,
} from './inflation/team-intelligence-consensus-inflation.js';
import {
  assessStrategicGeopoliticalInflationPremium,
  strategicGeopoliticalInflationPremiumScoreAdjustment,
} from './inflation/strategic-geopolitical-inflation-premium.js';
import {
  assessAiMemoryInflationRecallInflation,
  aiMemoryInflationRecallScoreAdjustment,
} from './inflation/ai-memory-inflation-recall-inflation.js';
import {
  assessCalendarSeasonInflationCarryover,
  calendarSeasonInflationCarryoverScoreAdjustment,
} from './inflation/calendar-season-inflation-carryover.js';
import {
  assessAutomationAutopilotInflationDrift,
  automationAutopilotInflationDriftScoreAdjustment,
} from './inflation/automation-autopilot-inflation-drift.js';
import {
  assessResearchProductivityInflationOffset,
  researchProductivityInflationOffsetScoreAdjustment,
} from './inflation/research-productivity-inflation-offset.js';
import {
  assessScenarioSandboxInflationBias,
  scenarioSandboxInflationBiasScoreAdjustment,
} from './inflation/scenario-sandbox-inflation-bias.js';
import {
  assessEventsNarrativeInflationPersistence,
  eventsNarrativeInflationPersistenceScoreAdjustment,
} from './inflation/events-narrative-inflation-persistence.js';
import {
  assessMacroDemandOverheatInflationSlippage,
  macroDemandOverheatInflationSlippageScoreAdjustment,
} from './inflation/macro-demand-overheat-inflation-slippage.js';
import {
  assessFreightLogisticsInflationCongestion,
  freightLogisticsInflationCongestionScoreAdjustment,
} from './inflation/freight-logistics-inflation-congestion.js';
import {
  assessHousingWellbeingInflationEssentialStress,
  housingWellbeingInflationEssentialStressScoreAdjustment,
} from './inflation/housing-wellbeing-inflation-essential-stress.js';
import {
  assessCommandCenterInflationFusionEscalation,
  commandCenterInflationFusionEscalationScoreAdjustment,
} from './inflation/command-center-inflation-fusion-escalation.js';
import {
  assessUiPlayerInflationSalienceNudge,
  uiPlayerInflationSalienceNudgeScoreAdjustment,
} from './inflation/ui-player-inflation-salience-nudge.js';
import {
  assessFiscalIndexationInflationAnchorBreach,
  fiscalIndexationInflationAnchorBreachScoreAdjustment,
} from './inflation/fiscal-indexation-inflation-anchor-breach.js';
import {
  assessHouseholdWageInflationDeanchoring,
  householdWageInflationDeanchoringScoreAdjustment,
} from './inflation/household-wage-inflation-deanchoring.js';
import {
  assessCorporateMarkupInflationCascade,
  corporateMarkupInflationCascadeScoreAdjustment,
} from './inflation/corporate-markup-inflation-cascade.js';
import {
  assessTradeTariffImportInflationPipeline,
  tradeTariffImportInflationPipelineScoreAdjustment,
} from './inflation/trade-tariff-import-inflation-pipeline.js';
import {
  assessMetroUrbanRentInflationSurge,
  metroUrbanRentInflationSurgeScoreAdjustment,
} from './inflation/metro-urban-rent-inflation-surge.js';
import {
  assessWholesaleGridEnergyInflationCascade,
  wholesaleGridEnergyInflationCascadeScoreAdjustment,
} from './inflation/wholesale-grid-energy-inflation-cascade.js';
import {
  assessGuardianGuardrailInflationEscalation,
  guardianGuardrailInflationEscalationScoreAdjustment,
} from './inflation/guardian-guardrail-inflation-escalation.js';
import {
  assessTeamConsensusInflationBriefingDrift,
  teamConsensusInflationBriefingDriftScoreAdjustment,
} from './inflation/team-consensus-inflation-briefing-drift.js';
import {
  assessMemoryCommonwealthInflationRecallGate,
  memoryCommonwealthInflationRecallGateScoreAdjustment,
} from './inflation/memory-commonwealth-inflation-recall-gate.js';
import {
  assessAutomationSynthesisInflationCascadeDrift,
  automationSynthesisInflationCascadeDriftScoreAdjustment,
} from './inflation/automation-synthesis-inflation-cascade-drift.js';
import {
  mergeAgent22IntoMacroFinancialInputs,
  agent22UiBridgeIntegrationNote,
} from './integration/agent22-ui-bridge.js';
import {
  mergeAgent23IntoMacroFinancialInputs,
  agent23DashboardsBridgeIntegrationNote,
} from './integration/agent23-dashboards-bridge.js';

export function runAgent10FinanceSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const check = (id: string, name: string, ok: boolean, detail = 'ok') =>
    results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });

  check('a10_t01', 'schema version', createInitialMacroFinancialPersisted().schemaVersion === V1014_FINSTAB_SCHEMA_VERSION);
  check('a10_t02', 'sanitize null', sanitizeMacroFinancialPersisted(null) === null);
  check(
    'a10_t03',
    'default compute',
    !!computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state,
  );
  check(
    'a10_t04',
    'high inflation cost mult',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ highInflationScenario: true }), null, null)
      .state.modifiers.costOfLivingMultiplier > 1.1,
  );
  check(
    'a10_t05',
    'credit shock spread',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ creditShockActive: true }), null, null)
      .state.modifiers.creditSpreadMultiplier > 1.05,
  );
  check(
    'a10_t06',
    'hash stable',
    macroFinancialInputHash(makeDefaultMacroFinancialTestInputs()) ===
      macroFinancialInputHash(makeDefaultMacroFinancialTestInputs()),
  );
  check(
    'a10_t07',
    'hash turn delta',
    macroFinancialInputHash(makeDefaultMacroFinancialTestInputs({ turn: 1 })) !==
      macroFinancialInputHash(makeDefaultMacroFinancialTestInputs({ turn: 2 })),
  );
  check('a10_t08', 'economy mult off', macroFinancialEconomyCostMultiplier(null) === 1);
  check('a10_t09', 'loan spread off', macroFinancialLoanSpreadMultiplier(undefined) === 1);
  check('a10_t10', 'detect stability', detectMacroFinancialQuery('How is financial stability?')?.topic === 'stability');
  check('a10_t11', 'detect credit', detectMacroFinancialQuery('Are credit conditions tight?')?.topic === 'credit');
  check(
    'a10_t12',
    'detect inflation not commodity',
    detectMacroFinancialQuery('inflation and cost of living')?.topic === 'inflation',
  );
  check(
    'a10_t13',
    'commodity query excluded',
    detectMacroFinancialQuery('commodity inflation prices')?.topic !== 'inflation' ||
      detectMacroFinancialQuery('commodity inflation prices') === null,
  );

  const frozenState = {
    ...computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ creditShockActive: true, fiscalPressure: 'critical', actorCreditStressIndex: 0.9 }),
      null,
      null,
    ).state,
    credit: 'frozen' as const,
  };
  check(
    'a10_t14',
    'alignment loans frozen',
    (macroFinancialActionAlignment(frozenState, { category: 'loans_and_credit' })?.scoreDelta ?? 0) <= 0,
  );
  check(
    'a10_t15',
    'guardian frozen credit',
    !!macroFinancialGuardianWarning(frozenState, { category: 'loans_and_credit' }),
  );
  check(
    'a10_t16',
    'world roots disabled',
    macroFinancialWorldRoots(false, [{ id: 'x', turn: 1, kind: 'k', significance: 'minor', title: 't', summary: 's', dedupeKey: 'd' }])
      .length === 0,
  );
  check(
    'a10_t17',
    'world roots enabled',
    macroFinancialWorldRoots(true, [{ id: 'x', turn: 1, kind: 'k', significance: 'minor', title: 't', summary: 's', dedupeKey: 'd' }])
      .length === 1,
  );
  check(
    'a10_t18',
    'scenario id inflation',
    buildMacroFinancialInputs({ turn: 3, gameSettings: { selectedScenarioId: 'high_inflation' } }).highInflationScenario === true,
  );
  check(
    'a10_t19',
    'non-CPI note',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state.integrationNotes.some((n) =>
      n.includes('commodity'),
    ),
  );
  check(
    'a10_t20',
    'regional spreads count',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state.regionalSpreads.length ===
      V1014_FINSTAB_CORE_REGIONS.length,
  );

  const hits = evaluatePolicyTransmissionChannels(makeDefaultMacroFinancialTestInputs({ fiscalPressure: 'critical' }));
  check('a10_t21', 'transmission fiscal active', hits.some((h) => h.id === 'fiscal_strain_tightens_credit' && h.active));
  check(
    'a10_t22',
    'transmission credit weight',
    sumActiveTransmissionWeight(hits, 'credit') >= 1,
  );

  check(
    'a10_t23',
    'economy layer cost apply',
    applyMacroCostOfLivingToEconomyLayer(100, 1.2) === 120,
  );
  check(
    'a10_t24',
    'inflation band order',
    compareInflationBands('elevated', 'anchored') > 0,
  );

  const st = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state;
  const quote = quoteAdvancedLoanPricing(0.1, st.modifiers.creditSpreadMultiplier, st.credit, st.modifiers.loanAffordabilityIndex);
  check('a10_t25', 'loan quote effective', quote.effectiveRate > 0 && quote.effectiveRate <= 1);

  check('a10_t26', 'refinance defer frozen', refinanceTimingSignal('frozen', 0.2) === 'defer');
  check('a10_t27', 'refinance favorable', refinanceTimingSignal('accommodative', 0.3) === 'favorable');

  const seq = runFinancialShockSequence({ inflation: 50, credit: 55, stability: 60 }, [
    'shock_credit_tightening',
    'shock_household_cost_surge',
    'bogus_id',
  ]);
  check('a10_t28', 'shock sequence applied', seq.appliedShockIds.length === 2);
  check('a10_t29', 'shock sequence skip', seq.skippedShockIds.includes('bogus_id'));
  check('a10_t30', 'shock sequence flag', seq.creditShockActive === true);

  check(
    'a10_t31',
    'reference rate tight > easy',
    referencePolicyRate('tightening', 'restricted') > referencePolicyRate('neutral', 'accommodative'),
  );

  check(
    'a10_t32',
    'answer shapes',
    !!answerMacroFinancialQuestion(st, 'macro financial overview').fact,
  );

  check(
    'a10_t33',
    'evidence bounded',
    computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ highInflationScenario: true, creditShockActive: true, fiscalPressure: 'critical' }),
      null,
      null,
    ).state.evidence.length <= V1014_FINSTAB_LIMITS.maxEvidence,
  );

  check(
    'a10_t34',
    'investment risk cap',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state.modifiers.investmentRiskPremium <=
      0.35,
  );

  check(
    'a10_t35',
    'cached hash reuse',
    (() => {
      const p = createInitialMacroFinancialPersisted();
      const inp = makeDefaultMacroFinancialTestInputs();
      p.lastInputHash = macroFinancialInputHash(inp);
      const prev = computeNationalMacroFinancialConditions(inp, p, null).state;
      const r = computeNationalMacroFinancialConditions(inp, p, prev);
      return r.state === prev;
    })(),
  );

  for (let i = 0; i < 15; i++) {
    const turn = i + 1;
    const r = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ turn }), null, null);
    check(
      `a10_t${36 + i}`,
      `turn ${turn} revision`,
      r.state.revision >= 1 && r.state.turn === turn,
    );
  }

  // --- Round 3 scale wave ---
  {
    const step = stepResourceMarketPriceDeterministic({
      resource: 'Gold',
      basePrice: 150,
      currentPrice: 180,
      trend: 'falling',
      randCentered: 0,
    });
    check('a10_r3_01', 'market step mean reversion', step.nextPrice < 180);
  }
  check(
    'a10_r3_02',
    'trend cycle deterministic',
    cycleMarketTrendDeterministic(4, 'stable', 0.5) === 'stable' || cycleMarketTrendDeterministic(4, '', 0.5) === 'rising',
  );
  {
    const link = assessInvestmentClimateLink('expansionary', 'accommodative', 'anchored');
    check('a10_r3_03', 'investment link ready', link.readinessScore >= 70 && !link.deferMegaproject);
  }
  {
    const link = assessInvestmentClimateLink('crisis_defensive', 'frozen', 'scenario_runaway');
    check('a10_r3_04', 'investment link defer', link.deferMegaproject);
  }
  {
    const st = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state;
    check('a10_r3_05', 'validate clean state', validateNationalMacroFinancialState(st).every((i) => i.severity !== 'error'));
    check('a10_r3_06', 'audit modifiers', auditModifierIntegrity(st));
  }
  {
    const sim = simulateMacroFinancialTurns(12, (turn, base) =>
      turn >= 8 ? { ...base, creditShockActive: true, fiscalPressure: 'critical' } : base,
    );
    check('a10_r3_07', 'simulation rows', sim.rows.length === 12);
    check('a10_r3_08', 'stress spiral detect', detectSimulationStressSpiral(sim.rows));
  }
  {
    const st = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state;
    const duped = dedupeMacroFinancialEvidence([...st.evidence, ...st.evidence]);
    check('a10_r3_09', 'evidence dedupe', duped.length <= st.evidence.length);
  }
  check(
    'a10_r3_10',
    'regional spread NSW',
    computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).state.regionalSpreads.some((r) => r.regionId === 'NSW'),
  );

  check('a10_r3b_01', 'scenario preset count', MACRO_FINANCIAL_SCENARIO_PRESETS.length >= 9);
  check(
    'a10_r3b_02',
    'apply credit shock preset',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'credit_shock_stack');
      return inp?.creditShockActive === true && inp.fiscalPressure === 'strained';
    })(),
  );
  check('a10_r3b_03', 'unknown preset null', applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'nope') === null);
  check(
    'a10_r3b_04',
    'high infl preset raises cost',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'high_inflation_pass_through');
      if (!inp) return false;
      const r = computeNationalMacroFinancialConditions(inp, null, null);
      return r.state.modifiers.costOfLivingMultiplier > 1.05;
    })(),
  );
  {
    const p = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).persisted;
    const bridge = exportMacroFinancialSaveBridge(p);
    const back = importMacroFinancialSaveBridge(bridge);
    check('a10_r3b_05', 'save bridge round-trip', back?.persisted.lastCreditBand === p.lastCreditBand);
  }
  check(
    'a10_r3b_06',
    'tier rate frozen credit',
    effectiveTierLoanRate('standard', 0.1, 1.2, 'frozen') > effectiveTierLoanRate('standard', 0.1, 1.2, 'accommodative'),
  );
  check('a10_r3b_07', 'get preset by id', getMacroFinancialScenarioPreset('liquidity_crisis')?.tags.includes('liquidity'));

  // --- Round 4 scale wave ---
  check('a10_r4_01', 'CPI basket weights sum', Math.abs(macroCpiBasketWeightSum() - 1) < 0.001);
  {
    const cpi = decomposeMacroCpiBasket('elevated', 5, 0.07);
    check('a10_r4_02', 'CPI decompose excludes commodity', cpi.excludesCommodityQuotes === true && cpi.headlineIndex > 100);
  }
  {
    const spiral = assessWagePriceSpiral({
      inflationBand: 'high',
      householdAffordability: 'severe_pressure',
      fiscalPressure: 'critical',
      wageGrowthPressureScore: 70,
      turn: 3,
    });
    check('a10_r4_03', 'wage spiral elevated+', spiral.spiralRisk === 'elevated' || spiral.spiralRisk === 'critical');
    check('a10_r4_04', 'wage spiral delta', wageSpiralInflationScoreAdjustment(spiral) > 0);
  }
  {
    const rec = recommendMonetaryStance({
      inflationBand: 'high',
      creditBand: 'tight',
      inflationScore: 78,
      creditScore: 48,
    });
    check('a10_r4_05', 'monetary reaction tighten', rec.recommendedStance === 'tightening' || rec.recommendedStance === 'restrictive');
    check(
      'a10_r4_06',
      'stance drift',
      stanceDriftTowardRecommendation('neutral', rec.recommendedStance, 2) !== 'neutral' ||
        rec.recommendedStance === 'neutral',
    );
  }
  {
    const exp = stepInflationExpectations({
      currentBand: 'high',
      priorAnchoringScore: initialInflationAnchoringScore(),
      fiscalPressure: 'critical',
      highInflationScenario: true,
      turn: 2,
    });
    check('a10_r4_07', 'expectations deanchor risk', exp.deanchoringRisk !== 'low');
  }
  {
    const merged = mergeAgent06IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 4,
      gdpGrowthBand: 'contraction',
      unemploymentBand: 'severe',
      outputGap: -0.04,
      nominalDemandPressure: 0.5,
    });
    check('a10_r4_08', 'agent06 bridge merge', (merged.inflationSettingMultiplier ?? 1) > 1 && merged.fiscalPressure !== 'healthy');
    check('a10_r4_09', 'agent06 bridge note', agent06BridgeIntegrationNote().includes('commodity'));
  }
  {
    const path = projectInflationForecastPath(8);
    check('a10_r4_10', 'forecast path rows', path.points.length === 8);
    check('a10_r4_11', 'forecast max cost', path.maxCostMultiplier >= 1);
  }
  check(
    'a10_r4_12',
    'round4 preset wage',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'wage_spiral_services');
      return inp?.householdAffordability === 'severe_pressure' && inp.highInflationScenario === true;
    })(),
  );

  // --- Round 5 scale wave ---
  {
    const ph = assessPhillipsSlack('elevated', {
      turn: 2,
      gdpGrowthBand: 'strong',
      unemploymentBand: 'low',
      outputGap: 0.05,
      nominalDemandPressure: 0.55,
    });
    check('a10_r5_01', 'phillips overheated', ph.slackBand === 'overheated');
    check('a10_r5_02', 'phillips delta positive', phillipsSlackInflationScoreAdjustment(ph) > 0);
  }
  {
    const spread = computeCoreHeadlineSpread('high', 4, 0.05);
    check('a10_r5_03', 'core headline spread', spread.headlineIndex > 0 && spread.coreIndex > 0);
  }
  {
    const shock = classifyInflationShockDrivers(
      'high',
      makeDefaultMacroFinancialTestInputs({ highInflationScenario: true, inflationSettingMultiplier: 1.3 }),
      {
        turn: 1,
        gdpGrowthBand: 'strong',
        unemploymentBand: 'low',
        outputGap: 0.04,
        nominalDemandPressure: 0.6,
      },
    );
    check('a10_r5_04', 'shock driver demand or mixed', shock.driver === 'demand_pull' || shock.driver === 'mixed');
  }
  {
    const dom = assessFiscalDominance(makeDefaultMacroFinancialTestInputs({ fiscalPressure: 'critical', sovereignDebtPressure: 'high' }));
    check('a10_r5_05', 'fiscal dominance elevated+', dom.band === 'elevated' || dom.band === 'dominant');
  }
  {
    const breach = assessInflationTargetBreach(82);
    check('a10_r5_06', 'target breach above', breach.side === 'above' && breach.breachSeverity !== 'none');
    check('a10_r5_07', 'implied target percent', inflationScoreToImpliedTargetPercent(50) > 2);
  }
  {
    let reg = createInitialInflationRegimeTracker();
    reg = stepInflationRegimeTracker(reg, 1, 'elevated');
    reg = stepInflationRegimeTracker(reg, 2, 'elevated');
    reg = stepInflationRegimeTracker(reg, 3, 'elevated');
    check('a10_r5_08', 'regime streak', reg.bandStreak === 3);
    check('a10_r5_09', 'persistence half life', inflationRegimePersistenceHalfLifeTurns(reg.persistenceScore) >= 2);
  }
  {
    const path = projectInflationForecastPath(4);
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('anchored', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(52),
    });
    check('a10_r5_10', 'agent21 bundle schema', bundle.schemaVersion === '10.14.agent10.r34');
    check('a10_r5_11', 'forecast core index', path.points.every((p) => p.coreCpiIndex > 0));
  }
  check(
    'a10_r5_12',
    'round5 preset fiscal dominance',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'fiscal_dominance_inflation');
      return inp?.fiscalPressure === 'critical' && inp.sovereignDebtPressure === 'high';
    })(),
  );
  check('a10_r5_13', 'agent21 bridge note', agent21ForecastBridgeIntegrationNote().includes('Agent 21'));

  // --- Round 6 scale wave ---
  {
    const gap = assessRealRateGap(82, 'accommodative', 'high');
    check('a10_r6_01', 'real rate gap negative when hot', gap.gapBand === 'negative' || gap.gapBand === 'deeply_negative');
    check('a10_r6_02', 'real rate tightening bias', realRateGapTighteningBias(gap) > 0);
  }
  {
    let mom = createInitialInflationMomentumState();
    let snap = stepInflationMomentum(mom, 1, 'anchored').snapshot;
    const stepped = stepInflationMomentum(stepInflationMomentum(mom, 1, 'anchored').state, 2, 'elevated');
    snap = stepped.snapshot;
    check('a10_r6_03', 'momentum accelerating', snap.direction === 'accelerating' || snap.bandDelta > 0);
    check('a10_r6_04', 'momentum nudge', inflationMomentumInflationScoreNudge(snap) >= 0);
  }
  {
    const sacrifice = estimateDisinflationSacrifice('high', 78, null);
    check('a10_r6_05', 'disinflation sacrifice ratio', sacrifice.sacrificeRatio >= 0.5);
    check('a10_r6_06', 'turns to anchor', sacrifice.turnsToAnchor >= 2);
  }
  {
    const fb = assessCreditInflationFeedback('high', 'restricted', true);
    check('a10_r6_07', 'credit inflation vicious or amplifying', fb.feedbackLoop === 'vicious' || fb.feedbackLoop === 'amplifying');
  }
  {
    const merged07 = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      consolidatedDeficitBand: 'large_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'critical',
    });
    check('a10_r6_08', 'agent07 fiscal merge', merged07.fiscalPressure === 'critical');
    check('a10_r6_09', 'agent07 bridge note', agent07FiscalBridgeIntegrationNote().includes('Agent 07'));
  }
  {
    const merged09 = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'steady',
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
    });
    check('a10_r6_10', 'agent09 household merge', merged09.householdAffordability === 'severe_pressure');
    check('a10_r6_11', 'agent09 bridge note', agent09HouseholdBridgeIntegrationNote().includes('Agent 09'));
  }
  {
    const path = projectInflationForecastPath(4);
    check('a10_r6_12', 'forecast momentum fields', path.points.every((p) => p.momentumScore >= 0 && !!p.momentumDirection));
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(60),
      momentum: path.points[path.points.length - 1]
        ? {
            turn: path.points[path.points.length - 1].turn,
            momentumScore: path.points[path.points.length - 1].momentumScore,
            direction: path.points[path.points.length - 1].momentumDirection,
            bandDelta: 0,
            streakTurns: 1,
          }
        : null,
      realRateGap: assessRealRateGap(60, 'neutral', 'elevated'),
      creditFeedback: assessCreditInflationFeedback('elevated', 'neutral', false),
    });
    check('a10_r6_13', 'agent21 r6 fields', bundle.realRateGapBand !== undefined && bundle.creditInflationFeedback !== undefined);
  }
  check(
    'a10_r6_14',
    'round6 preset vicious loop',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'credit_inflation_vicious_loop');
      return inp?.creditShockActive === true && inp.householdInflationScenarioActive === true;
    })(),
  );

  // --- Round 7 scale wave ---
  {
    const imp = assessImportPricePassThrough({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.5,
      inflationBand: 'high',
      turn: 3,
    });
    check('a10_r7_01', 'import pass-through strong or surge', imp.passThroughBand === 'strong' || imp.passThroughBand === 'surge');
    check('a10_r7_02', 'import score adj', importPassThroughInflationScoreAdjustment(imp.passThroughBand) >= 4);
  }
  {
    const term = assessTermPremiumInflationSignal({
      inflationBand: 'scenario_runaway',
      fiscalPressure: 'critical',
      sovereignDebtPressure: 'critical',
      highInflationScenario: true,
    });
    check('a10_r7_03', 'term premium stress', term.signalBand === 'stress' || term.signalBand === 'unanchored');
    check('a10_r7_04', 'term tightening bias', termPremiumTighteningBias(term) > 0);
  }
  {
    const merged15 = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.42,
    });
    check('a10_r7_05', 'agent15 trade merge', merged15.highInflationScenario === true);
    check('a10_r7_06', 'agent15 bridge note', agent15TradeBridgeIntegrationNote().includes('Agent 15'));
  }
  {
    const merged08 = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      pricingPowerBand: 'dominant',
      marginCompression: 'none',
      passThroughIntent: 'full',
    });
    check('a10_r7_07', 'agent08 corporate merge', (merged08.inflationSettingMultiplier ?? 1) > 1.05);
    check('a10_r7_08', 'agent08 bridge note', agent08CorporateBridgeIntegrationNote().includes('Agent 08'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r7_09',
      'forecast import and term fields',
      path.points.every((p) => !!p.importPassThroughBand && !!p.termPremiumSignalBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r7_10',
      'agent21 r7 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalImportPassThrough !== undefined &&
        bundle.terminalTermPremiumSignal !== undefined,
    );
  }
  check(
    'a10_r7_11',
    'round7 preset import shock',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'import_shock_pass_through');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.2;
    })(),
  );
  check(
    'a10_r7_12',
    'round7 preset term premium',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'term_premium_fiscal_stress');
      return inp?.fiscalPressure === 'critical' && inp.sovereignDebtPressure === 'critical';
    })(),
  );
  check(
    'a10_r7_13',
    'round7 preset corporate pricing',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_pricing_power_spike');
      return (inp?.inflationSettingMultiplier ?? 1) > 1.3;
    })(),
  );

  // --- Round 8 scale wave ---
  {
    const energy = assessEnergyPricePassThrough({
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r8_01', 'energy pass-through sharp or crisis', energy.passThroughBand === 'sharp' || energy.passThroughBand === 'crisis');
    check('a10_r8_02', 'energy score adj', energyPassThroughInflationScoreAdjustment(energy.passThroughBand) >= 3);
  }
  {
    const shelter = assessShelterRentInflation({
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r8_03', 'shelter rent hot or overheated', shelter.pressureBand === 'hot' || shelter.pressureBand === 'overheated');
    check('a10_r8_04', 'shelter score adj', shelterRentInflationScoreAdjustment(shelter.pressureBand) >= 3);
  }
  {
    const merged11 = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.62,
    });
    check('a10_r8_05', 'agent11 cities merge', merged11.householdInflationScenarioActive === true);
    check('a10_r8_06', 'agent11 bridge note', agent11CitiesBridgeIntegrationNote().includes('Agent 11'));
  }
  {
    const merged13 = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
    });
    check('a10_r8_07', 'agent13 energy merge', merged13.highInflationScenario === true);
    check('a10_r8_08', 'agent13 bridge note', agent13EnergyBridgeIntegrationNote().includes('Agent 13'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r8_09',
      'forecast energy and shelter fields',
      path.points.every((p) => !!p.energyPassThroughBand && !!p.shelterRentPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r8_10',
      'agent21 r8 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalEnergyPassThrough !== undefined &&
        bundle.terminalShelterRentPressure !== undefined,
    );
  }
  check(
    'a10_r8_11',
    'round8 preset energy grid crisis',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'energy_grid_crisis_pass_through');
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r8_12',
    'round8 preset urban shelter',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'urban_shelter_rent_overheat');
      return inp?.householdAffordability === 'severe_pressure' && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r8_13',
    'round8 preset energy transition',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'energy_transition_cost_stack');
      return inp?.fiscalPressure === 'critical' && (inp.inflationSettingMultiplier ?? 1) > 1.15;
    })(),
  );

  // --- Round 9 scale wave ---
  {
    const food = assessFoodGroceryPassThrough({
      harvestStressBand: 'severe',
      retailMarginPressure: 'high',
      supplyChainDisruption: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r9_01',
      'food grocery sharp or supply shock',
      food.passThroughBand === 'sharp' || food.passThroughBand === 'supply_shock',
    );
    check('a10_r9_02', 'food score adj', foodGroceryPassThroughInflationScoreAdjustment(food.passThroughBand) >= 3);
  }
  {
    const transport = assessTransportLogisticsInflation({
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      inflationBand: 'elevated',
      turn: 3,
    });
    check(
      'a10_r9_03',
      'transport bottleneck or crisis',
      transport.pressureBand === 'bottleneck' || transport.pressureBand === 'crisis',
    );
    check('a10_r9_04', 'transport score adj', transportLogisticsInflationScoreAdjustment(transport.pressureBand) >= 3);
  }
  {
    const merged14 = mergeAgent14IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      essentialServicesInflationFlag: true,
    });
    check('a10_r9_05', 'agent14 housing merge', merged14.householdInflationScenarioActive === true);
    check('a10_r9_06', 'agent14 bridge note', agent14HousingBridgeIntegrationNote().includes('Agent 14'));
  }
  {
    const merged12 = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      logisticsInflationScenarioActive: true,
    });
    check('a10_r9_07', 'agent12 transport merge', merged12.highInflationScenario === true);
    check('a10_r9_08', 'agent12 bridge note', agent12TransportBridgeIntegrationNote().includes('Agent 12'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r9_09',
      'forecast food and transport fields',
      path.points.every((p) => !!p.foodGroceryPassThroughBand && !!p.transportLogisticsPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r9_10',
      'agent21 r9 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalFoodGroceryPassThrough !== undefined &&
        bundle.terminalTransportLogisticsPressure !== undefined,
    );
  }
  check(
    'a10_r9_11',
    'round9 preset food supply chain',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'food_supply_chain_shock');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r9_12',
    'round9 preset transport freight',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'transport_freight_bottleneck');
      return inp?.systemicLiquidityBand === 'critical' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r9_13',
    'round9 preset housing wellbeing',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'housing_wellbeing_cost_stack');
      return inp?.householdAffordability === 'severe_pressure' && inp.householdInflationScenarioActive === true;
    })(),
  );

  // --- Round 10 scale wave ---
  {
    const healthcare = assessHealthcareServicesInflation({
      wagePressureBand: 'acute',
      demandSurgeActive: true,
      workforceShortageBand: 'severe',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r10_01',
      'healthcare stressed or crisis',
      healthcare.pressureBand === 'stressed' || healthcare.pressureBand === 'crisis',
    );
    check('a10_r10_02', 'healthcare score adj', healthcareServicesInflationScoreAdjustment(healthcare.pressureBand) >= 3);
  }
  {
    const insurance = assessInsurancePremiumPassThrough({
      claimsInflationBand: 'extreme',
      reinsuranceStress: true,
      catastropheLoadActive: true,
      inflationBand: 'elevated',
      turn: 3,
    });
    check(
      'a10_r10_03',
      'insurance sharp or hard market',
      insurance.passThroughBand === 'sharp' || insurance.passThroughBand === 'hard_market',
    );
    check('a10_r10_04', 'insurance score adj', insurancePremiumPassThroughInflationScoreAdjustment(insurance.passThroughBand) >= 3);
  }
  {
    const merged03 = mergeAgent03IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      productivityGainBand: 'strong',
      supplySideReliefActive: true,
      innovationInflationOffsetScore: 0.62,
    });
    check('a10_r10_05', 'agent03 research merge offset', (merged03.inflationSettingMultiplier ?? 1) < 1);
    check('a10_r10_06', 'agent03 bridge note', agent03ResearchBridgeIntegrationNote().includes('Agent 03'));
  }
  {
    const merged05 = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
    });
    check('a10_r10_07', 'agent05 events merge', merged05.highInflationScenario === true);
    check('a10_r10_08', 'agent05 bridge note', agent05EventsBridgeIntegrationNote().includes('Agent 05'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r10_09',
      'forecast healthcare and insurance fields',
      path.points.every((p) => !!p.healthcareServicesPressureBand && !!p.insurancePremiumPassThroughBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r10_10',
      'agent21 r10 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalHealthcareServicesPressure !== undefined &&
        bundle.terminalInsurancePremiumPassThrough !== undefined,
    );
  }
  check(
    'a10_r10_11',
    'round10 preset healthcare workforce',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'healthcare_workforce_crisis');
      return inp?.fiscalPressure === 'critical' && (inp.activeCrises ?? 0) >= 2;
    })(),
  );
  check(
    'a10_r10_12',
    'round10 preset insurance hard market',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'insurance_hard_market_stack');
      return inp?.creditShockActive === true && (inp.inflationSettingMultiplier ?? 1) > 1.2;
    })(),
  );
  check(
    'a10_r10_13',
    'round10 preset research vs event shock',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'research_offset_vs_event_shock');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 11 scale wave ---
  {
    const education = assessEducationTuitionInflation({
      enrollmentPressureBand: 'high',
      subsidyCutActive: true,
      wageIndexationBand: 'strong',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r11_01',
      'education sharp or crisis',
      education.pressureBand === 'sharp' || education.pressureBand === 'crisis',
    );
    check('a10_r11_02', 'education score adj', educationTuitionInflationScoreAdjustment(education.pressureBand) >= 3);
  }
  {
    const comms = assessCommunicationsServicesInflation({
      bandwidthDemandBand: 'extreme',
      regulatedTariffShock: true,
      platformFeePassThrough: 'high',
      inflationBand: 'elevated',
      turn: 3,
    });
    check(
      'a10_r11_03',
      'comms elevated or spike',
      comms.pressureBand === 'elevated' || comms.pressureBand === 'spike',
    );
    check('a10_r11_04', 'comms score adj', communicationsServicesInflationScoreAdjustment(comms.pressureBand) >= 3);
  }
  {
    const merged04 = mergeAgent04IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      scenarioInflationBias: 'extreme',
      sandboxStressModeActive: true,
      difficultyCostMultiplier: 1.15,
    });
    check('a10_r11_05', 'agent04 modes merge', merged04.highInflationScenario === true);
    check('a10_r11_06', 'agent04 bridge note', agent04ModesBridgeIntegrationNote().includes('Agent 04'));
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
    });
    check('a10_r11_07', 'agent16 guardian merge', merged16.highInflationScenario === true);
    check('a10_r11_08', 'agent16 bridge note', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r11_09',
      'forecast education and comms fields',
      path.points.every((p) => !!p.educationTuitionPressureBand && !!p.communicationsServicesPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r11_10',
      'agent21 r11 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalEducationTuitionPressure !== undefined &&
        bundle.terminalCommunicationsServicesPressure !== undefined,
    );
  }
  check(
    'a10_r11_11',
    'round11 preset education subsidy',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'education_subsidy_cut_stack');
      return inp?.fiscalPressure === 'critical' && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r11_12',
    'round11 preset comms tariff',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'comms_tariff_platform_spike');
      return inp?.systemicLiquidityBand === 'critical' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r11_13',
    'round11 preset modes extreme',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'modes_extreme_inflation_sandbox');
      return (inp?.inflationSettingMultiplier ?? 1) > 1.3 && inp.publicStability === 38;
    })(),
  );

  // --- Round 12 scale wave ---
  {
    const leisure = assessRecreationLeisureInflation({
      tourismDemandBand: 'surge',
      laborCostPassThrough: 'high',
      discretionarySpendPressure: true,
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r12_01', 'recreation hot or boom', leisure.pressureBand === 'hot' || leisure.pressureBand === 'boom');
    check('a10_r12_02', 'recreation score adj', recreationLeisureInflationScoreAdjustment(leisure.pressureBand) >= 3);
  }
  {
    const prof = assessProfessionalServicesFeeInflation({
      billingRatePressure: 'extreme',
      complianceCostStack: true,
      corporateDemandBand: 'strong',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r12_03', 'professional sharp or squeeze', prof.feeBand === 'sharp' || prof.feeBand === 'squeeze');
    check('a10_r12_04', 'professional score adj', professionalServicesFeeInflationScoreAdjustment(prof.feeBand) >= 3);
  }
  {
    const merged17 = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      macroAlertLevel: 'red',
      inflationFusionScore: 0.78,
      coordinatedTighteningSuggested: true,
    });
    check('a10_r12_05', 'agent17 command merge', merged17.highInflationScenario === true);
    check('a10_r12_06', 'agent17 bridge note', agent17CommandBridgeIntegrationNote().includes('Agent 17'));
  }
  {
    const merged18 = mergeAgent18IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.82,
    });
    check('a10_r12_07', 'agent18 team merge', merged18.highInflationScenario === true);
    check('a10_r12_08', 'agent18 bridge note', agent18TeamBridgeIntegrationNote().includes('Agent 18'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r12_09',
      'forecast recreation and professional fields',
      path.points.every((p) => !!p.recreationLeisurePressureBand && !!p.professionalServicesFeeBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r12_10',
      'agent21 r12 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalRecreationLeisurePressure !== undefined &&
        bundle.terminalProfessionalServicesFee !== undefined,
    );
  }
  check(
    'a10_r12_11',
    'round12 preset tourism leisure',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'tourism_leisure_boom_pass_through');
      return inp?.householdInflationScenarioActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r12_12',
    'round12 preset professional fees',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'professional_fee_compliance_stack');
      return inp?.fiscalPressure === 'critical' && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r12_13',
    'round12 preset command team brief',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'command_team_upside_risk_brief');
      return (inp?.inflationSettingMultiplier ?? 1) > 1.28 && (inp.activeCrises ?? 0) >= 2;
    })(),
  );

  // --- Round 13 scale wave ---
  {
    const childcare = assessChildcareServicesInflation({
      capacityShortageBand: 'severe',
      wageAwardPassThrough: 'strong',
      subsidyIndexationLag: true,
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r13_01', 'childcare sharp or crisis', childcare.pressureBand === 'sharp' || childcare.pressureBand === 'crisis');
    check('a10_r13_02', 'childcare score adj', childcareServicesInflationScoreAdjustment(childcare.pressureBand) >= 3);
  }
  {
    const gov = assessGovernmentChargesInflation({
      feeIndexationBand: 'above_cpi',
      newLevyStackActive: true,
      localGovernmentPressure: 'high',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r13_03', 'gov charges elevated or step_up', gov.pressureBand === 'elevated' || gov.pressureBand === 'step_up');
    check('a10_r13_04', 'gov score adj', governmentChargesInflationScoreAdjustment(gov.pressureBand) >= 3);
  }
  {
    const merged02 = mergeAgent02IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      calendarSeasonBand: 'peak_demand',
      policyReviewWindowOpen: true,
      multiTurnInflationCarryover: 0.22,
    });
    check('a10_r13_05', 'agent02 turns merge', (merged02.inflationSettingMultiplier ?? 1) > 1.05);
    check('a10_r13_06', 'agent02 bridge note', agent02TurnsBridgeIntegrationNote().includes('Agent 02'));
  }
  {
    const merged20 = mergeAgent20IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.3,
    });
    check('a10_r13_07', 'agent20 automation merge', merged20.highInflationScenario === true);
    check('a10_r13_08', 'agent20 bridge note', agent20AutomationBridgeIntegrationNote().includes('Agent 20'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r13_09',
      'forecast childcare and gov fields',
      path.points.every((p) => !!p.childcareServicesPressureBand && !!p.governmentChargesPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r13_10',
      'agent21 r13 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalChildcareServicesPressure !== undefined &&
        bundle.terminalGovernmentChargesPressure !== undefined,
    );
  }
  check(
    'a10_r13_11',
    'round13 preset childcare capacity',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'childcare_capacity_award_stack');
      return inp?.householdAffordability === 'severe_pressure' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r13_12',
    'round13 preset gov levy step',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'government_levy_indexation_step');
      return inp?.fiscalPressure === 'critical' && (inp.inflationSettingMultiplier ?? 1) > 1.2;
    })(),
  );
  check(
    'a10_r13_13',
    'round13 preset turns automation drift',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'turns_automation_inflation_drift');
      return inp?.creditShockActive === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 14 scale wave ---
  {
    const water = assessWaterUtilitiesInflation({
      droughtStressBand: 'severe',
      infrastructureTariffShock: true,
      recyclingCostPassThrough: 'high',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r14_01', 'water sharp or drought crisis', water.pressureBand === 'sharp' || water.pressureBand === 'drought_crisis');
    check('a10_r14_02', 'water score adj', waterUtilitiesInflationScoreAdjustment(water.pressureBand) >= 3);
  }
  {
    const travel = assessDomesticTravelInflation({
      routeCapacityBand: 'constrained',
      fuelSurchargePassThrough: true,
      accommodationOccupancyBand: 'full',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r14_03', 'travel hot or overheated', travel.pressureBand === 'hot' || travel.pressureBand === 'overheated');
    check('a10_r14_04', 'travel score adj', domesticTravelInflationScoreAdjustment(travel.pressureBand) >= 3);
  }
  {
    const merged01 = mergeAgent01IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      nationalPriorityInflationBias: 'expansionary',
      strategicStockpileStress: true,
      geopoliticalRiskPremium: 0.72,
    });
    check('a10_r14_05', 'agent01 strategic merge', merged01.highInflationScenario === true);
    check('a10_r14_06', 'agent01 bridge note', agent01StrategicBridgeIntegrationNote().includes('Agent 01'));
  }
  {
    const merged19 = mergeAgent19IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      recalledInflationRegimeConfidence: 0.82,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: true,
    });
    check('a10_r14_07', 'agent19 memory merge', merged19.highInflationScenario === true);
    check('a10_r14_08', 'agent19 bridge note', agent19MemoryBridgeIntegrationNote().includes('Agent 19'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r14_09',
      'forecast water and travel fields',
      path.points.every((p) => !!p.waterUtilitiesPressureBand && !!p.domesticTravelPressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r14_10',
      'agent21 r14 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalWaterUtilitiesPressure !== undefined &&
        bundle.terminalDomesticTravelPressure !== undefined,
    );
  }
  check(
    'a10_r14_11',
    'round14 preset water drought',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'water_drought_utility_crisis');
      return inp?.systemicLiquidityBand === 'critical' && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r14_12',
    'round14 preset domestic travel',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'domestic_travel_capacity_overheat');
      return inp?.householdInflationScenarioActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r14_13',
    'round14 preset strategic memory drift',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'strategic_memory_inflation_drift');
      return (inp?.inflationSettingMultiplier ?? 1) > 1.28 && inp.creditShockActive === true;
    })(),
  );

  // --- Round 15 scale wave ---
  {
    const materials = assessConstructionMaterialsInflation({
      supplyChainStressBand: 'severe',
      laborShortagePassThrough: true,
      importContentShare: 0.35,
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r15_01', 'materials sharp or supply crunch', materials.pressureBand === 'sharp' || materials.pressureBand === 'supply_crunch');
    check('a10_r15_02', 'materials score adj', constructionMaterialsInflationScoreAdjustment(materials.pressureBand) >= 3);
  }
  {
    const retail = assessRetailTradeMarginInflation({
      discountingIntensity: 'light',
      inventoryClearanceActive: false,
      wageBillPressure: 'high',
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r15_03', 'retail expanding or price_led', retail.marginBand === 'expanding' || retail.marginBand === 'price_led');
    check('a10_r15_04', 'retail score adj', retailTradeMarginInflationScoreAdjustment(retail.marginBand) >= 3);
  }
  {
    const merged22 = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
    });
    check('a10_r15_05', 'agent22 ui merge', merged22.householdInflationScenarioActive === true);
    check('a10_r15_06', 'agent22 bridge note', agent22UiBridgeIntegrationNote().includes('Agent 22'));
  }
  {
    const merged23 = mergeAgent23IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.78,
      dashboardRefreshUrgency: 'critical',
    });
    check('a10_r15_07', 'agent23 dashboards merge', merged23.highInflationScenario === true);
    check('a10_r15_08', 'agent23 bridge note', agent23DashboardsBridgeIntegrationNote().includes('Agent 23'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r15_09',
      'forecast construction and retail fields',
      path.points.every((p) => !!p.constructionMaterialsPressureBand && !!p.retailTradeMarginBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r15_10',
      'agent21 r15 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalConstructionMaterialsPressure !== undefined &&
        bundle.terminalRetailTradeMargin !== undefined,
    );
  }
  check(
    'a10_r15_11',
    'round15 preset construction crunch',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'construction_materials_supply_crunch');
      return inp?.creditShockActive === true && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r15_12',
    'round15 preset retail price led',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'retail_margin_price_led_shelf');
      return inp?.householdAffordability === 'severe_pressure' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r15_13',
    'round15 preset dashboard heatmap',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'dashboard_regional_heatmap_alert');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 16 scale wave ---
  {
    const fees = assessFinancialServicesFeeInflation({
      fundingCostPassThrough: 'high',
      complianceCostStackActive: true,
      depositRateCompetitionBand: 'intense',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r16_01', 'financial fees elevated or shock', fees.feeBand === 'elevated' || fees.feeBand === 'fee_shock');
    check('a10_r16_02', 'financial fees score adj', financialServicesFeeInflationScoreAdjustment(fees.feeBand) >= 3);
  }
  {
    const farmgate = assessAgriculturalFarmgateInflation({
      harvestStressBand: 'severe',
      transportToMarketBand: 'critical',
      inputCostPassThrough: true,
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r16_03', 'farmgate sharp or harvest crisis', farmgate.pressureBand === 'sharp' || farmgate.pressureBand === 'harvest_crisis');
    check('a10_r16_04', 'farmgate score adj', agriculturalFarmgateInflationScoreAdjustment(farmgate.pressureBand) >= 3);
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'advisory',
      narrativeShockSeverity: 'medium',
      financialServicesFeeShockActive: true,
    });
    check('a10_r16_05', 'agent16 fee shock merge', merged16.creditShockActive === true && merged16.highInflationScenario === true);
    check('a10_r16_06', 'agent16 bridge note', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  {
    const merged17 = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAlertLevel: 'red',
      inflationFusionScore: 0.8,
      coordinatedTighteningSuggested: true,
      farmgateSupplyAlertActive: true,
    });
    check('a10_r16_07', 'agent17 farmgate merge', merged17.householdInflationScenarioActive === true);
    check('a10_r16_08', 'agent17 bridge note', agent17CommandBridgeIntegrationNote().includes('Agent 17'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r16_09',
      'forecast financial and farmgate fields',
      path.points.every((p) => !!p.financialServicesFeeBand && !!p.agriculturalFarmgatePressureBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r16_10',
      'agent21 r16 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalFinancialServicesFee !== undefined &&
        bundle.terminalAgriculturalFarmgatePressure !== undefined,
    );
  }
  check(
    'a10_r16_11',
    'round16 preset financial fee shock',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'financial_services_fee_shock');
      return inp?.creditShockActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r16_12',
    'round16 preset farmgate harvest',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'agricultural_farmgate_harvest_stress');
      return inp?.householdInflationScenarioActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r16_13',
    'round16 preset command red alert',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'command_fusion_red_farmgate_alert');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 17 scale wave ---
  {
    const grid = assessPublicUtilitiesGridTariffInflation({
      serviceReliabilityBand: 'fragile',
      outageRiskBand: 'rolling',
      capacityMarginBand: 'thin',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r17_01', 'grid elevated or shock', grid.tariffBand === 'elevated' || grid.tariffBand === 'grid_shock');
    check('a10_r17_02', 'grid score adj', publicUtilitiesGridTariffInflationScoreAdjustment(grid.tariffBand) >= 3);
  }
  {
    const salience = assessUiInflationSaliencePassThrough({
      dashboardStressHighlight: true,
      playerAttentionBand: 'high',
      uiExpectationsNudgeUp: true,
      phaseShellCoachActive: true,
      inflationBand: 'elevated',
      turn: 3,
    });
    check('a10_r17_03', 'ui salient or shock', salience.salienceBand === 'salient' || salience.salienceBand === 'attention_shock');
    check('a10_r17_04', 'ui score adj', uiInflationSaliencePassThroughScoreAdjustment(salience.salienceBand) >= 3);
  }
  {
    const merged12 = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      freightCapacityBand: 'tight',
      fuelSurchargeActive: false,
      portBacklogBand: 'moderate',
      logisticsInflationScenarioActive: false,
      utilitiesGridCapacityMarginThin: true,
      utilitiesOutageBandSevere: true,
    });
    check('a10_r17_05', 'agent12 utilities merge', merged12.highInflationScenario === true && merged12.systemicLiquidityBand === 'critical');
    check('a10_r17_06', 'agent12 bridge note', agent12TransportBridgeIntegrationNote().includes('Agent 12'));
  }
  {
    const merged22 = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
      utilitiesStressBannerActive: true,
      phaseShellCostOfLivingCoachActive: true,
    });
    check('a10_r17_07', 'agent22 ui utilities merge', merged22.householdInflationScenarioActive === true);
    check('a10_r17_08', 'agent22 bridge note', agent22UiBridgeIntegrationNote().includes('Agent 22'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r17_09',
      'forecast grid and ui salience fields',
      path.points.every((p) => !!p.publicUtilitiesGridTariffBand && !!p.uiInflationSalienceBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r17_10',
      'agent21 r17 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalPublicUtilitiesGridTariff !== undefined &&
        bundle.terminalUiInflationSalience !== undefined,
    );
  }
  check(
    'a10_r17_11',
    'round17 preset grid tariff stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'public_utilities_grid_tariff_stack');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r17_12',
    'round17 preset ui salience',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'ui_inflation_salience_stress');
      return inp?.householdInflationScenarioActive === true && inp.householdAffordability === 'severe_pressure';
    })(),
  );
  check(
    'a10_r17_13',
    'round17 preset ui utilities fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'ui_utilities_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.25;
    })(),
  );

  // --- Round 18 scale wave ---
  {
    const essential = assessHousingMortgageEssentialInflation({
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      essentialServicesInflationFlag: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r18_01',
      'housing essential elevated or shock',
      essential.essentialBand === 'elevated' || essential.essentialBand === 'services_shock',
    );
    check('a10_r18_02', 'housing essential score adj', housingMortgageEssentialInflationScoreAdjustment(essential.essentialBand) >= 3);
  }
  {
    const merge = assessMacroTransmissionMergeInflation({
      transmissionStabilityFragile: true,
      macroRecoveryRankStressActive: true,
      outputGap: 0.35,
      nominalDemandPressure: 0.45,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r18_03',
      'macro merge fragile or blocked',
      merge.mergeBand === 'fragile' || merge.mergeBand === 'inline_blocked',
    );
    check('a10_r18_04', 'macro merge score adj', macroTransmissionMergeInflationScoreAdjustment(merge.mergeBand) >= 3);
  }
  {
    const merged14 = mergeAgent14IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      mortgageStressBand: 'elevated',
      wellbeingCostBand: 'strained',
      essentialServicesInflationFlag: true,
      inlineMergeTrajectoryBand: 'blocked',
      inlineActivationBoundaryCritical: true,
    });
    check('a10_r18_05', 'agent14 inline merge merge', merged14.highInflationScenario === true && merged14.householdInflationScenarioActive === true);
    check('a10_r18_06', 'agent14 bridge note', agent14HousingBridgeIntegrationNote().includes('Agent 14'));
  }
  {
    const merged06 = mergeAgent06IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      gdpGrowthBand: 'slow',
      unemploymentBand: 'moderate',
      outputGap: 0.1,
      nominalDemandPressure: 0.2,
      transmissionStabilityFragile: true,
      macroRecoveryRankStressActive: true,
    });
    check('a10_r18_07', 'agent06 transmission merge', merged06.highInflationScenario === true && merged06.systemicLiquidityBand === 'strained');
    check('a10_r18_08', 'agent06 bridge note', agent06BridgeIntegrationNote().includes('Agent 06'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r18_09',
      'forecast housing essential and macro merge fields',
      path.points.every((p) => !!p.housingMortgageEssentialBand && !!p.macroTransmissionMergeBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r18_10',
      'agent21 r18 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalHousingMortgageEssential !== undefined &&
        bundle.terminalMacroTransmissionMerge !== undefined,
    );
  }
  check(
    'a10_r18_11',
    'round18 preset housing essential stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'housing_mortgage_essential_stack');
      return inp?.householdAffordability === 'severe_pressure' && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r18_12',
    'round18 preset macro transmission merge',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'macro_transmission_merge_stress');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'strained';
    })(),
  );
  check(
    'a10_r18_13',
    'round18 preset housing macro fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'housing_macro_merge_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.28;
    })(),
  );

  // --- Round 19 scale wave ---
  {
    const spillover = assessDynamicEventsInflationSpillover({
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      stagedEventCostShockBand: 'cascade',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r19_01',
      'events spillover active or cascade',
      spillover.spilloverBand === 'active' || spillover.spilloverBand === 'cascade',
    );
    check('a10_r19_02', 'events spillover score adj', dynamicEventsInflationSpilloverScoreAdjustment(spillover.spilloverBand) >= 3);
  }
  {
    const overlay = assessDashboardMapInflationOverlay({
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.75,
      dashboardRefreshUrgency: 'critical',
      dashboardInflationHeatmapSevere: true,
      mapLayerCostOfLivingStressActive: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r19_03',
      'dashboard overlay severe or map critical',
      overlay.overlayBand === 'severe' || overlay.overlayBand === 'map_critical',
    );
    check('a10_r19_04', 'dashboard overlay score adj', dashboardMapInflationOverlayScoreAdjustment(overlay.overlayBand) >= 3);
  }
  {
    const merged05 = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      stagedEventCostShockBand: 'cascade',
      macroEventInflationSpilloverActive: true,
    });
    check('a10_r19_05', 'agent05 events spillover merge', merged05.highInflationScenario === true && merged05.creditShockActive === true);
    check('a10_r19_06', 'agent05 bridge note', agent05EventsBridgeIntegrationNote().includes('Agent 05'));
  }
  {
    const merged23 = mergeAgent23IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.7,
      dashboardRefreshUrgency: 'critical',
      dashboardInflationHeatmapSevere: true,
      mapLayerCostOfLivingStressActive: true,
    });
    check('a10_r19_07', 'agent23 dashboard merge', merged23.highInflationScenario === true && merged23.householdInflationScenarioActive === true);
    check('a10_r19_08', 'agent23 bridge note', agent23DashboardsBridgeIntegrationNote().includes('Agent 23'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r19_09',
      'forecast events spillover and dashboard overlay fields',
      path.points.every((p) => !!p.dynamicEventsInflationSpilloverBand && !!p.dashboardMapInflationOverlayBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r19_10',
      'agent21 r19 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalDynamicEventsInflationSpillover !== undefined &&
        bundle.terminalDashboardMapInflationOverlay !== undefined,
    );
  }
  check(
    'a10_r19_11',
    'round19 preset events spillover stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'dynamic_events_inflation_spillover_stack');
      return inp?.creditShockActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r19_12',
    'round19 preset dashboard overlay stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'dashboard_map_inflation_overlay_stress');
      return inp?.householdInflationScenarioActive === true && inp.householdAffordability === 'severe_pressure';
    })(),
  );
  check(
    'a10_r19_13',
    'round19 preset events dashboard fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'events_dashboard_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.29;
    })(),
  );

  // --- Round 20 scale wave ---
  {
    const fiscal = assessPublicFinanceDebtServiceInflation({
      consolidatedDeficitBand: 'large_deficit',
      debtServicePressure: 'critical',
      fiscalAnchorBreached: true,
      indexedChargesInflationPassThrough: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r20_01',
      'public finance elevated or dominance',
      fiscal.debtServiceBand === 'elevated' || fiscal.debtServiceBand === 'dominance_risk',
    );
    check('a10_r20_02', 'public finance score adj', publicFinanceDebtServiceInflationScoreAdjustment(fiscal.debtServiceBand) >= 3);
  }
  {
    const labor = assessPopulationLaborWageInflation({
      laborParticipationBand: 'weak',
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      participationSlackInflationBand: 'severe_slack',
      householdExpectationsDeanchoring: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r20_03',
      'population labor elevated or spiral',
      labor.wageBand === 'elevated' || labor.wageBand === 'wage_spiral',
    );
    check('a10_r20_04', 'population labor score adj', populationLaborWageInflationScoreAdjustment(labor.wageBand) >= 3);
  }
  {
    const merged07 = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      consolidatedDeficitBand: 'large_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'critical',
      fiscalAnchorBreached: true,
      indexedChargesInflationPassThrough: true,
    });
    check('a10_r20_05', 'agent07 fiscal merge', merged07.highInflationScenario === true && merged07.fiscalPressure === 'critical');
    check('a10_r20_06', 'agent07 bridge note', agent07FiscalBridgeIntegrationNote().includes('Agent 07'));
  }
  {
    const merged09 = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'steady',
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      participationSlackInflationBand: 'severe_slack',
      householdExpectationsDeanchoring: true,
    });
    check('a10_r20_07', 'agent09 labor merge', merged09.highInflationScenario === true && merged09.householdInflationScenarioActive === true);
    check('a10_r20_08', 'agent09 bridge note', agent09HouseholdBridgeIntegrationNote().includes('Agent 09'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r20_09',
      'forecast fiscal debt and labor wage fields',
      path.points.every((p) => !!p.publicFinanceDebtServiceBand && !!p.populationLaborWageBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r20_10',
      'agent21 r20 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalPublicFinanceDebtService !== undefined &&
        bundle.terminalPopulationLaborWage !== undefined,
    );
  }
  check(
    'a10_r20_11',
    'round20 preset public finance debt stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'public_finance_debt_service_stack');
      return inp?.fiscalPressure === 'critical' && inp.sovereignDebtPressure === 'critical';
    })(),
  );
  check(
    'a10_r20_12',
    'round20 preset population labor wage',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'population_labor_wage_stress');
      return inp?.highInflationScenario === true && inp.householdAffordability === 'severe_pressure';
    })(),
  );
  check(
    'a10_r20_13',
    'round20 preset fiscal labor fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'fiscal_labor_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.3;
    })(),
  );

  // --- Round 21 scale wave ---
  {
    const energy = assessWholesaleEnergyTransitionInflation({
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
      renewableShortfallInflationFlag: true,
      wholesaleCascadeBand: 'cascade',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r21_01',
      'wholesale energy elevated or shock',
      energy.transitionBand === 'elevated' || energy.transitionBand === 'transition_shock',
    );
    check('a10_r21_02', 'wholesale energy score adj', wholesaleEnergyTransitionInflationScoreAdjustment(energy.transitionBand) >= 3);
  }
  {
    const urban = assessUrbanRentDispersionInflation({
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.75,
      metroRentDispersionCritical: true,
      regionalHousingInflationSync: true,
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r21_03',
      'urban rent elevated or metro shock',
      urban.dispersionBand === 'elevated' || urban.dispersionBand === 'metro_shock',
    );
    check('a10_r21_04', 'urban rent score adj', urbanRentDispersionInflationScoreAdjustment(urban.dispersionBand) >= 3);
  }
  {
    const merged13 = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
      renewableShortfallInflationFlag: true,
      wholesaleCascadeBand: 'cascade',
    });
    check('a10_r21_05', 'agent13 energy merge', merged13.highInflationScenario === true);
    check('a10_r21_06', 'agent13 bridge note', agent13EnergyBridgeIntegrationNote().includes('Agent 13'));
  }
  {
    const merged11 = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.68,
      metroRentDispersionCritical: true,
      regionalHousingInflationSync: true,
    });
    check('a10_r21_07', 'agent11 cities merge', merged11.highInflationScenario === true && merged11.householdInflationScenarioActive === true);
    check('a10_r21_08', 'agent11 bridge note', agent11CitiesBridgeIntegrationNote().includes('Agent 11'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r21_09',
      'forecast energy transition and urban rent fields',
      path.points.every((p) => !!p.wholesaleEnergyTransitionBand && !!p.urbanRentDispersionBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r21_10',
      'agent21 r21 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalWholesaleEnergyTransition !== undefined &&
        bundle.terminalUrbanRentDispersion !== undefined,
    );
  }
  check(
    'a10_r21_11',
    'round21 preset wholesale energy stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'wholesale_energy_transition_stack');
      return inp?.systemicLiquidityBand === 'critical' && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r21_12',
    'round21 preset urban rent dispersion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'urban_rent_dispersion_stress');
      return inp?.householdAffordability === 'severe_pressure' && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r21_13',
    'round21 preset energy cities fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'energy_cities_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.31;
    })(),
  );

  // --- Round 22 scale wave ---
  {
    const corporate = assessCorporatePricingPassThroughInflation({
      pricingPowerBand: 'dominant',
      marginCompression: 'mild',
      passThroughIntent: 'full',
      productionCapacityStrainInflationFlag: true,
      corporateMarkupCascadeBand: 'active',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r22_01',
      'corporate elevated or cascade',
      corporate.passThroughBand === 'elevated' || corporate.passThroughBand === 'markup_cascade',
    );
    check('a10_r22_02', 'corporate score adj', corporatePricingPassThroughInflationScoreAdjustment(corporate.passThroughBand) >= 3);
  }
  {
    const trade = assessTradeExchangeImportInflation({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.45,
      tariffShockInflationActive: true,
      importPipelineFragileBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r22_03', 'trade elevated or fx shock', trade.importBand === 'elevated' || trade.importBand === 'fx_shock');
    check('a10_r22_04', 'trade score adj', tradeExchangeImportInflationScoreAdjustment(trade.importBand) >= 3);
  }
  {
    const merged08 = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      pricingPowerBand: 'strong',
      marginCompression: 'mild',
      passThroughIntent: 'full',
      productionCapacityStrainInflationFlag: true,
      corporateMarkupCascadeBand: 'active',
    });
    check('a10_r22_05', 'agent08 corporate merge', merged08.highInflationScenario === true);
    check('a10_r22_06', 'agent08 bridge note', agent08CorporateBridgeIntegrationNote().includes('Agent 08'));
  }
  {
    const merged15 = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.5,
      tariffShockInflationActive: true,
      importPipelineFragileBand: 'critical',
    });
    check('a10_r22_07', 'agent15 trade merge', merged15.highInflationScenario === true);
    check('a10_r22_08', 'agent15 bridge note', agent15TradeBridgeIntegrationNote().includes('Agent 15'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r22_09',
      'forecast corporate and trade import fields',
      path.points.every((p) => !!p.corporatePricingPassThroughBand && !!p.tradeExchangeImportBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r22_10',
      'agent21 r22 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalCorporatePricingPassThrough !== undefined &&
        bundle.terminalTradeExchangeImport !== undefined,
    );
  }
  check(
    'a10_r22_11',
    'round22 preset corporate markup stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_markup_cascade_stack');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'strained';
    })(),
  );
  check(
    'a10_r22_12',
    'round22 preset trade import stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'trade_fx_import_pipeline_stress');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r22_13',
    'round22 preset corporate trade fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_trade_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.32;
    })(),
  );

  // --- Round 23 scale wave ---
  {
    const guardian = assessGuardianInflationInterventionInflation({
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
      copilotInflationEscalationActive: true,
      guardrailNarrativeCascadeBand: 'urgent',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r23_01',
      'guardian urgent or cascade',
      guardian.interventionBand === 'urgent' || guardian.interventionBand === 'guardrail_cascade',
    );
    check('a10_r23_02', 'guardian score adj', guardianInflationInterventionScoreAdjustment(guardian.interventionBand) >= 3);
  }
  {
    const team = assessTeamIntelligenceConsensusInflation({
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.78,
      teamForecastDeanchoringFlag: true,
      briefingInflationSalienceBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r23_03',
      'team reacceleration or shock',
      team.consensusBand === 'reacceleration' || team.consensusBand === 'consensus_shock',
    );
    check('a10_r23_04', 'team score adj', teamIntelligenceConsensusInflationScoreAdjustment(team.consensusBand) >= 3);
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
      copilotInflationEscalationActive: true,
      guardrailNarrativeCascadeBand: 'urgent',
    });
    check('a10_r23_05', 'agent16 guardian merge', merged16.highInflationScenario === true);
    check('a10_r23_06', 'agent16 bridge note', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  {
    const merged18 = mergeAgent18IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.75,
      teamForecastDeanchoringFlag: true,
      briefingInflationSalienceBand: 'critical',
    });
    check('a10_r23_07', 'agent18 team merge', merged18.highInflationScenario === true);
    check('a10_r23_08', 'agent18 bridge note', agent18TeamBridgeIntegrationNote().includes('Agent 18'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r23_09',
      'forecast guardian and team consensus fields',
      path.points.every((p) => !!p.guardianInflationInterventionBand && !!p.teamIntelligenceConsensusBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r23_10',
      'agent21 r23 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalGuardianInflationIntervention !== undefined &&
        bundle.terminalTeamIntelligenceConsensus !== undefined,
    );
  }
  check(
    'a10_r23_11',
    'round23 preset guardian intervention stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'guardian_inflation_intervention_stack');
      return inp?.creditShockActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r23_12',
    'round23 preset team consensus stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'team_consensus_briefing_stress');
      return inp?.highInflationScenario === true && (inp.actorCreditStressIndex ?? 0) > 0.7;
    })(),
  );
  check(
    'a10_r23_13',
    'round23 preset guardian team fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'guardian_team_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.33;
    })(),
  );

  // --- Round 24 scale wave ---
  {
    const strategic = assessStrategicGeopoliticalInflationPremium({
      nationalPriorityInflationBias: 'expansionary',
      strategicStockpileStress: true,
      geopoliticalRiskPremium: 0.7,
      expansionaryPriorityCascadeActive: true,
      strategicInflationRiskBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r24_01',
      'strategic elevated or shock',
      strategic.premiumBand === 'elevated' || strategic.premiumBand === 'geopolitical_shock',
    );
    check('a10_r24_02', 'strategic score adj', strategicGeopoliticalInflationPremiumScoreAdjustment(strategic.premiumBand) >= 3);
  }
  {
    const memory = assessAiMemoryInflationRecallInflation({
      recalledInflationRegimeConfidence: 0.85,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: true,
      memoryInflationRecallCascade: true,
      explainabilityInflationSalienceBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r24_03',
      'memory recall elevated or shock',
      memory.recallBand === 'recall_elevated' || memory.recallBand === 'memory_shock',
    );
    check('a10_r24_04', 'memory score adj', aiMemoryInflationRecallScoreAdjustment(memory.recallBand) >= 3);
  }
  {
    const merged01 = mergeAgent01IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      nationalPriorityInflationBias: 'expansionary',
      strategicStockpileStress: true,
      geopoliticalRiskPremium: 0.65,
      expansionaryPriorityCascadeActive: true,
      strategicInflationRiskBand: 'critical',
    });
    check('a10_r24_05', 'agent01 strategic merge', merged01.highInflationScenario === true);
    check('a10_r24_06', 'agent01 bridge note', agent01StrategicBridgeIntegrationNote().includes('Agent 01'));
  }
  {
    const merged19 = mergeAgent19IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      recalledInflationRegimeConfidence: 0.82,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: true,
      memoryInflationRecallCascade: true,
      explainabilityInflationSalienceBand: 'critical',
    });
    check('a10_r24_07', 'agent19 memory merge', merged19.highInflationScenario === true);
    check('a10_r24_08', 'agent19 bridge note', agent19MemoryBridgeIntegrationNote().includes('Agent 19'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r24_09',
      'forecast strategic premium and memory recall fields',
      path.points.every((p) => !!p.strategicGeopoliticalPremiumBand && !!p.aiMemoryInflationRecallBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r24_10',
      'agent21 r24 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalStrategicGeopoliticalPremium !== undefined &&
        bundle.terminalAiMemoryInflationRecall !== undefined,
    );
  }
  check(
    'a10_r24_11',
    'round24 preset strategic premium stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'strategic_geopolitical_premium_stack');
      return inp?.systemicLiquidityBand === 'critical' && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r24_12',
    'round24 preset memory recall stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'ai_memory_recall_salience_stress');
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r24_13',
    'round24 preset strategic memory fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'strategic_memory_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.34;
    })(),
  );

  // --- Round 25 scale wave ---
  {
    const calendar = assessCalendarSeasonInflationCarryover({
      calendarSeasonBand: 'peak_demand',
      policyReviewWindowOpen: true,
      multiTurnInflationCarryover: 0.35,
      fiscalCalendarInflationLatch: true,
      multiTurnCarryoverBand: 'persistent',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r25_01',
      'calendar peak or shock',
      calendar.carryoverBand === 'peak' || calendar.carryoverBand === 'carryover_shock',
    );
    check('a10_r25_02', 'calendar score adj', calendarSeasonInflationCarryoverScoreAdjustment(calendar.carryoverBand) >= 3);
  }
  {
    const autopilot = assessAutomationAutopilotInflationDrift({
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.35,
      idleMacroInflationEscalation: true,
      autopilotDriftCascadeBand: 'runaway',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r25_03',
      'autopilot elevated or runaway',
      autopilot.driftBand === 'elevated' || autopilot.driftBand === 'autopilot_runaway',
    );
    check('a10_r25_04', 'autopilot score adj', automationAutopilotInflationDriftScoreAdjustment(autopilot.driftBand) >= 3);
  }
  {
    const merged02 = mergeAgent02IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      calendarSeasonBand: 'peak_demand',
      policyReviewWindowOpen: true,
      multiTurnInflationCarryover: 0.3,
      fiscalCalendarInflationLatch: true,
      multiTurnCarryoverBand: 'persistent',
    });
    check('a10_r25_05', 'agent02 turns merge', merged02.highInflationScenario === true);
    check('a10_r25_06', 'agent02 bridge note', agent02TurnsBridgeIntegrationNote().includes('Agent 02'));
  }
  {
    const merged20 = mergeAgent20IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.4,
      idleMacroInflationEscalation: true,
      autopilotDriftCascadeBand: 'runaway',
    });
    check('a10_r25_07', 'agent20 automation merge', merged20.highInflationScenario === true);
    check('a10_r25_08', 'agent20 bridge note', agent20AutomationBridgeIntegrationNote().includes('Agent 20'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r25_09',
      'forecast calendar carryover and automation drift fields',
      path.points.every((p) => !!p.calendarSeasonInflationCarryoverBand && !!p.automationAutopilotInflationDriftBand),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r25_10',
      'agent21 r25 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalCalendarSeasonInflationCarryover !== undefined &&
        bundle.terminalAutomationAutopilotInflationDrift !== undefined,
    );
  }
  check(
    'a10_r25_11',
    'round25 preset calendar carryover stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'calendar_season_carryover_stack');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r25_12',
    'round25 preset automation drift stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'automation_autopilot_drift_stress');
      return inp?.fiscalPressure === 'critical' && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r25_13',
    'round25 preset turns automation fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'turns_automation_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.35;
    })(),
  );

  // --- Round 26 scale wave ---
  {
    const offset = assessResearchProductivityInflationOffset({
      productivityGainBand: 'strong',
      supplySideReliefActive: true,
      innovationInflationOffsetScore: 0.72,
      techTreeInflationLatch: true,
      supplySideOffsetBand: 'strong',
      inflationBand: 'elevated',
      turn: 2,
    });
    check(
      'a10_r26_01',
      'research strong or moderate relief',
      offset.offsetBand === 'strong_relief' || offset.offsetBand === 'moderate_relief',
    );
    check(
      'a10_r26_02',
      'research score adj relief',
      researchProductivityInflationOffsetScoreAdjustment(offset.offsetBand) <= 0,
    );
  }
  {
    const bias = assessScenarioSandboxInflationBias({
      scenarioInflationBias: 'extreme',
      sandboxStressModeActive: true,
      difficultyCostMultiplier: 1.22,
      difficultyInflationCascade: true,
      sandboxStressInflationBand: 'extreme',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r26_03',
      'scenario extreme or inflationary',
      bias.biasBand === 'extreme_stress' || bias.biasBand === 'inflationary',
    );
    check('a10_r26_04', 'scenario score adj', scenarioSandboxInflationBiasScoreAdjustment(bias.biasBand) >= 3);
  }
  {
    const merged03 = mergeAgent03IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      productivityGainBand: 'flat',
      supplySideReliefActive: false,
      innovationInflationOffsetScore: 0.2,
      techTreeInflationLatch: true,
      supplySideOffsetBand: 'weak',
    });
    check(
      'a10_r26_05',
      'agent03 latch weak merge',
      (merged03.inflationSettingMultiplier ?? 1) > (makeDefaultMacroFinancialTestInputs().inflationSettingMultiplier ?? 1),
    );
    check('a10_r26_06', 'agent03 bridge note', agent03ResearchBridgeIntegrationNote().includes('Agent 03'));
  }
  {
    const merged04 = mergeAgent04IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      scenarioInflationBias: 'inflationary',
      sandboxStressModeActive: true,
      difficultyCostMultiplier: 1.15,
      difficultyInflationCascade: true,
      sandboxStressInflationBand: 'extreme',
    });
    check('a10_r26_07', 'agent04 cascade merge', merged04.highInflationScenario === true);
    check('a10_r26_08', 'agent04 bridge note', agent04ModesBridgeIntegrationNote().includes('Agent 04'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r26_09',
      'forecast research offset and scenario bias fields',
      path.points.every(
        (p) => !!p.researchProductivityInflationOffsetBand && !!p.scenarioSandboxInflationBiasBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r26_10',
      'agent21 r26 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalResearchProductivityInflationOffset !== undefined &&
        bundle.terminalScenarioSandboxInflationBias !== undefined,
    );
  }
  check(
    'a10_r26_11',
    'round26 preset research offset stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'research_productivity_offset_stack');
      return inp?.householdInflationScenarioActive === true && (inp.inflationSettingMultiplier ?? 1) < 1;
    })(),
  );
  check(
    'a10_r26_12',
    'round26 preset sandbox bias stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'scenario_sandbox_bias_stress');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r26_13',
    'round26 preset research modes fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'research_modes_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.36;
    })(),
  );

  // --- Round 27 scale wave ---
  {
    const persistence = assessEventsNarrativeInflationPersistence({
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      dynamicEventInflationLatch: true,
      supplyShockPersistenceBand: 'entrenched',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r27_01',
      'events active or entrenched',
      persistence.persistenceBand === 'active' || persistence.persistenceBand === 'entrenched',
    );
    check('a10_r27_02', 'events score adj', eventsNarrativeInflationPersistenceScoreAdjustment(persistence.persistenceBand) >= 3);
  }
  {
    const slippage = assessMacroDemandOverheatInflationSlippage({
      gdpGrowthBand: 'strong',
      nominalDemandPressure: 0.75,
      outputGap: 0.4,
      macroDemandOverheatLatch: true,
      transmissionSlippageBand: 'dislocated',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r27_03',
      'macro overheating or dislocated',
      slippage.slippageBand === 'overheating' || slippage.slippageBand === 'dislocated',
    );
    check('a10_r27_04', 'macro score adj', macroDemandOverheatInflationSlippageScoreAdjustment(slippage.slippageBand) >= 3);
  }
  {
    const merged05 = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      dynamicEventInflationLatch: true,
      supplyShockPersistenceBand: 'entrenched',
    });
    check('a10_r27_05', 'agent05 latch entrenched merge', merged05.highInflationScenario === true);
    check('a10_r27_06', 'agent05 bridge note', agent05EventsBridgeIntegrationNote().includes('Agent 05'));
  }
  {
    const merged06 = mergeAgent06IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      gdpGrowthBand: 'strong',
      unemploymentBand: 'moderate',
      outputGap: 0.35,
      nominalDemandPressure: 0.6,
      macroDemandOverheatLatch: true,
      transmissionSlippageBand: 'dislocated',
    });
    check(
      'a10_r27_07',
      'agent06 slippage merge',
      (merged06.inflationSettingMultiplier ?? 1) > (makeDefaultMacroFinancialTestInputs().inflationSettingMultiplier ?? 1),
    );
    check('a10_r27_08', 'agent06 bridge note', agent06BridgeIntegrationNote().includes('Agent 06'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r27_09',
      'forecast events persistence and macro slippage fields',
      path.points.every(
        (p) => !!p.eventsNarrativeInflationPersistenceBand && !!p.macroDemandOverheatInflationSlippageBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r27_10',
      'agent21 r27 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalEventsNarrativeInflationPersistence !== undefined &&
        bundle.terminalMacroDemandOverheatInflationSlippage !== undefined,
    );
  }
  check(
    'a10_r27_11',
    'round27 preset events persistence stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'events_supply_persistence_stack');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r27_12',
    'round27 preset macro slippage stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'macro_transmission_slippage_stress');
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'strained';
    })(),
  );
  check(
    'a10_r27_13',
    'round27 preset events macro fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'events_macro_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.37;
    })(),
  );

  // --- Round 28 scale wave ---
  {
    const congestion = assessFreightLogisticsInflationCongestion({
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      logisticsInflationLatch: true,
      freightCongestionBand: 'gridlocked',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r28_01',
      'freight congested or gridlocked',
      congestion.congestionBand === 'congested' || congestion.congestionBand === 'gridlocked',
    );
    check('a10_r28_02', 'freight score adj', freightLogisticsInflationCongestionScoreAdjustment(congestion.congestionBand) >= 3);
  }
  {
    const stress = assessHousingWellbeingInflationEssentialStress({
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      essentialServicesInflationFlag: true,
      shelterEssentialInflationLatch: true,
      mortgageWellbeingStressBand: 'acute',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r28_03',
      'housing critical or acute',
      stress.stressBand === 'critical' || stress.stressBand === 'acute',
    );
    check('a10_r28_04', 'housing score adj', housingWellbeingInflationEssentialStressScoreAdjustment(stress.stressBand) >= 3);
  }
  {
    const merged12 = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      freightCapacityBand: 'tight',
      fuelSurchargeActive: true,
      portBacklogBand: 'moderate',
      logisticsInflationScenarioActive: false,
      logisticsInflationLatch: true,
      freightCongestionBand: 'gridlocked',
    });
    check('a10_r28_05', 'agent12 gridlock merge', merged12.highInflationScenario === true);
    check('a10_r28_06', 'agent12 bridge note', agent12TransportBridgeIntegrationNote().includes('Agent 12'));
  }
  {
    const merged14 = mergeAgent14IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      mortgageStressBand: 'elevated',
      wellbeingCostBand: 'strained',
      essentialServicesInflationFlag: true,
      shelterEssentialInflationLatch: true,
      mortgageWellbeingStressBand: 'acute',
    });
    check('a10_r28_07', 'agent14 acute merge', merged14.highInflationScenario === true);
    check('a10_r28_08', 'agent14 bridge note', agent14HousingBridgeIntegrationNote().includes('Agent 14'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r28_09',
      'forecast freight congestion and housing stress fields',
      path.points.every(
        (p) => !!p.freightLogisticsInflationCongestionBand && !!p.housingWellbeingInflationEssentialStressBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r28_10',
      'agent21 r28 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalFreightLogisticsInflationCongestion !== undefined &&
        bundle.terminalHousingWellbeingInflationEssentialStress !== undefined,
    );
  }
  check(
    'a10_r28_11',
    'round28 preset freight congestion stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'freight_logistics_congestion_stack');
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r28_12',
    'round28 preset housing wellbeing stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'housing_wellbeing_essential_stress');
      return inp?.householdInflationScenarioActive === true && inp.fiscalPressure === 'critical';
    })(),
  );
  check(
    'a10_r28_13',
    'round28 preset transport housing fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'transport_housing_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.38;
    })(),
  );

  // --- Round 29 scale wave ---
  {
    const fusion = assessCommandCenterInflationFusionEscalation({
      macroAlertLevel: 'red',
      inflationFusionScore: 0.82,
      coordinatedTighteningSuggested: true,
      macroInflationFusionLatch: true,
      commandAlertCascadeBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r29_01',
      'command critical or runaway',
      fusion.escalationBand === 'critical' || fusion.escalationBand === 'fusion_runaway',
    );
    check('a10_r29_02', 'command score adj', commandCenterInflationFusionEscalationScoreAdjustment(fusion.escalationBand) >= 3);
  }
  {
    const nudge = assessUiPlayerInflationSalienceNudge({
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
      playerInflationSalienceLatch: true,
      uiExpectationsNudgeBand: 'sharp',
      inflationBand: 'high',
      turn: 2,
    });
    check('a10_r29_03', 'ui sharp or elevated', nudge.nudgeBand === 'sharp' || nudge.nudgeBand === 'elevated');
    check('a10_r29_04', 'ui score adj', uiPlayerInflationSalienceNudgeScoreAdjustment(nudge.nudgeBand) >= 3);
  }
  {
    const merged17 = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAlertLevel: 'amber',
      inflationFusionScore: 0.5,
      coordinatedTighteningSuggested: false,
      macroInflationFusionLatch: true,
      commandAlertCascadeBand: 'critical',
    });
    check('a10_r29_05', 'agent17 cascade merge', merged17.highInflationScenario === true);
    check('a10_r29_06', 'agent17 bridge note', agent17CommandBridgeIntegrationNote().includes('Agent 17'));
  }
  {
    const merged22 = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'medium',
      uiNudgeInflationExpectationsUp: true,
      playerInflationSalienceLatch: true,
      uiExpectationsNudgeBand: 'sharp',
    });
    check('a10_r29_07', 'agent22 sharp merge', merged22.householdInflationScenarioActive === true);
    check('a10_r29_08', 'agent22 bridge note', agent22UiBridgeIntegrationNote().includes('Agent 22'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r29_09',
      'forecast command fusion and ui nudge fields',
      path.points.every(
        (p) => !!p.commandCenterInflationFusionEscalationBand && !!p.uiPlayerInflationSalienceNudgeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r29_10',
      'agent21 r29 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalCommandCenterInflationFusionEscalation !== undefined &&
        bundle.terminalUiPlayerInflationSalienceNudge !== undefined,
    );
  }
  check(
    'a10_r29_11',
    'round29 preset command fusion stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'command_fusion_alert_stack');
      return inp?.highInflationScenario === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r29_12',
    'round29 preset ui salience stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'ui_salience_expectations_stress');
      return inp?.householdInflationScenarioActive === true && inp.highInflationScenario === true;
    })(),
  );
  check(
    'a10_r29_13',
    'round29 preset command ui fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'command_ui_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.39;
    })(),
  );

  // --- Round 30 scale wave ---
  {
    const breach = assessFiscalIndexationInflationAnchorBreach({
      consolidatedDeficitBand: 'large_deficit',
      debtServicePressure: 'critical',
      fiscalAnchorBreached: true,
      debtIndexationInflationLatch: true,
      fiscalPassThroughCascadeBand: 'runaway',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r30_01',
      'fiscal breached or cascade',
      breach.breachBand === 'breached' || breach.breachBand === 'cascade',
    );
    check('a10_r30_02', 'fiscal score adj', fiscalIndexationInflationAnchorBreachScoreAdjustment(breach.breachBand) >= 3);
  }
  {
    const deanchoring = assessHouseholdWageInflationDeanchoring({
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      householdExpectationsDeanchoring: true,
      wagePriceSpiralLatch: true,
      householdDeanchoringBand: 'unmoored',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r30_03',
      'household deanchored or spiral',
      deanchoring.deanchoringBand === 'deanchored' || deanchoring.deanchoringBand === 'spiral',
    );
    check('a10_r30_04', 'household score adj', householdWageInflationDeanchoringScoreAdjustment(deanchoring.deanchoringBand) >= 3);
  }
  {
    const merged07 = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consolidatedDeficitBand: 'moderate_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'critical',
      debtIndexationInflationLatch: true,
      fiscalPassThroughCascadeBand: 'runaway',
    });
    check('a10_r30_05', 'agent07 runaway merge', merged07.highInflationScenario === true);
    check('a10_r30_06', 'agent07 bridge note', agent07FiscalBridgeIntegrationNote().includes('Agent 07'));
  }
  {
    const merged09 = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'steady',
      wageGrowthBand: 'moderate',
      costOfLivingStress: 'moderate',
      wagePriceSpiralLatch: true,
      householdDeanchoringBand: 'unmoored',
    });
    check('a10_r30_07', 'agent09 unmoored merge', merged09.highInflationScenario === true);
    check('a10_r30_08', 'agent09 bridge note', agent09HouseholdBridgeIntegrationNote().includes('Agent 09'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r30_09',
      'forecast fiscal breach and household deanchoring fields',
      path.points.every(
        (p) => !!p.fiscalIndexationInflationAnchorBreachBand && !!p.householdWageInflationDeanchoringBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r30_10',
      'agent21 r30 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalFiscalIndexationInflationAnchorBreach !== undefined &&
        bundle.terminalHouseholdWageInflationDeanchoring !== undefined,
    );
  }
  check(
    'a10_r30_11',
    'round30 preset fiscal indexation stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'fiscal_indexation_anchor_breach_stack');
      return inp?.fiscalPressure === 'critical' && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r30_12',
    'round30 preset household deanchoring stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'household_wage_deanchoring_stress');
      return inp?.householdInflationScenarioActive === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r30_13',
    'round30 preset fiscal household fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'fiscal_household_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.4;
    })(),
  );

  // --- Round 31 scale wave ---
  {
    const markup = assessCorporateMarkupInflationCascade({
      pricingPowerBand: 'dominant',
      passThroughIntent: 'full',
      marginCompression: 'none',
      corporatePricingInflationLatch: true,
      markupPassThroughCascadeBand: 'full',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r31_01',
      'markup active or dominant',
      markup.cascadeBand === 'active' || markup.cascadeBand === 'dominant',
    );
    check('a10_r31_02', 'markup score adj', corporateMarkupInflationCascadeScoreAdjustment(markup.cascadeBand) >= 3);
  }
  {
    const pipeline = assessTradeTariffImportInflationPipeline({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.45,
      importTariffInflationLatch: true,
      exchangePipelineStressBand: 'ruptured',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r31_03',
      'trade fragile or ruptured',
      pipeline.pipelineBand === 'fragile' || pipeline.pipelineBand === 'ruptured',
    );
    check('a10_r31_04', 'trade score adj', tradeTariffImportInflationPipelineScoreAdjustment(pipeline.pipelineBand) >= 3);
  }
  {
    const merged08 = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      pricingPowerBand: 'moderate',
      marginCompression: 'none',
      passThroughIntent: 'partial',
      corporatePricingInflationLatch: true,
      markupPassThroughCascadeBand: 'full',
    });
    check('a10_r31_05', 'agent08 full cascade merge', merged08.highInflationScenario === true);
    check('a10_r31_06', 'agent08 bridge note', agent08CorporateBridgeIntegrationNote().includes('Agent 08'));
  }
  {
    const merged15 = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'stable',
      commodityImportShare: 0.3,
      importTariffInflationLatch: true,
      exchangePipelineStressBand: 'ruptured',
    });
    check('a10_r31_07', 'agent15 ruptured merge', merged15.highInflationScenario === true);
    check('a10_r31_08', 'agent15 bridge note', agent15TradeBridgeIntegrationNote().includes('Agent 15'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r31_09',
      'forecast markup cascade and tariff pipeline fields',
      path.points.every(
        (p) => !!p.corporateMarkupInflationCascadeBand && !!p.tradeTariffImportInflationPipelineBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r31_10',
      'agent21 r31 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalCorporateMarkupInflationCascade !== undefined &&
        bundle.terminalTradeTariffImportInflationPipeline !== undefined,
    );
  }
  check(
    'a10_r31_11',
    'round31 preset corporate markup stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_markup_pass_through_stack');
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r31_12',
    'round31 preset trade tariff stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'trade_tariff_pipeline_stress');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r31_13',
    'round31 preset markup tariff fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'markup_tariff_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.41;
    })(),
  );

  // --- Round 32 scale wave ---
  {
    const surge = assessMetroUrbanRentInflationSurge({
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      urbanRentInflationLatch: true,
      metroDispersionStressBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r32_01',
      'metro surging or critical',
      surge.surgeBand === 'surging' || surge.surgeBand === 'critical',
    );
    check('a10_r32_02', 'metro score adj', metroUrbanRentInflationSurgeScoreAdjustment(surge.surgeBand) >= 3);
  }
  {
    const grid = assessWholesaleGridEnergyInflationCascade({
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      gridTariffInflationLatch: true,
      wholesaleStressCascadeBand: 'cascade',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r32_03',
      'grid fragile or crisis',
      grid.cascadeBand === 'fragile' || grid.cascadeBand === 'crisis',
    );
    check('a10_r32_04', 'grid score adj', wholesaleGridEnergyInflationCascadeScoreAdjustment(grid.cascadeBand) >= 3);
  }
  {
    const merged11 = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      vacancyBand: 'tight',
      rentGrowthBand: 'moderate',
      urbanizationPressure: 'medium',
      regionalDispersionScore: 0.4,
      urbanRentInflationLatch: true,
      metroDispersionStressBand: 'critical',
    });
    check('a10_r32_05', 'agent11 critical merge', merged11.highInflationScenario === true);
    check('a10_r32_06', 'agent11 bridge note', agent11CitiesBridgeIntegrationNote().includes('Agent 11'));
  }
  {
    const merged13 = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      wholesaleEnergyStress: 'elevated',
      retailTariffShock: false,
      gridReliabilityBand: 'stable',
      emissionsTransitionCostBand: 'low',
      gridTariffInflationLatch: true,
      wholesaleStressCascadeBand: 'cascade',
    });
    check('a10_r32_07', 'agent13 cascade merge', merged13.highInflationScenario === true);
    check('a10_r32_08', 'agent13 bridge note', agent13EnergyBridgeIntegrationNote().includes('Agent 13'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r32_09',
      'forecast metro surge and grid cascade fields',
      path.points.every(
        (p) => !!p.metroUrbanRentInflationSurgeBand && !!p.wholesaleGridEnergyInflationCascadeBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r32_10',
      'agent21 r32 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalMetroUrbanRentInflationSurge !== undefined &&
        bundle.terminalWholesaleGridEnergyInflationCascade !== undefined,
    );
  }
  check(
    'a10_r32_11',
    'round32 preset metro rent surge stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'metro_urban_rent_surge_stack');
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r32_12',
    'round32 preset grid cascade stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'wholesale_grid_tariff_cascade_stress');
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r32_13',
    'round32 preset metro grid fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'metro_grid_fusion_stress');
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.42;
    })(),
  );
  {
    const escalation = assessGuardianGuardrailInflationEscalation({
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
      guardrailInflationLatch: true,
      copilotEscalationBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r33_01',
      'guardian urgent or critical',
      escalation.escalationBand === 'urgent' || escalation.escalationBand === 'critical',
    );
    check(
      'a10_r33_02',
      'guardian score adj',
      guardianGuardrailInflationEscalationScoreAdjustment(escalation.escalationBand) >= 3,
    );
  }
  {
    const drift = assessTeamConsensusInflationBriefingDrift({
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.85,
      teamBriefingInflationLatch: true,
      consensusDriftBand: 'unmoored',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r33_03',
      'team deanchored or consensus shock',
      drift.driftBand === 'deanchored' || drift.driftBand === 'consensus_shock',
    );
    check(
      'a10_r33_04',
      'team score adj',
      teamConsensusInflationBriefingDriftScoreAdjustment(drift.driftBand) >= 3,
    );
  }
  {
    const merged16 = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'advisory',
      narrativeShockSeverity: 'medium',
      guardrailInflationLatch: true,
      copilotEscalationBand: 'critical',
    });
    check('a10_r33_05', 'agent16 critical latch merge', merged16.highInflationScenario === true);
    check('a10_r33_06', 'agent16 bridge note', agent16GuardianBridgeIntegrationNote().includes('Agent 16'));
  }
  {
    const merged18 = mergeAgent18IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consensusInflationOutlook: 'stable',
      briefingUrgencyBand: 'routine',
      crossDomainStressScore: 0.2,
      teamBriefingInflationLatch: true,
      consensusDriftBand: 'unmoored',
    });
    check('a10_r33_07', 'agent18 unmoored merge', merged18.highInflationScenario === true);
    check('a10_r33_08', 'agent18 bridge note', agent18TeamBridgeIntegrationNote().includes('Agent 18'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r33_09',
      'forecast guardian escalation and team briefing drift fields',
      path.points.every(
        (p) => !!p.guardianGuardrailInflationEscalationBand && !!p.teamConsensusInflationBriefingDriftBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r33_10',
      'agent21 r33 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalGuardianGuardrailInflationEscalation !== undefined &&
        bundle.terminalTeamConsensusInflationBriefingDrift !== undefined,
    );
  }
  check(
    'a10_r33_11',
    'round33 preset guardian guardrail stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'guardian_guardrail_escalation_stack',
      );
      return inp?.highInflationScenario === true && inp.creditShockActive === true;
    })(),
  );
  check(
    'a10_r33_12',
    'round33 preset team briefing drift stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'team_briefing_consensus_drift_stress',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r33_13',
    'round33 preset guardian team fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'guardian_team_briefing_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.43;
    })(),
  );
  {
    const recallGate = assessMemoryCommonwealthInflationRecallGate({
      recalledInflationRegimeConfidence: 0.88,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: true,
      memoryCommonwealthInflationLatch: true,
      realmRecallGateBand: 'breached',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r34_01',
      'memory breached or commonwealth shock',
      recallGate.gateBand === 'breached' || recallGate.gateBand === 'commonwealth_shock',
    );
    check(
      'a10_r34_02',
      'memory score adj',
      memoryCommonwealthInflationRecallGateScoreAdjustment(recallGate.gateBand) >= 3,
    );
  }
  {
    const cascade = assessAutomationSynthesisInflationCascadeDrift({
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.32,
      synthesisAutopilotInflationLatch: true,
      cascadeStackDriftBand: 'runaway',
      inflationBand: 'high',
      turn: 2,
    });
    check(
      'a10_r34_03',
      'automation stacking or runaway',
      cascade.driftBand === 'stacking' || cascade.driftBand === 'runaway',
    );
    check(
      'a10_r34_04',
      'automation score adj',
      automationSynthesisInflationCascadeDriftScoreAdjustment(cascade.driftBand) >= 3,
    );
  }
  {
    const merged19 = mergeAgent19IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      recalledInflationRegimeConfidence: 0.5,
      narrativeDriftTowardHigherInflation: false,
      explainabilityAlertActive: false,
      memoryCommonwealthInflationLatch: true,
      realmRecallGateBand: 'breached',
    });
    check('a10_r34_05', 'agent19 breached merge', merged19.highInflationScenario === true);
    check('a10_r34_06', 'agent19 bridge note', agent19MemoryBridgeIntegrationNote().includes('Agent 19'));
  }
  {
    const merged20 = mergeAgent20IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAutopilotInflationBias: 'neutral',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.5,
      synthesisAutopilotInflationLatch: true,
      cascadeStackDriftBand: 'runaway',
    });
    check('a10_r34_07', 'agent20 runaway merge', merged20.highInflationScenario === true);
    check('a10_r34_08', 'agent20 bridge note', agent20AutomationBridgeIntegrationNote().includes('Agent 20'));
  }
  {
    const path = projectInflationForecastPath(4);
    check(
      'a10_r34_09',
      'forecast memory recall gate and synthesis cascade fields',
      path.points.every(
        (p) => !!p.memoryCommonwealthInflationRecallGateBand && !!p.automationSynthesisInflationCascadeDriftBand,
      ),
    );
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(65),
    });
    check(
      'a10_r34_10',
      'agent21 r34 fields',
      bundle.schemaVersion === '10.14.agent10.r34' &&
        bundle.terminalMemoryCommonwealthInflationRecallGate !== undefined &&
        bundle.terminalAutomationSynthesisInflationCascadeDrift !== undefined,
    );
  }
  check(
    'a10_r34_11',
    'round34 preset memory commonwealth stack',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'memory_commonwealth_recall_gate_stack',
      );
      return inp?.highInflationScenario === true && inp.householdInflationScenarioActive === true;
    })(),
  );
  check(
    'a10_r34_12',
    'round34 preset automation synthesis stress',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'automation_synthesis_cascade_drift_stress',
      );
      return inp?.creditShockActive === true && inp.systemicLiquidityBand === 'critical';
    })(),
  );
  check(
    'a10_r34_13',
    'round34 preset memory automation fusion',
    (() => {
      const inp = applyMacroFinancialScenarioPreset(
        makeDefaultMacroFinancialTestInputs(),
        'memory_automation_commonwealth_fusion_stress',
      );
      return inp?.highInflationScenario === true && (inp.inflationSettingMultiplier ?? 1) > 1.44;
    })(),
  );

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, results };
}
