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

  check('a10_r3b_01', 'scenario preset count', MACRO_FINANCIAL_SCENARIO_PRESETS.length >= 6);
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

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, results };
}
