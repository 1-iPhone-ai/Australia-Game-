import { readMacroInnovationSpilloverFromV104 } from './bridge-v104-innovation.ts';
import { readMacroWorkforceSpilloverFromV107 } from './bridge-v107-workforce.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroCapacitySnapshot } from './macro-capacity-snapshot.ts';
import { readMacroIndustrySpilloverFromV101 } from './bridge-v101-industries.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round6SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const innovation = readMacroInnovationSpilloverFromV104(
    makeDefaultV1014_MACRO_TestInputs({ innovation: { momentum: { band: 'accelerating' }, nationalProductivityBonus: true } })
  );
  record('R6-01', 'Accelerating innovation lifts productivity read', innovation.productivityNudge > 3, String(innovation.productivityNudge));

  const workforce = readMacroWorkforceSpilloverFromV107(
    makeDefaultV1014_MACRO_TestInputs({ workforce: { nationalReadinessBand: 'critical', laborMarket: { slack: 'tight' } } })
  );
  record('R6-02', 'Critical workforce drags productivity', workforce.productivityNudge < -3, String(workforce.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      innovation: { nationalProductivityBonus: true },
      workforce: { nationalReadinessBand: 'strong' }
    }),
    null,
    null
  );
  record('R6-03', 'State exposes innovation summary', integrated.state.innovationSpilloverSummary != null, 'ok');
  record('R6-04', 'State exposes workforce summary', integrated.state.workforceSpilloverSummary != null, 'ok');
  record('R6-05', 'Seventy-eight transmission layers', integrated.state.transmissionReport.layers.length === 84, String(integrated.state.transmissionReport.layers.length));

  const capacity = buildMacroCapacitySnapshot({
    state: integrated.state,
    industry: readMacroIndustrySpilloverFromV101(makeDefaultV1014_MACRO_TestInputs()),
    workforce
  });
  record('R6-06', 'Capacity snapshot finite', Number.isFinite(capacity.index), String(capacity.index));

  record(
    'R6-07',
    'Transmission includes innovation layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.4_innovation'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 9 }),
    [
      { id: 'strong_labor', overlay: { workforce: { nationalReadinessBand: 'strong' } } },
      { id: 'stalled_innovation', overlay: { innovation: { momentum: { band: 'stalled' } } } }
    ],
    null,
    null
  );
  record('R6-08', 'Scenario compare returns two rows', compare.length === 2, String(compare.length));
  record(
    'R6-09',
    'Strong labor raises productivity vs stalled innovation',
    compare[0].delta.productivityScoreDelta >= compare[1].delta.productivityScoreDelta,
    `${compare[0].delta.productivityScoreDelta}/${compare[1].delta.productivityScoreDelta}`
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'labor_innovation_shock',
    includeLaborInnovationStress: true
  });
  record('R6-10', 'Labor/innovation regression harness', harness.allPassed, harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
