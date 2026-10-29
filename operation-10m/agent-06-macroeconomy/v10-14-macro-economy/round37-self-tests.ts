import { readMacroDashboardClarityWave37ExportSpilloverFromV1023 } from './bridge-v1023-dashboard-clarity-wave-round37-export.ts';
import { readMacroUiResponsivenessWave37ExportSpilloverFromV1022 } from './bridge-v1022-ui-responsiveness-wave-round37-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionRedundancySnapshot } from './macro-transmission-redundancy.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave37Integration } from './scenario-wave37-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round37SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiResponsivenessWave37ExportSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave37Export: {
        round37Ready: false,
        o10TaskId: 'O10-205',
        waveRound: 37,
        latencyBand: 'unresponsive',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R37-01', 'Wave 37 UI export not ready drags cycle', ui.cycleNudge <= -2, String(ui.cycleNudge));

  const dash = readMacroDashboardClarityWave37ExportSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardClarityWave37Export: {
        clarityReady: false,
        signalBand: 'misleading',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R37-02', 'Wave 37 clarity export not ready drags investment', dash.investmentNudge <= -2, String(dash.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave37Export: {
        round37Ready: true,
        o10TaskId: 'O10-205',
        waveRound: 37,
        latencyBand: 'fast',
        projectedLocHint: 2_001_028
      },
      dashboardClarityWave37Export: {
        clarityReady: true,
        signalBand: 'clear',
        baselineSha: 'cfb4603',
        projectedFunctionalLoc: 2_001_028
      }
    }),
    null,
    null
  );
  record(
    'R37-03',
    'State exposes wave 37 UI export summary',
    integrated.state.uiResponsivenessWave37ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R37-04',
    'Transmission includes dashboard clarity wave 37 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_dashboard_clarity_wave37_export'),
    'ok'
  );
  record(
    'R37-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const redundancy = buildMacroTransmissionRedundancySnapshot(integrated.state.transmissionReport);
  record(
    'R37-06',
    'Transmission redundancy finite',
    Number.isFinite(redundancy.redundancyIndex),
    String(redundancy.redundancyIndex)
  );
  record(
    'R37-07',
    'Transmission includes UI responsiveness wave 37 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui_responsiveness_wave37_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 59 }),
    [
      {
        id: 'ui_shock',
        overlay: {
          uiResponsivenessWave37Export: { round37Ready: false, o10TaskId: 'O10-205', waveRound: 37, latencyBand: 'critical' }
        }
      },
      {
        id: 'dash_shock',
        overlay: { dashboardClarityWave37Export: { clarityReady: false, signalBand: 'critical', baselineSha: 'cfb4603' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave37Integration(compare);
  record('R37-08', 'Wave 37 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R37-09',
    'Wave 37 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave37_ui_dashboard_export_stress',
    includeWave37UiDashboardExportStress: true
  });
  record(
    'R37-10',
    'Wave 37 UI/dashboard export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
