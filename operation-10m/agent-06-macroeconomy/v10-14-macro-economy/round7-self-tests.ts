import { readMacroHousingSpilloverFromV1014Housing } from './bridge-v1014-housing.ts';
import { readMacroStrategicSpilloverFromV109 } from './bridge-v109-strategic.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionBalanceSnapshot } from './macro-transmission-balance.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroEconomyScenariosByNetOutcome } from './scenario-ranking.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round7SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const strategic = readMacroStrategicSpilloverFromV109(
    makeDefaultV1014_MACRO_TestInputs({
      strategicCapital: { allocationBand: 'expansionary', nationalPriority: 'infrastructure', momentum: { band: 'strong' } }
    })
  );
  record('R7-01', 'Expansionary strategic lifts investment read', strategic.investmentNudge > 3, String(strategic.investmentNudge));

  const housing = readMacroHousingSpilloverFromV1014Housing(
    makeDefaultV1014_MACRO_TestInputs({
      housingWellbeing: { affordability: { band: 'stressed' }, construction: { band: 'correction' } }
    })
  );
  record('R7-02', 'Housing correction drags investment', housing.investmentNudge < -3, String(housing.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      strategicCapital: { allocationBand: 'growth' },
      housingWellbeing: { affordability: { band: 'balanced' }, wellbeing: { band: 'strong' } }
    }),
    null,
    null
  );
  record('R7-03', 'State exposes strategic summary', integrated.state.strategicSpilloverSummary != null, 'ok');
  record('R7-04', 'State exposes housing summary', integrated.state.housingSpilloverSummary != null, 'ok');
  record(
    'R7-05',
    'Forty-two transmission layers',
    integrated.state.transmissionReport.layers.length === 42,
    String(integrated.state.transmissionReport.layers.length)
  );

  const balance = buildMacroTransmissionBalanceSnapshot(integrated.state.transmissionReport);
  record('R7-06', 'Transmission balance finite', Number.isFinite(balance.dispersionIndex), String(balance.dispersionIndex));
  record(
    'R7-07',
    'Transmission includes strategic layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.9_strategic'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 12 }),
    [
      { id: 'expansionary_strategic', overlay: { strategicCapital: { allocationBand: 'expansionary' } } },
      { id: 'housing_correction', overlay: { housingWellbeing: { construction: { band: 'correction' } } } }
    ],
    null,
    null
  );
  const ranked = rankMacroEconomyScenariosByNetOutcome(compare);
  record('R7-08', 'Scenario ranking preserves row count', ranked.length === 2, String(ranked.length));
  record(
    'R7-09',
    'Expansionary strategic ranks above housing correction',
    ranked[0].scenarioId === 'expansionary_strategic',
    ranked.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'housing_strategic_stress',
    includeHousingStrategicStress: true
  });
  record(
    'R7-10',
    'Housing/strategic regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
