import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  AGENT10_GLOSSARY_ENTRIES,
} from '../src/definitions/glossary.js';
import {
  integrationNoteNonCpiBoundary,
  macroInflationMayUseCommodityPrices,
  applyResourcePricePressure,
  baseResourceMarketPrice,
  clampResourcePricePressure,
} from '../src/prices/boundary.js';
import { V1014_FINSTAB_POLICY_TRANSMISSION_CHANNELS, V1014_FINSTAB_REGION_CREDIT_PROFILE } from '../src/definitions/constants.js';
import { bandCredit, bandInflation } from '../src/credit/bands.js';
import { computeActorCreditStressIndex } from '../src/credit/actor-leverage.js';
import { referencePolicyRate } from '../src/rates/reference-rate.js';
import { getShockById, applyShockDeltasToScores, FINANCIAL_SHOCK_CATALOG } from '../src/shocks/catalog.js';
import {
  computeNationalMacroFinancialConditions,
  createInitialMacroFinancialPersisted,
  macroFinancialEconomyCostMultiplier,
  macroFinancialInputHash,
  macroFinancialLoanSpreadMultiplier,
  makeDefaultMacroFinancialTestInputs,
  sanitizeMacroFinancialPersisted,
  buildMacroFinancialInputs,
} from '../src/compute/national-macro-financial.js';
import {
  V1014_FINSTAB_CORE_REGIONS,
  V1014_FINSTAB_LIMITS,
  V1014_FINSTAB_SCHEMA_VERSION,
} from '../src/definitions/constants.js';
import { runAgent10FinanceSelfTests } from '../src/self-tests.js';
import { evaluatePolicyTransmissionChannels } from '../src/transmission/channels.js';
import { runFinancialShockSequence } from '../src/shocks/scenario-runner.js';
import { stepResourceMarketPriceDeterministic } from '../src/prices/market-dynamics.js';
import { simulateMacroFinancialTurns } from '../src/integration/regression-harness.js';
import { applyMacroFinancialScenarioPreset } from '../src/catalog/fiscal-inflation-scenarios.js';
import { effectiveTierLoanRate } from '../src/credit/tier-spreads.js';
import { assessInvestmentClimateLink } from '../src/investment/climate-link.js';
import { assessWagePriceSpiral } from '../src/inflation/wage-price-spiral.js';
import { recommendMonetaryStance } from '../src/rates/monetary-reaction.js';
import { decomposeMacroCpiBasket, macroCpiBasketWeightSum } from '../src/inflation/cpi-basket.js';
import { stepInflationExpectations } from '../src/inflation/expectations-anchor.js';
import { mergeAgent06IntoMacroFinancialInputs } from '../src/integration/agent06-macro-bridge.js';
import { projectInflationForecastPath } from '../src/integration/inflation-forecast.js';
import { assessPhillipsSlack } from '../src/inflation/phillips-slack.js';
import { computeCoreHeadlineSpread } from '../src/inflation/core-headline-spread.js';
import { classifyInflationShockDrivers } from '../src/inflation/supply-demand-shock.js';
import { assessFiscalDominance } from '../src/fiscal/fiscal-dominance.js';
import { assessInflationTargetBreach } from '../src/rates/inflation-target-breach.js';
import { stepInflationRegimeTracker, createInitialInflationRegimeTracker } from '../src/integration/inflation-regime-tracker.js';
import { buildAgent21InflationForecastBundle } from '../src/integration/agent21-forecast-bridge.js';
import { assessRealRateGap } from '../src/rates/real-rate-gap.js';
import { stepInflationMomentum, createInitialInflationMomentumState } from '../src/inflation/inflation-momentum.js';
import { estimateDisinflationSacrifice } from '../src/inflation/disinflation-sacrifice.js';
import { assessCreditInflationFeedback } from '../src/credit/credit-inflation-feedback.js';
import { mergeAgent07IntoMacroFinancialInputs } from '../src/integration/agent07-fiscal-bridge.js';
import { mergeAgent09IntoMacroFinancialInputs } from '../src/integration/agent09-household-bridge.js';
import { assessImportPricePassThrough } from '../src/inflation/import-price-pass-through.js';
import { assessTermPremiumInflationSignal } from '../src/rates/term-premium-inflation-signal.js';
import { mergeAgent15IntoMacroFinancialInputs } from '../src/integration/agent15-trade-bridge.js';
import { mergeAgent08IntoMacroFinancialInputs } from '../src/integration/agent08-corporate-bridge.js';
import { mergeAgent11IntoMacroFinancialInputs } from '../src/integration/agent11-cities-bridge.js';
import { mergeAgent13IntoMacroFinancialInputs } from '../src/integration/agent13-energy-bridge.js';
import { assessEnergyPricePassThrough } from '../src/inflation/energy-price-pass-through.js';
import { assessShelterRentInflation } from '../src/inflation/shelter-rent-inflation.js';
import { assessFoodGroceryPassThrough } from '../src/inflation/food-grocery-pass-through.js';
import { assessTransportLogisticsInflation } from '../src/inflation/transport-logistics-inflation.js';
import { mergeAgent14IntoMacroFinancialInputs } from '../src/integration/agent14-housing-bridge.js';
import { mergeAgent12IntoMacroFinancialInputs } from '../src/integration/agent12-transport-bridge.js';
import { assessHealthcareServicesInflation } from '../src/inflation/healthcare-services-inflation.js';
import { assessInsurancePremiumPassThrough } from '../src/inflation/insurance-premium-pass-through.js';
import { mergeAgent03IntoMacroFinancialInputs } from '../src/integration/agent03-research-bridge.js';
import { mergeAgent05IntoMacroFinancialInputs } from '../src/integration/agent05-events-bridge.js';
import { assessEducationTuitionInflation } from '../src/inflation/education-tuition-inflation.js';
import { assessCommunicationsServicesInflation } from '../src/inflation/communications-services-inflation.js';
import { mergeAgent04IntoMacroFinancialInputs } from '../src/integration/agent04-modes-bridge.js';
import { mergeAgent16IntoMacroFinancialInputs } from '../src/integration/agent16-guardian-bridge.js';
import { assessRecreationLeisureInflation } from '../src/inflation/recreation-leisure-inflation.js';
import { assessProfessionalServicesFeeInflation } from '../src/inflation/professional-services-fee-inflation.js';
import { mergeAgent17IntoMacroFinancialInputs } from '../src/integration/agent17-command-bridge.js';
import { mergeAgent18IntoMacroFinancialInputs } from '../src/integration/agent18-team-bridge.js';
import { assessChildcareServicesInflation } from '../src/inflation/childcare-services-inflation.js';
import { assessGovernmentChargesInflation } from '../src/inflation/government-charges-inflation.js';
import { mergeAgent02IntoMacroFinancialInputs } from '../src/integration/agent02-turns-bridge.js';
import { mergeAgent20IntoMacroFinancialInputs } from '../src/integration/agent20-automation-bridge.js';
import { assessWaterUtilitiesInflation } from '../src/inflation/water-utilities-inflation.js';
import { assessDomesticTravelInflation } from '../src/inflation/domestic-travel-inflation.js';
import { mergeAgent01IntoMacroFinancialInputs } from '../src/integration/agent01-strategic-bridge.js';
import { mergeAgent19IntoMacroFinancialInputs } from '../src/integration/agent19-memory-bridge.js';
import { assessConstructionMaterialsInflation } from '../src/inflation/construction-materials-inflation.js';
import { assessRetailTradeMarginInflation } from '../src/inflation/retail-trade-margin-inflation.js';
import { mergeAgent22IntoMacroFinancialInputs } from '../src/integration/agent22-ui-bridge.js';
import { mergeAgent23IntoMacroFinancialInputs } from '../src/integration/agent23-dashboards-bridge.js';
import { assessFinancialServicesFeeInflation } from '../src/inflation/financial-services-fee-inflation.js';
import { assessAgriculturalFarmgateInflation } from '../src/inflation/agricultural-farmgate-inflation.js';
import { assessPublicUtilitiesGridTariffInflation } from '../src/inflation/public-utilities-grid-tariff-inflation.js';
import { assessUiInflationSaliencePassThrough } from '../src/inflation/ui-inflation-salience-pass-through.js';
import { assessHousingMortgageEssentialInflation } from '../src/inflation/housing-mortgage-essential-inflation.js';
import { assessMacroTransmissionMergeInflation } from '../src/inflation/macro-transmission-merge-inflation.js';
import { assessDynamicEventsInflationSpillover } from '../src/inflation/dynamic-events-inflation-spillover.js';
import { assessDashboardMapInflationOverlay } from '../src/inflation/dashboard-map-inflation-overlay.js';
import { assessPublicFinanceDebtServiceInflation } from '../src/inflation/public-finance-debt-service-inflation.js';
import { assessPopulationLaborWageInflation } from '../src/inflation/population-labor-wage-inflation.js';
import { assessWholesaleEnergyTransitionInflation } from '../src/inflation/wholesale-energy-transition-inflation.js';
import { assessUrbanRentDispersionInflation } from '../src/inflation/urban-rent-dispersion-inflation.js';
import { assessCorporatePricingPassThroughInflation } from '../src/inflation/corporate-pricing-pass-through-inflation.js';
import { assessTradeExchangeImportInflation } from '../src/inflation/trade-exchange-import-inflation.js';
import { mergeAgent16IntoMacroFinancialInputs } from '../src/integration/agent16-guardian-bridge.js';
import { mergeAgent12IntoMacroFinancialInputs } from '../src/integration/agent12-transport-bridge.js';

describe('Agent 10 glossary & boundaries', () => {
  it('defines coherent finance terms', () => {
    assert.ok(AGENT10_GLOSSARY_ENTRIES.length >= 7);
    assert.equal(macroInflationMayUseCommodityPrices(), false);
    assert.match(integrationNoteNonCpiBoundary(), /commodity/i);
  });
});

describe('Credit bands & leverage', () => {
  it('maps inflation and credit scores to bands', () => {
    assert.equal(bandInflation(80, false), 'high');
    assert.equal(bandCredit(80), 'accommodative');
  });

  it('computes actor credit stress from loans', () => {
    const idx = computeActorCreditStressIndex(
      { money: 100, loans: [{ remaining: 900 }] },
      { money: 5000, loans: [] },
    );
    assert.ok(idx >= 0.45 && idx < 1);
  });
});

describe('Rates metadata', () => {
  it('raises reference rate when credit is restricted', () => {
    const easy = referencePolicyRate('neutral', 'accommodative');
    const tight = referencePolicyRate('tightening', 'restricted');
    assert.ok(tight > easy);
  });
});

describe('Resource market prices (not macro CPI)', () => {
  it('clamps world pressure to ±6%', () => {
    assert.equal(clampResourcePricePressure(0.2), 0.06);
    assert.equal(clampResourcePricePressure(-0.2), -0.06);
  });

  it('applies pressure to base category price', () => {
    const base = baseResourceMarketPrice('minerals');
    const up = applyResourcePricePressure(base, 0.06);
    assert.ok(up > base);
  });
});

describe('Financial shocks catalog', () => {
  it('includes credit tightening with flag', () => {
    const shock = getShockById('shock_credit_tightening');
    assert.ok(shock);
    const applied = applyShockDeltasToScores({ inflation: 50, credit: 55, stability: 60 }, shock!);
    assert.equal(applied.creditShockActive, true);
    assert.ok(applied.credit < 55);
  });

  it('commodity spike does not move macro inflation score', () => {
    const shock = FINANCIAL_SHOCK_CATALOG.find((s) => s.kind === 'commodity_spike');
    assert.equal(shock?.inflationScoreDelta, 0);
  });
});

describe('National macro-financial compute (V10.14 parity)', () => {
  it('schema version matches canonical', () => {
    assert.equal(createInitialMacroFinancialPersisted().schemaVersion, V1014_FINSTAB_SCHEMA_VERSION);
  });

  it('credit shock tightens spread multiplier', () => {
    const r = computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ creditShockActive: true }),
      null,
      null,
    );
    assert.ok(r.state.modifiers.creditSpreadMultiplier > 1.05);
  });

  it('high inflation scenario raises cost multiplier', () => {
    const r = computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ highInflationScenario: true }),
      null,
      null,
    );
    assert.ok(r.state.modifiers.costOfLivingMultiplier > 1.1);
  });

  it('deterministic replay', () => {
    const a = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ turn: 7 }), null, null)
      .state;
    const b = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs({ turn: 7 }), null, null)
      .state;
    assert.deepEqual(a, b);
  });

  it('input hash stable and turn-sensitive', () => {
    const base = makeDefaultMacroFinancialTestInputs();
    assert.equal(macroFinancialInputHash(base), macroFinancialInputHash(base));
    assert.notEqual(
      macroFinancialInputHash(makeDefaultMacroFinancialTestInputs({ turn: 1 })),
      macroFinancialInputHash(makeDefaultMacroFinancialTestInputs({ turn: 2 })),
    );
  });

  it('multipliers default to 1 when disabled', () => {
    assert.equal(macroFinancialEconomyCostMultiplier(null), 1);
    assert.equal(macroFinancialLoanSpreadMultiplier(undefined), 1);
  });

  it('regional spreads cover core regions', () => {
    const r = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null);
    assert.equal(r.state.regionalSpreads.length, V1014_FINSTAB_CORE_REGIONS.length);
  });

  it('WA mining exposure profile > 1', () => {
    assert.ok(V1014_FINSTAB_REGION_CREDIT_PROFILE.WA.miningExposure > 1);
  });

  it('policy transmission catalog size', () => {
    assert.ok(V1014_FINSTAB_POLICY_TRANSMISSION_CHANNELS.length >= 10);
  });

  it('sanitize round-trip', () => {
    const p = computeNationalMacroFinancialConditions(makeDefaultMacroFinancialTestInputs(), null, null).persisted;
    const s = sanitizeMacroFinancialPersisted(p)!;
    assert.equal(s.schemaVersion, V1014_FINSTAB_SCHEMA_VERSION);
  });

  it('buildMacroFinancialInputs detects inflation scenario id', () => {
    assert.equal(
      buildMacroFinancialInputs({ turn: 3, gameSettings: { selectedScenarioId: 'high_inflation' } }).highInflationScenario,
      true,
    );
  });

  it('modifiers stay within limits', () => {
    const r = computeNationalMacroFinancialConditions(
      makeDefaultMacroFinancialTestInputs({ highInflationScenario: true, inflationSettingMultiplier: 2 }),
      null,
      null,
    );
    assert.ok(r.state.modifiers.costOfLivingMultiplier <= V1014_FINSTAB_LIMITS.maxCostMultiplier);
    assert.ok(r.state.modifiers.creditSpreadMultiplier <= V1014_FINSTAB_LIMITS.maxCreditSpreadMultiplier);
  });
});

describe('Agent 10 scale-wave extensions', () => {
  it('runAgent10FinanceSelfTests all pass', () => {
    const r = runAgent10FinanceSelfTests();
    assert.equal(r.allPassed, true, r.results.filter((x) => !x.passed).map((x) => `${x.id}:${x.name}`).join('; '));
    assert.ok(r.total >= 92);
  });

  it('transmission channels activate under fiscal critical', () => {
    const hits = evaluatePolicyTransmissionChannels(makeDefaultMacroFinancialTestInputs({ fiscalPressure: 'critical' }));
    assert.ok(hits.some((h) => h.active && h.targetDomain === 'credit'));
  });

  it('shock sequence stacks deltas', () => {
    const seq = runFinancialShockSequence({ inflation: 40, credit: 50, stability: 55 }, ['shock_credit_tightening']);
    assert.ok(seq.scores.credit < 50);
    assert.equal(seq.creditShockActive, true);
  });

  it('round-3 market dynamics mean-revert', () => {
    const step = stepResourceMarketPriceDeterministic({
      resource: 'Wool',
      basePrice: 100,
      currentPrice: 140,
      trend: 'stable',
      randCentered: 0,
    });
    assert.ok(step.nextPrice < 140);
  });

  it('round-3 multi-turn simulation', () => {
    const sim = simulateMacroFinancialTurns(6);
    assert.equal(sim.rows.length, 6);
    assert.ok(sim.finalState.revision >= 6);
  });

  it('round-3 investment climate defer under stress', () => {
    const a = assessInvestmentClimateLink('crisis_defensive', 'restricted', 'high');
    assert.equal(a.deferMegaproject, true);
  });

  it('round-3 scenario preset compute', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'credit_shock_stack');
    assert.ok(inp?.creditShockActive);
    const r = computeNationalMacroFinancialConditions(inp!, null, null);
    assert.ok(r.state.modifiers.creditSpreadMultiplier >= 1);
  });

  it('round-3 tier spread under frozen credit', () => {
    assert.ok(effectiveTierLoanRate('growth', 0.08, 1.3, 'frozen') > 0.15);
  });

  it('round-4 CPI basket weights sum to 1', () => {
    assert.ok(Math.abs(macroCpiBasketWeightSum() - 1) < 0.001);
    const d = decomposeMacroCpiBasket('anchored', 1);
    assert.ok(d.headlineIndex >= 95 && d.headlineIndex <= 105);
  });

  it('round-4 wage spiral under stress', () => {
    const s = assessWagePriceSpiral({
      inflationBand: 'scenario_runaway',
      householdAffordability: 'severe_pressure',
      fiscalPressure: 'critical',
      turn: 1,
    });
    assert.equal(s.spiralRisk, 'critical');
  });

  it('round-4 monetary reaction tightens when inflation high', () => {
    const r = recommendMonetaryStance({
      inflationBand: 'high',
      creditBand: 'neutral',
      inflationScore: 82,
      creditScore: 50,
    });
    assert.ok(r.recommendedStance === 'tightening' || r.recommendedStance === 'restrictive');
  });

  it('round-4 expectations step', () => {
    const e = stepInflationExpectations({
      currentBand: 'elevated',
      priorAnchoringScore: 72,
      fiscalPressure: 'strained',
      turn: 3,
    });
    assert.ok(e.anchoringScore > 0 && e.anchoringScore <= 100);
  });

  it('round-4 agent06 bridge', () => {
    const m = mergeAgent06IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 2,
      gdpGrowthBand: 'strong',
      unemploymentBand: 'low',
      outputGap: 0.02,
      nominalDemandPressure: 0.4,
    });
    assert.ok((m.inflationSettingMultiplier ?? 1) > 1);
  });

  it('round-4 inflation forecast path', () => {
    const p = projectInflationForecastPath(5, makeDefaultMacroFinancialTestInputs({ highInflationScenario: true }));
    assert.equal(p.points.length, 5);
    assert.ok(p.maxCostMultiplier >= 1);
  });

  it('round-4 scenario preset deanchoring', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'deanchoring_stress');
    assert.ok(inp?.fiscalPressure === 'critical' && inp.highInflationScenario);
  });

  it('round-5 phillips slack overheating', () => {
    const p = assessPhillipsSlack('elevated', {
      turn: 1,
      gdpGrowthBand: 'strong',
      unemploymentBand: 'low',
      outputGap: 0.06,
      nominalDemandPressure: 0.7,
    });
    assert.equal(p.slackBand, 'overheated');
  });

  it('round-5 core vs headline spread', () => {
    const s = computeCoreHeadlineSpread('elevated', 2);
    assert.ok(s.coreIndex > 90 && s.headlineIndex > s.coreIndex - 5);
  });

  it('round-5 shock classification', () => {
    const c = classifyInflationShockDrivers(
      'high',
      makeDefaultMacroFinancialTestInputs({ householdAffordability: 'severe_pressure' }),
      null,
    );
    assert.ok(c.driver === 'cost_push' || c.driver === 'mixed');
  });

  it('round-5 fiscal dominance', () => {
    const d = assessFiscalDominance(makeDefaultMacroFinancialTestInputs({ fiscalPressure: 'critical' }));
    assert.notEqual(d.band, 'contained');
  });

  it('round-5 inflation target breach', () => {
    const b = assessInflationTargetBreach(88);
    assert.equal(b.side, 'above');
  });

  it('round-5 regime tracker streak', () => {
    let t = createInitialInflationRegimeTracker();
    t = stepInflationRegimeTracker(t, 1, 'high');
    t = stepInflationRegimeTracker(t, 2, 'high');
    assert.equal(t.bandStreak, 2);
  });

  it('round-5 agent21 forecast bundle', () => {
    const path = projectInflationForecastPath(3);
    const bundle = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('anchored', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(50),
    });
    assert.equal(bundle.horizonTurns, 3);
    assert.ok(path.points[0].regime);
  });

  it('round-5 scenario preset stagflation', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'stagflation_risk_blend');
    assert.ok(inp?.creditShockActive && inp.householdAffordability === 'severe_pressure');
  });

  it('round-6 real rate gap under high inflation', () => {
    const g = assessRealRateGap(85, 'accommodative', 'high');
    assert.ok(g.realRatePercent < g.impliedInflationPercent);
  });

  it('round-6 inflation momentum step', () => {
    const s = stepInflationMomentum(createInitialInflationMomentumState(), 1, 'high');
    assert.ok(s.snapshot.momentumScore >= 0);
  });

  it('round-6 disinflation sacrifice', () => {
    const d = estimateDisinflationSacrifice('elevated', 70, null);
    assert.ok(d.sacrificeRatio > 0 && d.turnsToAnchor >= 2);
  });

  it('round-6 credit inflation feedback', () => {
    const f = assessCreditInflationFeedback('scenario_runaway', 'frozen', true);
    assert.equal(f.feedbackLoop, 'vicious');
  });

  it('round-6 agent07 fiscal bridge', () => {
    const m = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consolidatedDeficitBand: 'large_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'elevated',
    });
    assert.notEqual(m.fiscalPressure, 'healthy');
  });

  it('round-6 agent09 household bridge', () => {
    const m = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'strong',
      wageGrowthBand: 'elevated',
      costOfLivingStress: 'high',
    });
    assert.ok((m.inflationSettingMultiplier ?? 1) > 1);
  });

  it('round-6 forecast momentum on path', () => {
    const p = projectInflationForecastPath(3);
    assert.ok(p.points.every((pt) => typeof pt.momentumScore === 'number'));
  });

  it('round-6 agent21 bundle r6', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
  });

  it('round-6 scenario preset credit vicious loop', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'credit_inflation_vicious_loop');
    assert.ok(inp?.creditShockActive && inp.fiscalPressure === 'critical');
  });

  it('round-7 import price pass-through', () => {
    const a = assessImportPricePassThrough({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'depreciation',
      commodityImportShare: 0.4,
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(a.passThroughBand === 'moderate' || a.passThroughBand === 'strong');
  });

  it('round-7 term premium signal', () => {
    const t = assessTermPremiumInflationSignal({
      inflationBand: 'high',
      fiscalPressure: 'critical',
      sovereignDebtPressure: 'high',
      highInflationScenario: true,
    });
    assert.ok(t.premiumBps > 100);
  });

  it('round-7 agent15 trade bridge', () => {
    const m = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'depreciation',
      commodityImportShare: 0.5,
    });
    assert.ok((m.inflationSettingMultiplier ?? 1) > 1);
  });

  it('round-7 agent08 corporate bridge', () => {
    const m = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      pricingPowerBand: 'strong',
      marginCompression: 'mild',
      passThroughIntent: 'partial',
    });
    assert.ok((m.inflationSettingMultiplier ?? 1) > 1);
  });

  it('round-7 forecast import and term on path', () => {
    const p = projectInflationForecastPath(3);
    assert.ok(p.points.every((pt) => pt.importPassThroughBand && pt.termPremiumSignalBand));
  });

  it('round-7 agent21 bundle r7', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalImportPassThrough);
  });

  it('round-7 scenario preset import shock', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'import_shock_pass_through');
    assert.ok(inp?.highInflationScenario);
  });

  it('round-7 scenario preset corporate pricing', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_pricing_power_spike');
    assert.ok((inp?.inflationSettingMultiplier ?? 0) > 1.3);
  });

  it('round-8 energy price pass-through', () => {
    const e = assessEnergyPricePassThrough({
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(e.passThroughBand === 'sharp' || e.passThroughBand === 'crisis');
  });

  it('round-8 shelter rent inflation', () => {
    const s = assessShelterRentInflation({
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(s.pressureBand === 'hot' || s.pressureBand === 'overheated');
  });

  it('round-8 agent11 cities bridge', () => {
    const m = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.7,
    });
    assert.equal(m.householdInflationScenarioActive, true);
  });

  it('round-8 agent13 energy bridge', () => {
    const m = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-8 forecast energy and shelter on path', () => {
    const p = projectInflationForecastPath(3);
    assert.ok(p.points.every((pt) => pt.energyPassThroughBand && pt.shelterRentPressureBand));
  });

  it('round-8 agent21 bundle r8', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalEnergyPassThrough);
    assert.ok(b.terminalShelterRentPressure);
  });

  it('round-8 scenario preset urban shelter', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'urban_shelter_rent_overheat');
    assert.ok(inp?.householdAffordability === 'severe_pressure');
  });

  it('round-8 scenario preset energy grid crisis', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'energy_grid_crisis_pass_through');
    assert.ok(inp?.systemicLiquidityBand === 'critical');
  });

  it('round-9 food grocery pass-through', () => {
    const f = assessFoodGroceryPassThrough({
      harvestStressBand: 'severe',
      retailMarginPressure: 'high',
      supplyChainDisruption: true,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(f.passThroughBand === 'sharp' || f.passThroughBand === 'supply_shock');
  });

  it('round-9 transport logistics inflation', () => {
    const t = assessTransportLogisticsInflation({
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(t.pressureBand === 'bottleneck' || t.pressureBand === 'crisis');
  });

  it('round-9 agent14 housing bridge', () => {
    const m = mergeAgent14IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      essentialServicesInflationFlag: true,
    });
    assert.equal(m.householdInflationScenarioActive, true);
  });

  it('round-9 agent12 transport bridge', () => {
    const m = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      freightCapacityBand: 'critical',
      fuelSurchargeActive: true,
      portBacklogBand: 'severe',
      logisticsInflationScenarioActive: true,
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-9 forecast food and transport on path', () => {
    const p = projectInflationForecastPath(3);
    assert.ok(p.points.every((pt) => pt.foodGroceryPassThroughBand && pt.transportLogisticsPressureBand));
  });

  it('round-9 agent21 bundle r9', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalFoodGroceryPassThrough);
    assert.ok(b.terminalTransportLogisticsPressure);
  });

  it('round-9 scenario preset food supply chain', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'food_supply_chain_shock');
    assert.ok(inp?.creditShockActive && inp.highInflationScenario);
  });

  it('round-9 scenario preset transport freight', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'transport_freight_bottleneck');
    assert.ok(inp?.systemicLiquidityBand === 'critical');
  });

  it('round-10 healthcare services inflation', () => {
    const h = assessHealthcareServicesInflation({
      wagePressureBand: 'acute',
      demandSurgeActive: true,
      workforceShortageBand: 'severe',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(h.pressureBand === 'stressed' || h.pressureBand === 'crisis');
  });

  it('round-10 insurance premium pass-through', () => {
    const i = assessInsurancePremiumPassThrough({
      claimsInflationBand: 'extreme',
      reinsuranceStress: true,
      catastropheLoadActive: true,
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(i.passThroughBand === 'sharp' || i.passThroughBand === 'hard_market');
  });

  it('round-10 agent03 research bridge', () => {
    const m = mergeAgent03IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      productivityGainBand: 'strong',
      supplySideReliefActive: true,
      innovationInflationOffsetScore: 0.7,
    });
    assert.ok((m.inflationSettingMultiplier ?? 1) < 1);
  });

  it('round-10 agent05 events bridge', () => {
    const m = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-10 forecast healthcare and insurance on path', () => {
    const p = projectInflationForecastPath(3);
    assert.ok(p.points.every((pt) => pt.healthcareServicesPressureBand && pt.insurancePremiumPassThroughBand));
  });

  it('round-10 agent21 bundle r10', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalHealthcareServicesPressure);
    assert.ok(b.terminalInsurancePremiumPassThrough);
  });

  it('round-10 scenario preset healthcare workforce', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'healthcare_workforce_crisis');
    assert.ok((inp?.activeCrises ?? 0) >= 2);
  });

  it('round-10 scenario preset insurance hard market', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'insurance_hard_market_stack');
    assert.ok(inp?.creditShockActive && inp.highInflationScenario);
  });

  it('round-11 education tuition inflation', () => {
    const e = assessEducationTuitionInflation({
      enrollmentPressureBand: 'high',
      subsidyCutActive: true,
      wageIndexationBand: 'strong',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(e.pressureBand === 'sharp' || e.pressureBand === 'crisis');
  });

  it('round-11 communications services inflation', () => {
    const c = assessCommunicationsServicesInflation({
      bandwidthDemandBand: 'extreme',
      regulatedTariffShock: true,
      platformFeePassThrough: 'high',
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(c.pressureBand === 'elevated' || c.pressureBand === 'spike');
  });

  it('round-11 agent04 modes bridge', () => {
    const m = mergeAgent04IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      scenarioInflationBias: 'extreme',
      sandboxStressModeActive: false,
      difficultyCostMultiplier: 1.1,
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-11 agent16 guardian bridge', () => {
    const m = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationGuardrailTripped: true,
      stabilityInterventionBand: 'urgent',
      narrativeShockSeverity: 'high',
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-11 forecast education and comms on path', () => {
    const p = projectInflationForecastPath(3);
    assert.ok(p.points.every((pt) => pt.educationTuitionPressureBand && pt.communicationsServicesPressureBand));
  });

  it('round-11 agent21 bundle r11', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalEducationTuitionPressure);
    assert.ok(b.terminalCommunicationsServicesPressure);
  });

  it('round-11 scenario preset education subsidy', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'education_subsidy_cut_stack');
    assert.ok(inp?.fiscalPressure === 'critical');
  });

  it('round-11 scenario preset comms tariff', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'comms_tariff_platform_spike');
    assert.ok(inp?.systemicLiquidityBand === 'critical');
  });

  it('round-12 recreation leisure inflation', () => {
    const r = assessRecreationLeisureInflation({
      tourismDemandBand: 'surge',
      laborCostPassThrough: 'high',
      discretionarySpendPressure: true,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(r.pressureBand === 'hot' || r.pressureBand === 'boom');
  });

  it('round-12 professional services fee inflation', () => {
    const p = assessProfessionalServicesFeeInflation({
      billingRatePressure: 'extreme',
      complianceCostStack: true,
      corporateDemandBand: 'strong',
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(p.feeBand === 'sharp' || p.feeBand === 'squeeze');
  });

  it('round-12 agent17 command bridge', () => {
    const m = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAlertLevel: 'red',
      inflationFusionScore: 0.8,
      coordinatedTighteningSuggested: true,
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-12 agent18 team bridge', () => {
    const m = mergeAgent18IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consensusInflationOutlook: 'upside_risk',
      briefingUrgencyBand: 'critical',
      crossDomainStressScore: 0.75,
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-12 forecast recreation and professional on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.recreationLeisurePressureBand && pt.professionalServicesFeeBand));
  });

  it('round-12 agent21 bundle r12', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalRecreationLeisurePressure);
    assert.ok(b.terminalProfessionalServicesFee);
  });

  it('round-12 scenario preset tourism leisure', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'tourism_leisure_boom_pass_through');
    assert.ok(inp?.highInflationScenario);
  });

  it('round-12 scenario preset professional fees', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'professional_fee_compliance_stack');
    assert.ok(inp?.creditShockActive);
  });

  it('round-13 childcare services inflation', () => {
    const c = assessChildcareServicesInflation({
      capacityShortageBand: 'severe',
      wageAwardPassThrough: 'strong',
      subsidyIndexationLag: true,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(c.pressureBand === 'sharp' || c.pressureBand === 'crisis');
  });

  it('round-13 government charges inflation', () => {
    const g = assessGovernmentChargesInflation({
      feeIndexationBand: 'above_cpi',
      newLevyStackActive: true,
      localGovernmentPressure: 'high',
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(g.pressureBand === 'elevated' || g.pressureBand === 'step_up');
  });

  it('round-13 agent02 turns bridge', () => {
    const m = mergeAgent02IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      calendarSeasonBand: 'peak_demand',
      policyReviewWindowOpen: true,
      multiTurnInflationCarryover: 0.2,
    });
    assert.ok((m.inflationSettingMultiplier ?? 1) > 1);
  });

  it('round-13 agent20 automation bridge', () => {
    const m = mergeAgent20IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAutopilotInflationBias: 'inflate',
      unattendedShockDriftActive: true,
      automationConfidenceScore: 0.35,
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-13 forecast childcare and gov on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.childcareServicesPressureBand && pt.governmentChargesPressureBand));
  });

  it('round-13 agent21 bundle r13', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalChildcareServicesPressure);
    assert.ok(b.terminalGovernmentChargesPressure);
  });

  it('round-13 scenario preset childcare capacity', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'childcare_capacity_award_stack');
    assert.ok(inp?.householdAffordability === 'severe_pressure');
  });

  it('round-13 scenario preset gov levy step', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'government_levy_indexation_step');
    assert.ok(inp?.fiscalPressure === 'critical');
  });

  it('round-14 water utilities inflation', () => {
    const w = assessWaterUtilitiesInflation({
      droughtStressBand: 'severe',
      infrastructureTariffShock: true,
      recyclingCostPassThrough: 'high',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(w.pressureBand === 'sharp' || w.pressureBand === 'drought_crisis');
  });

  it('round-14 domestic travel inflation', () => {
    const t = assessDomesticTravelInflation({
      routeCapacityBand: 'constrained',
      fuelSurchargePassThrough: true,
      accommodationOccupancyBand: 'full',
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(t.pressureBand === 'hot' || t.pressureBand === 'overheated');
  });

  it('round-14 agent01 strategic bridge', () => {
    const m = mergeAgent01IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      nationalPriorityInflationBias: 'expansionary',
      strategicStockpileStress: true,
      geopoliticalRiskPremium: 0.7,
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-14 agent19 memory bridge', () => {
    const m = mergeAgent19IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      recalledInflationRegimeConfidence: 0.85,
      narrativeDriftTowardHigherInflation: true,
      explainabilityAlertActive: false,
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-14 forecast water and travel on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.waterUtilitiesPressureBand && pt.domesticTravelPressureBand));
  });

  it('round-14 agent21 bundle r14', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalWaterUtilitiesPressure);
    assert.ok(b.terminalDomesticTravelPressure);
  });

  it('round-14 scenario preset water drought', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'water_drought_utility_crisis');
    assert.ok(inp?.systemicLiquidityBand === 'critical');
  });

  it('round-14 scenario preset strategic memory', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'strategic_memory_inflation_drift');
    assert.ok(inp?.highInflationScenario && (inp.inflationSettingMultiplier ?? 0) > 1.25);
  });

  it('round-15 construction materials inflation', () => {
    const m = assessConstructionMaterialsInflation({
      supplyChainStressBand: 'severe',
      laborShortagePassThrough: true,
      importContentShare: 0.4,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(m.pressureBand === 'sharp' || m.pressureBand === 'supply_crunch');
  });

  it('round-15 retail trade margin inflation', () => {
    const r = assessRetailTradeMarginInflation({
      discountingIntensity: 'light',
      inventoryClearanceActive: false,
      wageBillPressure: 'high',
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(r.marginBand === 'expanding' || r.marginBand === 'price_led');
  });

  it('round-15 agent22 ui bridge', () => {
    const m = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'high',
      uiNudgeInflationExpectationsUp: true,
    });
    assert.equal(m.householdInflationScenarioActive, true);
  });

  it('round-15 agent23 dashboards bridge', () => {
    const m = mergeAgent23IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.7,
      dashboardRefreshUrgency: 'critical',
    });
    assert.equal(m.highInflationScenario, true);
  });

  it('round-15 forecast construction and retail on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.constructionMaterialsPressureBand && pt.retailTradeMarginBand));
  });

  it('round-15 agent21 bundle r15', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalConstructionMaterialsPressure);
    assert.ok(b.terminalRetailTradeMargin);
  });

  it('round-15 scenario preset construction crunch', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'construction_materials_supply_crunch');
    assert.ok(inp?.creditShockActive);
  });

  it('round-15 scenario preset dashboard heatmap', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'dashboard_regional_heatmap_alert');
    assert.ok(inp?.systemicLiquidityBand === 'strained');
  });

  it('round-16 financial services fee inflation', () => {
    const f = assessFinancialServicesFeeInflation({
      fundingCostPassThrough: 'high',
      complianceCostStackActive: true,
      depositRateCompetitionBand: 'intense',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(f.feeBand === 'elevated' || f.feeBand === 'fee_shock');
  });

  it('round-16 agricultural farmgate inflation', () => {
    const a = assessAgriculturalFarmgateInflation({
      harvestStressBand: 'severe',
      transportToMarketBand: 'critical',
      inputCostPassThrough: true,
      inflationBand: 'elevated',
      turn: 2,
    });
    assert.ok(a.pressureBand === 'sharp' || a.pressureBand === 'harvest_crisis');
  });

  it('round-16 agent16 financial fee shock bridge', () => {
    const m = mergeAgent16IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationGuardrailTripped: false,
      stabilityInterventionBand: 'none',
      narrativeShockSeverity: 'low',
      financialServicesFeeShockActive: true,
    });
    assert.equal(m.creditShockActive, true);
    assert.equal(m.highInflationScenario, true);
  });

  it('round-16 agent17 farmgate alert bridge', () => {
    const m = mergeAgent17IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      macroAlertLevel: 'amber',
      inflationFusionScore: 0.5,
      coordinatedTighteningSuggested: false,
      farmgateSupplyAlertActive: true,
    });
    assert.equal(m.householdInflationScenarioActive, true);
    assert.equal(m.highInflationScenario, true);
  });

  it('round-16 forecast financial and farmgate on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.financialServicesFeeBand && pt.agriculturalFarmgatePressureBand));
  });

  it('round-16 agent21 bundle r16', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('high', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(80),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalFinancialServicesFee);
    assert.ok(b.terminalAgriculturalFarmgatePressure);
  });

  it('round-16 scenario preset financial fee shock', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'financial_services_fee_shock');
    assert.ok(inp?.creditShockActive && inp.highInflationScenario);
  });

  it('round-17 public utilities grid tariff inflation', () => {
    const g = assessPublicUtilitiesGridTariffInflation({
      serviceReliabilityBand: 'critical',
      outageRiskBand: 'severe',
      capacityMarginBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(g.tariffBand === 'grid_shock' || g.tariffBand === 'elevated');
  });

  it('round-17 ui inflation salience pass-through', () => {
    const u = assessUiInflationSaliencePassThrough({
      dashboardStressHighlight: true,
      playerAttentionBand: 'high',
      uiExpectationsNudgeUp: true,
      phaseShellCoachActive: true,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(u.salienceBand === 'salient' || u.salienceBand === 'attention_shock');
  });

  it('round-17 agent12 utilities grid bridge', () => {
    const m = mergeAgent12IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      freightCapacityBand: 'balanced',
      fuelSurchargeActive: false,
      portBacklogBand: 'clear',
      logisticsInflationScenarioActive: false,
      utilitiesOutageBandSevere: true,
    });
    assert.equal(m.highInflationScenario, true);
    assert.equal(m.systemicLiquidityBand, 'critical');
  });

  it('round-17 agent22 ui utilities bridge', () => {
    const m = mergeAgent22IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationDashboardStressHighlight: true,
      playerAttentionOnCostOfLiving: 'medium',
      uiNudgeInflationExpectationsUp: false,
      utilitiesStressBannerActive: true,
      phaseShellCostOfLivingCoachActive: true,
    });
    assert.equal(m.householdInflationScenarioActive, true);
  });

  it('round-17 forecast grid and ui on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.publicUtilitiesGridTariffBand && pt.uiInflationSalienceBand));
  });

  it('round-17 agent21 bundle r17', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(70),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalPublicUtilitiesGridTariff);
    assert.ok(b.terminalUiInflationSalience);
  });

  it('round-17 scenario preset ui utilities fusion', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'ui_utilities_fusion_stress');
    assert.ok(inp?.highInflationScenario && (inp.inflationSettingMultiplier ?? 1) > 1.25);
  });

  it('round-18 housing mortgage essential inflation', () => {
    const h = assessHousingMortgageEssentialInflation({
      mortgageStressBand: 'severe',
      wellbeingCostBand: 'critical',
      essentialServicesInflationFlag: true,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(h.essentialBand === 'services_shock' || h.essentialBand === 'elevated');
  });

  it('round-18 macro transmission merge inflation', () => {
    const m = assessMacroTransmissionMergeInflation({
      transmissionStabilityFragile: true,
      macroRecoveryRankStressActive: true,
      outputGap: 0.4,
      nominalDemandPressure: 0.5,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(m.mergeBand === 'fragile' || m.mergeBand === 'inline_blocked');
  });

  it('round-18 agent14 inline merge bridge', () => {
    const merged = mergeAgent14IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      mortgageStressBand: 'elevated',
      wellbeingCostBand: 'strained',
      essentialServicesInflationFlag: false,
      inlineMergeTrajectoryBand: 'blocked',
      inlineActivationBoundaryCritical: true,
    });
    assert.equal(merged.highInflationScenario, true);
  });

  it('round-18 agent06 transmission merge bridge', () => {
    const merged = mergeAgent06IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      gdpGrowthBand: 'slow',
      unemploymentBand: 'moderate',
      outputGap: 0.15,
      nominalDemandPressure: 0.25,
      transmissionStabilityFragile: true,
      macroRecoveryRankStressActive: true,
    });
    assert.equal(merged.systemicLiquidityBand, 'strained');
  });

  it('round-18 forecast housing and macro merge on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.housingMortgageEssentialBand && pt.macroTransmissionMergeBand));
  });

  it('round-18 agent21 bundle r18', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(70),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalHousingMortgageEssential);
    assert.ok(b.terminalMacroTransmissionMerge);
  });

  it('round-18 scenario preset housing macro fusion', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'housing_macro_merge_fusion_stress');
    assert.ok(inp?.highInflationScenario && (inp.inflationSettingMultiplier ?? 1) > 1.28);
  });

  it('round-19 dynamic events inflation spillover', () => {
    const e = assessDynamicEventsInflationSpillover({
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'severe',
      stagedEventCostShockBand: 'cascade',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(e.spilloverBand === 'cascade' || e.spilloverBand === 'active');
  });

  it('round-19 dashboard map inflation overlay', () => {
    const d = assessDashboardMapInflationOverlay({
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.8,
      dashboardRefreshUrgency: 'critical',
      dashboardInflationHeatmapSevere: true,
      mapLayerCostOfLivingStressActive: true,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(d.overlayBand === 'map_critical' || d.overlayBand === 'severe');
  });

  it('round-19 agent05 events spillover bridge', () => {
    const merged = mergeAgent05IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      inflationShockEventActive: true,
      supplyDisruptionSeverity: 'national',
      confidenceShockBand: 'uneasy',
      stagedEventCostShockBand: 'cascade',
      macroEventInflationSpilloverActive: true,
    });
    assert.equal(merged.creditShockActive, true);
  });

  it('round-19 agent23 dashboard overlay bridge', () => {
    const merged = mergeAgent23IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      regionalHeatmapInflationAlert: true,
      mapLayerCostPressureScore: 0.72,
      dashboardRefreshUrgency: 'critical',
      dashboardInflationHeatmapSevere: true,
      mapLayerCostOfLivingStressActive: true,
    });
    assert.equal(merged.householdInflationScenarioActive, true);
  });

  it('round-19 forecast events and dashboard on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.dynamicEventsInflationSpilloverBand && pt.dashboardMapInflationOverlayBand));
  });

  it('round-19 agent21 bundle r19', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(70),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalDynamicEventsInflationSpillover);
    assert.ok(b.terminalDashboardMapInflationOverlay);
  });

  it('round-19 scenario preset events dashboard fusion', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'events_dashboard_fusion_stress');
    assert.ok(inp?.highInflationScenario && (inp.inflationSettingMultiplier ?? 1) > 1.29);
  });

  it('round-20 public finance debt service inflation', () => {
    const f = assessPublicFinanceDebtServiceInflation({
      consolidatedDeficitBand: 'large_deficit',
      debtServicePressure: 'critical',
      fiscalAnchorBreached: true,
      indexedChargesInflationPassThrough: true,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(f.debtServiceBand === 'dominance_risk' || f.debtServiceBand === 'elevated');
  });

  it('round-20 population labor wage inflation', () => {
    const l = assessPopulationLaborWageInflation({
      laborParticipationBand: 'weak',
      wageGrowthBand: 'surge',
      costOfLivingStress: 'extreme',
      participationSlackInflationBand: 'severe_slack',
      householdExpectationsDeanchoring: true,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(l.wageBand === 'wage_spiral' || l.wageBand === 'elevated');
  });

  it('round-20 agent07 fiscal anchor bridge', () => {
    const merged = mergeAgent07IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      consolidatedDeficitBand: 'large_deficit',
      revenueMomentum: 'weak',
      debtServicePressure: 'critical',
      fiscalAnchorBreached: true,
      indexedChargesInflationPassThrough: true,
    });
    assert.equal(merged.highInflationScenario, true);
  });

  it('round-20 agent09 labor deanchoring bridge', () => {
    const merged = mergeAgent09IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      laborParticipationBand: 'steady',
      wageGrowthBand: 'elevated',
      costOfLivingStress: 'high',
      participationSlackInflationBand: 'slack',
      householdExpectationsDeanchoring: true,
    });
    assert.equal(merged.highInflationScenario, true);
  });

  it('round-20 forecast fiscal and labor on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.publicFinanceDebtServiceBand && pt.populationLaborWageBand));
  });

  it('round-20 agent21 bundle r20', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(70),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalPublicFinanceDebtService);
    assert.ok(b.terminalPopulationLaborWage);
  });

  it('round-20 scenario preset fiscal labor fusion', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'fiscal_labor_fusion_stress');
    assert.ok(inp?.highInflationScenario && (inp.inflationSettingMultiplier ?? 1) > 1.3);
  });

  it('round-21 wholesale energy transition inflation', () => {
    const e = assessWholesaleEnergyTransitionInflation({
      wholesaleEnergyStress: 'crisis',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'high',
      renewableShortfallInflationFlag: true,
      wholesaleCascadeBand: 'cascade',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(e.transitionBand === 'transition_shock' || e.transitionBand === 'elevated');
  });

  it('round-21 urban rent dispersion inflation', () => {
    const u = assessUrbanRentDispersionInflation({
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.8,
      metroRentDispersionCritical: true,
      regionalHousingInflationSync: true,
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(u.dispersionBand === 'metro_shock' || u.dispersionBand === 'elevated');
  });

  it('round-21 agent13 wholesale cascade bridge', () => {
    const merged = mergeAgent13IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      wholesaleEnergyStress: 'severe',
      retailTariffShock: true,
      gridReliabilityBand: 'fragile',
      emissionsTransitionCostBand: 'medium',
      renewableShortfallInflationFlag: true,
      wholesaleCascadeBand: 'cascade',
    });
    assert.equal(merged.highInflationScenario, true);
  });

  it('round-21 agent11 metro dispersion bridge', () => {
    const merged = mergeAgent11IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      vacancyBand: 'critical',
      rentGrowthBand: 'surging',
      urbanizationPressure: 'high',
      regionalDispersionScore: 0.65,
      metroRentDispersionCritical: true,
      regionalHousingInflationSync: true,
    });
    assert.equal(merged.highInflationScenario, true);
  });

  it('round-21 forecast energy and urban on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.wholesaleEnergyTransitionBand && pt.urbanRentDispersionBand));
  });

  it('round-21 agent21 bundle r21', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(70),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalWholesaleEnergyTransition);
    assert.ok(b.terminalUrbanRentDispersion);
  });

  it('round-21 scenario preset energy cities fusion', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'energy_cities_fusion_stress');
    assert.ok(inp?.highInflationScenario && (inp.inflationSettingMultiplier ?? 1) > 1.31);
  });

  it('round-22 corporate pricing pass-through inflation', () => {
    const c = assessCorporatePricingPassThroughInflation({
      pricingPowerBand: 'dominant',
      marginCompression: 'none',
      passThroughIntent: 'full',
      productionCapacityStrainInflationFlag: true,
      corporateMarkupCascadeBand: 'active',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(c.passThroughBand === 'markup_cascade' || c.passThroughBand === 'elevated');
  });

  it('round-22 trade exchange import inflation', () => {
    const t = assessTradeExchangeImportInflation({
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'sharp_depreciation',
      commodityImportShare: 0.5,
      tariffShockInflationActive: true,
      importPipelineFragileBand: 'critical',
      inflationBand: 'high',
      turn: 2,
    });
    assert.ok(t.importBand === 'fx_shock' || t.importBand === 'elevated');
  });

  it('round-22 agent08 markup cascade bridge', () => {
    const merged = mergeAgent08IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      pricingPowerBand: 'strong',
      marginCompression: 'mild',
      passThroughIntent: 'full',
      productionCapacityStrainInflationFlag: false,
      corporateMarkupCascadeBand: 'active',
    });
    assert.equal(merged.highInflationScenario, true);
  });

  it('round-22 agent15 tariff import bridge', () => {
    const merged = mergeAgent15IntoMacroFinancialInputs(makeDefaultMacroFinancialTestInputs(), {
      turn: 1,
      tradeOpennessBand: 'open',
      exchangeRatePressure: 'depreciation',
      commodityImportShare: 0.4,
      tariffShockInflationActive: true,
      importPipelineFragileBand: 'critical',
    });
    assert.equal(merged.highInflationScenario, true);
  });

  it('round-22 forecast corporate and trade on path', () => {
    const path = projectInflationForecastPath(3);
    assert.ok(path.points.every((pt) => pt.corporatePricingPassThroughBand && pt.tradeExchangeImportBand));
  });

  it('round-22 agent21 bundle r22', () => {
    const path = projectInflationForecastPath(2);
    const b = buildAgent21InflationForecastBundle({
      path,
      regime: null,
      shock: classifyInflationShockDrivers('elevated', makeDefaultMacroFinancialTestInputs(), null),
      fiscalDominance: assessFiscalDominance(makeDefaultMacroFinancialTestInputs()),
      targetBreach: assessInflationTargetBreach(70),
    });
    assert.equal(b.schemaVersion, '10.14.agent10.r22');
    assert.ok(b.terminalCorporatePricingPassThrough);
    assert.ok(b.terminalTradeExchangeImport);
  });

  it('round-22 scenario preset corporate trade fusion', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'corporate_trade_fusion_stress');
    assert.ok(inp?.highInflationScenario && (inp.inflationSettingMultiplier ?? 1) > 1.32);
  });
});
