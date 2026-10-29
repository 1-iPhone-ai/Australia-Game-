import { readMacroForecastWave44ExportSpilloverFromV1021 } from './bridge-v1021-forecast-wave-round44-export.ts';
import { readMacroAutomationIdleGovernanceWave44ExportSpilloverFromV1020 } from './bridge-v1020-automation-idle-governance-wave-round44-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionGradientSnapshot } from './macro-transmission-gradient.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave44Integration } from './scenario-wave44-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round44SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const exportSpill = readMacroAutomationIdleGovernanceWave44ExportSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave44Export: {
        round44Ready: false,
        o10TaskId: 'O10-219',
        waveRound: 44,
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R44-01', 'Wave 44 automation export not ready drags investment', exportSpill.investmentNudge <= -2, String(exportSpill.investmentNudge));

  const forecast = readMacroForecastWave44ExportSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastWave44Export: {
        status: 'drift',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R44-02', 'Wave 44 forecast export drift drags cycle', forecast.cycleNudge <= -2, String(forecast.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave44Export: {
        round44Ready: true,
        o10TaskId: 'O10-219',
        waveRound: 44,
        projectedLocHint: 2_503_353
      },
      forecastWave44Export: {
        status: 'aligned',
        baselineSha: 'bca7e0a3',
        projectedFunctionalLoc: 2_503_353
      }
    }),
    null,
    null
  );
  record(
    'R44-03',
    'State exposes wave 44 automation export summary',
    integrated.state.automationIdleGovernanceWave44ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R44-04',
    'Transmission includes forecast wave 44 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_wave44_export'),
    'ok'
  );
  record(
    'R44-05',
    'Eighty-four transmission layers',
    integrated.state.transmissionReport.layers.length === 100,
    String(integrated.state.transmissionReport.layers.length)
  );

  const gradient = buildMacroTransmissionGradientSnapshot(integrated.state.transmissionReport);
  record(
    'R44-06',
    'Transmission gradient finite',
    Number.isFinite(gradient.gradientIndex),
    String(gradient.gradientIndex)
  );
  record(
    'R44-07',
    'Transmission includes automation wave 44 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance_wave44_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 66 }),
    [
      {
        id: 'auto_shock',
        overlay: {
          automationIdleGovernanceWave44Export: { round44Ready: false, o10TaskId: 'O10-219', waveRound: 44 }
        }
      },
      {
        id: 'forecast_shock',
        overlay: { forecastWave44Export: { status: 'drift', baselineSha: 'bca7e0a3' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave44Integration(compare);
  record('R44-08', 'Wave 44 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R44-09',
    'Wave 44 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave44_automation_forecast_export_stress',
    includeWave44AutomationForecastExportStress: true
  });
  record(
    'R44-10',
    'Wave 44 automation/forecast export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
