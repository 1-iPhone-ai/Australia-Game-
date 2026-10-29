import { readMacroForecastWave42ExportSpilloverFromV1021 } from './bridge-v1021-forecast-wave-round42-export.ts';
import { readMacroAutomationIdleGovernanceWave42ExportSpilloverFromV1020 } from './bridge-v1020-automation-idle-governance-wave-round42-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionGradientSnapshot } from './macro-transmission-gradient.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave42Integration } from './scenario-wave42-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round42SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const exportSpill = readMacroAutomationIdleGovernanceWave42ExportSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave42Export: {
        round42Ready: false,
        o10TaskId: 'O10-215',
        waveRound: 42,
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R42-01', 'Wave 42 automation export not ready drags investment', exportSpill.investmentNudge <= -2, String(exportSpill.investmentNudge));

  const forecast = readMacroForecastWave42ExportSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastWave42Export: {
        status: 'drift',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R42-02', 'Wave 42 forecast export drift drags cycle', forecast.cycleNudge <= -2, String(forecast.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave42Export: {
        round42Ready: true,
        o10TaskId: 'O10-215',
        waveRound: 42,
        projectedLocHint: 2_207_543
      },
      forecastWave42Export: {
        status: 'aligned',
        baselineSha: '431df5d',
        projectedFunctionalLoc: 2_207_543
      }
    }),
    null,
    null
  );
  record(
    'R42-03',
    'State exposes wave 42 automation export summary',
    integrated.state.automationIdleGovernanceWave42ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R42-04',
    'Transmission includes forecast wave 42 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_wave42_export'),
    'ok'
  );
  record(
    'R42-05',
    'Eighty transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const gradient = buildMacroTransmissionGradientSnapshot(integrated.state.transmissionReport);
  record(
    'R42-06',
    'Transmission gradient finite',
    Number.isFinite(gradient.gradientIndex),
    String(gradient.gradientIndex)
  );
  record(
    'R42-07',
    'Transmission includes automation wave 42 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance_wave42_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 64 }),
    [
      {
        id: 'auto_shock',
        overlay: {
          automationIdleGovernanceWave42Export: { round42Ready: false, o10TaskId: 'O10-215', waveRound: 42 }
        }
      },
      {
        id: 'forecast_shock',
        overlay: { forecastWave42Export: { status: 'drift', baselineSha: '431df5d' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave42Integration(compare);
  record('R42-08', 'Wave 42 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R42-09',
    'Wave 42 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave42_automation_forecast_export_stress',
    includeWave42AutomationForecastExportStress: true
  });
  record(
    'R42-10',
    'Wave 42 automation/forecast export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
