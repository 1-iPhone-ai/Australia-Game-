import { readMacroCreditSpilloverFromV1016 } from './bridge-v1016-credit.ts';
import { computeMacroCounterfactualDelta } from './counterfactual-delta.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroStressIndexSnapshot } from './macro-stress-index.ts';
import { buildMacroPolicyStanceSnapshot } from './policy-stance-snapshot.ts';
import { readMacroFiscalSpilloverFromV1012 } from './bridge-v1012-fiscal.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round5SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const credit = readMacroCreditSpilloverFromV1016(
    makeDefaultV1014_MACRO_TestInputs({
      creditMarkets: { spreadBand: 'stressed', policyStance: 'restrictive' }
    })
  );
  record('R5-01', 'Stressed credit tightens investment read', credit.investmentNudge < -3, String(credit.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      creditMarkets: { spreadBand: 'wide', liquidity: { band: 'strained' } },
      publicFinance: { pressure: 'strained' }
    }),
    null,
    null
  );
  record('R5-02', 'State exposes credit spillover summary', integrated.state.creditSpilloverSummary != null, 'ok');
  record('R5-03', 'Stress index finite', Number.isFinite(integrated.state.stressIndex.score), String(integrated.state.stressIndex.score));
  record(
    'R5-04',
    'Monetary/fiscal clamp gate',
    integrated.state.consistencyGates.some(g => g.id === 'monetary_fiscal_clamp'),
    integrated.state.consistencyGates.map(g => g.id).join(',')
  );

  const stance = buildMacroPolicyStanceSnapshot({
    inputs: makeDefaultV1014_MACRO_TestInputs({ publicFinance: { pressure: 'critical' } }),
    state: { investmentClimate: 'frozen', cyclePhase: 'contraction' },
    fiscal: readMacroFiscalSpilloverFromV1012(
      makeDefaultV1014_MACRO_TestInputs({ publicFinance: { pressure: 'critical' } })
    ),
    credit
  });
  record('R5-05', 'Conflicted policy stance under dual tightening', stance.stance === 'conflicted', stance.stance);

  const stress = buildMacroStressIndexSnapshot(integrated.state);
  record('R5-06', 'Stress band matches score', stress.band !== 'calm' || stress.score < 34, `${stress.band}/${stress.score}`);

  const delta = computeMacroCounterfactualDelta(
    makeDefaultV1014_MACRO_TestInputs({ turn: 6 }),
    { creditShockActive: true },
    null,
    null
  );
  record('R5-07', 'Counterfactual credit shock lowers investment', delta.investmentScoreDelta < 0, String(delta.investmentScoreDelta));

  const harness = runMacroEconomyRegressionHarness({ turns: 10, scenarioId: 'credit_crunch', includeCreditStress: true });
  record('R5-08', 'Credit regression harness', harness.allPassed, harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok');

  record(
    'R5-09',
    'Debrief mentions stress when elevated',
    integrated.state.stressIndex.band !== 'calm'
      ? integrated.state.debrief.bullets.some(b => b.includes('stress'))
      : true,
    integrated.state.debrief.bullets.join('|').slice(0, 80)
  );

  record('R5-10', 'Transmission includes credit layer', integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.16_credit'), 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
