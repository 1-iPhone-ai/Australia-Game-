import { readMacroForecastWave39ExportSpilloverFromV1021 } from './bridge-v1021-forecast-wave-round39-export.ts';
import { readMacroAutomationIdleGovernanceWave39ExportSpilloverFromV1020 } from './bridge-v1020-automation-idle-governance-wave-round39-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionCentralitySnapshot } from './macro-transmission-centrality.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave39Integration } from './scenario-wave39-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round39SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const exportSpill = readMacroAutomationIdleGovernanceWave39ExportSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave39Export: {
        round39Ready: false,
        o10TaskId: 'O10-209',
        waveRound: 39,
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R39-01', 'Wave 39 automation export not ready drags investment', exportSpill.investmentNudge <= -2, String(exportSpill.investmentNudge));

  const forecast = readMacroForecastWave39ExportSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastWave39Export: {
        status: 'drift',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R39-02', 'Wave 39 forecast export drift drags cycle', forecast.cycleNudge <= -2, String(forecast.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave39Export: {
        round39Ready: true,
        o10TaskId: 'O10-209',
        waveRound: 39,
        projectedLocHint: 2_082_720
      },
      forecastWave39Export: {
        status: 'aligned',
        baselineSha: '6134c6a',
        projectedFunctionalLoc: 2_082_720
      }
    }),
    null,
    null
  );
  record(
    'R39-03',
    'State exposes wave 39 automation export summary',
    integrated.state.automationIdleGovernanceWave39ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R39-04',
    'Transmission includes forecast wave 39 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_wave39_export'),
    'ok'
  );
  record(
    'R39-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 88,
    String(integrated.state.transmissionReport.layers.length)
  );

  const centrality = buildMacroTransmissionCentralitySnapshot(integrated.state.transmissionReport);
  record(
    'R39-06',
    'Transmission centrality finite',
    Number.isFinite(centrality.centralityIndex),
    String(centrality.centralityIndex)
  );
  record(
    'R39-07',
    'Transmission includes automation wave 39 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance_wave39_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 61 }),
    [
      {
        id: 'auto_shock',
        overlay: {
          automationIdleGovernanceWave39Export: { round39Ready: false, o10TaskId: 'O10-209', waveRound: 39 }
        }
      },
      {
        id: 'forecast_shock',
        overlay: { forecastWave39Export: { status: 'drift', baselineSha: '6134c6a' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave39Integration(compare);
  record('R39-08', 'Wave 39 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R39-09',
    'Wave 39 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave39_automation_forecast_export_stress',
    includeWave39AutomationForecastExportStress: true
  });
  record(
    'R39-10',
    'Wave 39 automation/forecast export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
