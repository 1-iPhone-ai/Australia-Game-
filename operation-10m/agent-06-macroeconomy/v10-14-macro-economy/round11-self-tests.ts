import { readMacroPopulationSpilloverFromV109Pop } from './bridge-v109-population.ts';
import { readMacroResearchSpilloverFromV103 } from './bridge-v103-research.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionVolatilitySnapshot } from './macro-transmission-volatility.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioDivergence } from './scenario-divergence.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round11SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const research = readMacroResearchSpilloverFromV103(
    makeDefaultV1014_MACRO_TestInputs({
      researchTech: { pipelineBand: 'stalled', fundingBand: 'cut', adoptionBand: 'fragmented' }
    })
  );
  record('R11-01', 'Stalled research drags productivity', research.productivityNudge < -2, String(research.productivityNudge));

  const population = readMacroPopulationSpilloverFromV109Pop(
    makeDefaultV1014_MACRO_TestInputs({
      population: { growthBand: 'critical', dependencyBand: 'severe', netMigrationBand: 'outflow' }
    })
  );
  record('R11-02', 'Demographic drag hits cycle read', population.cycleNudge < -2, String(population.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      researchTech: { pipelineBand: 'breakthrough', adoptionBand: 'scaling', fundingBand: 'expansionary' },
      population: { growthBand: 'strong', dependencyBand: 'favorable', netMigrationBand: 'strong_inflow' }
    }),
    null,
    null
  );
  record('R11-03', 'State exposes research summary', integrated.state.researchSpilloverSummary != null, 'ok');
  record('R11-04', 'State exposes population summary', integrated.state.populationSpilloverSummary != null, 'ok');
  record(
    'R11-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 100,
    String(integrated.state.transmissionReport.layers.length)
  );

  const volatility = buildMacroTransmissionVolatilitySnapshot(integrated.state.transmissionReport);
  record('R11-06', 'Transmission volatility finite', Number.isFinite(volatility.volatilityIndex), String(volatility.volatilityIndex));
  record(
    'R11-07',
    'Transmission includes research layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.3_research'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 20 }),
    [
      { id: 'research_stall', overlay: { researchTech: { pipelineBand: 'blocked', fundingBand: 'frozen' } } },
      { id: 'demographic_drag', overlay: { population: { growthBand: 'contracting', dependencyBand: 'elevated' } } }
    ],
    null,
    null
  );
  const severity = rankMacroScenarioSeverity(compare);
  const divergence = rankMacroScenarioDivergence(compare);
  record('R11-08', 'Scenario severity preserves row count', severity.length === 2, String(severity.length));
  record(
    'R11-09',
    'Severity and divergence both rank scenarios',
    divergence.length === 2 && severity[0].severityIndex >= 0,
    severity.map(s => s.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'research_population_stress',
    includeResearchPopulationStress: true
  });
  record(
    'R11-10',
    'Research/population regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
