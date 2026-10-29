import { readMacroClimatePolicySpilloverFromV1018Climate } from './bridge-v1018-climate-policy.ts';
import { readMacroForecastDispersionSpilloverFromV1021 } from './bridge-v1021-forecast-dispersion.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPolarizationSnapshot } from './macro-transmission-polarization.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioAdaptation } from './scenario-adaptation-rank.ts';
import { rankMacroScenarioMitigation } from './scenario-mitigation-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round21SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const climate = readMacroClimatePolicySpilloverFromV1018Climate(
    makeDefaultV1014_MACRO_TestInputs({
      climatePolicy: {
        transitionBand: 'disruptive',
        carbonPriceBand: 'punitive',
        complianceBand: 'binding'
      }
    })
  );
  record('R21-01', 'Disruptive climate drags cycle', climate.cycleNudge < -2, String(climate.cycleNudge));

  const forecast = readMacroForecastDispersionSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastingLab: {
        dispersionBand: 'extreme',
        confidenceBand: 'low',
        disagreementBand: 'polarized'
      }
    })
  );
  record('R21-02', 'Extreme forecast dispersion drags investment', forecast.investmentNudge < -2, String(forecast.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      climatePolicy: { transitionBand: 'steady', carbonPriceBand: 'moderate', complianceBand: 'light' },
      forecastingLab: { dispersionBand: 'tight', confidenceBand: 'high', disagreementBand: 'aligned' }
    }),
    null,
    null
  );
  record('R21-03', 'State exposes climate summary', integrated.state.climateSpilloverSummary != null, 'ok');
  record('R21-04', 'State exposes forecast dispersion summary', integrated.state.forecastDispersionSpilloverSummary != null, 'ok');
  record(
    'R21-05',
    'Seventy-four transmission layers',
    integrated.state.transmissionReport.layers.length === 74,
    String(integrated.state.transmissionReport.layers.length)
  );

  const polarization = buildMacroTransmissionPolarizationSnapshot(integrated.state.transmissionReport);
  record(
    'R21-06',
    'Transmission polarization finite',
    Number.isFinite(polarization.polarizationIndex),
    String(polarization.polarizationIndex)
  );
  record(
    'R21-07',
    'Transmission includes climate layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.18_climate'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 36 }),
    [
      {
        id: 'climate_shock',
        overlay: { climatePolicy: { transitionBand: 'shock', complianceBand: 'critical' } }
      },
      {
        id: 'forecast_noise',
        overlay: { forecastingLab: { dispersionBand: 'critical', confidenceBand: 'fragmented' } }
      }
    ],
    null,
    null
  );
  const adaptation = rankMacroScenarioAdaptation(compare);
  const mitigation = rankMacroScenarioMitigation(compare);
  record('R21-08', 'Scenario adaptation preserves row count', adaptation.length === 2, String(adaptation.length));
  record(
    'R21-09',
    'Adaptation and mitigation both rank scenarios',
    mitigation.length === 2 && adaptation[0].adaptationPriority >= 0,
    adaptation.map(a => a.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'climate_forecast_stress',
    includeClimateForecastStress: true
  });
  record(
    'R21-10',
    'Climate/forecast regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
