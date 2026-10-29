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

  const passed = results.filter((r) => r.passed).length;
  const failed = results.length - passed;
  return { passed, failed, total: results.length, allPassed: failed === 0, results };
}
