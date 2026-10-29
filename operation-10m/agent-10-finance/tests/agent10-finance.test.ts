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
    assert.equal(b.schemaVersion, '10.14.agent10.r6');
  });

  it('round-6 scenario preset credit vicious loop', () => {
    const inp = applyMacroFinancialScenarioPreset(makeDefaultMacroFinancialTestInputs(), 'credit_inflation_vicious_loop');
    assert.ok(inp?.creditShockActive && inp.fiscalPressure === 'critical');
  });
});
