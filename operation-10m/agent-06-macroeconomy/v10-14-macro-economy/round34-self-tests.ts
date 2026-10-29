import { readMacroAutomationThroughputSpilloverFromV1020 } from './bridge-v1020-automation-throughput.ts';
import { readMacroForecastCalibrationSpilloverFromV1021 } from './bridge-v1021-forecast-calibration.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionSaturationSnapshot } from './macro-transmission-saturation.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioProsperity } from './scenario-prosperity-rank.ts';
import { rankMacroScenarioContinuity } from './scenario-continuity-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round34SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const automation = readMacroAutomationThroughputSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationThroughput: { paceBand: 'collapsed', reliabilityBand: 'failing', backlogBand: 'unbounded' }
    })
  );
  record('R34-01', 'Collapsed automation drags productivity', automation.productivityNudge <= -2, String(automation.productivityNudge));

  const forecast = readMacroForecastCalibrationSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastCalibration: { biasBand: 'runaway', horizonBand: 'collapsed', confidenceBand: 'misplaced' }
    })
  );
  record('R34-02', 'Runaway calibration drags investment', forecast.investmentNudge <= -2, String(forecast.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationThroughput: { paceBand: 'strong', reliabilityBand: 'robust', backlogBand: 'light' },
      forecastCalibration: { biasBand: 'well_calibrated', horizonBand: 'stable', confidenceBand: 'grounded' }
    }),
    null,
    null
  );
  record('R34-03', 'State exposes automation throughput summary', integrated.state.automationThroughputSpilloverSummary != null, 'ok');
  record(
    'R34-04',
    'Transmission includes forecast calibration layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_calibration'),
    'ok'
  );
  record(
    'R34-05',
    'Sixty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 66,
    String(integrated.state.transmissionReport.layers.length)
  );

  const saturation = buildMacroTransmissionSaturationSnapshot(integrated.state.transmissionReport);
  record('R34-06', 'Transmission saturation finite', Number.isFinite(saturation.saturationIndex), String(saturation.saturationIndex));
  record(
    'R34-07',
    'Transmission includes automation throughput layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_throughput'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 56 }),
    [
      { id: 'automation_shock', overlay: { automationThroughput: { paceBand: 'critical', backlogBand: 'severe' } } },
      { id: 'forecast_shock', overlay: { forecastCalibration: { biasBand: 'critical', confidenceBand: 'overconfident' } } }
    ],
    null,
    null
  );
  const prosperity = rankMacroScenarioProsperity(compare);
  const continuity = rankMacroScenarioContinuity(compare);
  record('R34-08', 'Scenario prosperity preserves row count', prosperity.length === 2, String(prosperity.length));
  record(
    'R34-09',
    'Prosperity and continuity both rank scenarios',
    continuity.length === 2 && prosperity[0].prosperityPriority >= 0,
    prosperity.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'automation_forecast_stress',
    includeAutomationForecastStress: true
  });
  record(
    'R34-10',
    'Automation/forecast regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
