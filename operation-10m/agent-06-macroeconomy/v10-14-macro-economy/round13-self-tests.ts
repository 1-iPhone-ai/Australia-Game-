import { readMacroCitiesSpilloverFromV1011Cities } from './bridge-v1011-cities.ts';
import { readMacroForecastingSpilloverFromV1021 } from './bridge-v1021-forecasting.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionCoverageSnapshot } from './macro-transmission-coverage.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioFrontier } from './scenario-frontier-rank.ts';
import { rankMacroScenarioComposite } from './scenario-composite-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round13SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const cities = readMacroCitiesSpilloverFromV1011Cities(
    makeDefaultV1014_MACRO_TestInputs({
      citiesRegions: { urbanizationBand: 'stagnant', housingPressure: { band: 'severe' }, hubStrength: { band: 'weak' } }
    })
  );
  record('R13-01', 'Metro housing pressure drags cycle', cities.cycleNudge < -1, String(cities.cycleNudge));

  const forecasting = readMacroForecastingSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastingLab: { outlookBand: 'recession', confidenceBand: 'low', dispersionBand: 'wide' }
    })
  );
  record('R13-02', 'Recession forecast drags cycle', forecasting.cycleNudge < -3, String(forecasting.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      citiesRegions: { urbanizationBand: 'surging', hubStrength: { band: 'global' }, housingPressure: { band: 'balanced' } },
      forecastingLab: { outlookBand: 'expansion', confidenceBand: 'high', dispersionBand: 'tight' }
    }),
    null,
    null
  );
  record('R13-03', 'State exposes cities summary', integrated.state.citiesSpilloverSummary != null, 'ok');
  record('R13-04', 'State exposes forecasting summary', integrated.state.forecastingSpilloverSummary != null, 'ok');
  record(
    'R13-05',
    'Twenty-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 28,
    String(integrated.state.transmissionReport.layers.length)
  );

  const coverage = buildMacroTransmissionCoverageSnapshot(integrated.state.transmissionReport);
  record('R13-06', 'Transmission coverage finite', Number.isFinite(coverage.coverageIndex), String(coverage.coverageIndex));
  record(
    'R13-07',
    'Transmission includes cities layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.11_cities'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 24 }),
    [
      { id: 'metro_stress', overlay: { citiesRegions: { housingPressure: { band: 'critical' }, urbanizationBand: 'declining' } } },
      { id: 'forecast_downside', overlay: { forecastingLab: { outlookBand: 'contraction', dispersionBand: 'divergent' } } }
    ],
    null,
    null
  );
  const frontier = rankMacroScenarioFrontier(compare);
  const composite = rankMacroScenarioComposite(compare);
  record('R13-08', 'Scenario frontier preserves row count', frontier.length === 2, String(frontier.length));
  record(
    'R13-09',
    'Frontier and composite both rank scenarios',
    composite.length === 2 && frontier[0].frontierScore >= 0,
    frontier.map(f => f.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'cities_forecasting_stress',
    includeCitiesForecastingStress: true
  });
  record(
    'R13-10',
    'Cities/forecasting regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
