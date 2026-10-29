import { readMacroDashboardClarityWave43ExportSpilloverFromV1023 } from './bridge-v1023-dashboard-clarity-wave-round43-export.ts';
import { readMacroUiResponsivenessWave43ExportSpilloverFromV1022 } from './bridge-v1022-ui-responsiveness-wave-round43-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionEnvelopeSnapshot } from './macro-transmission-envelope.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave43Integration } from './scenario-wave43-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round43SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiResponsivenessWave43ExportSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave43Export: {
        round43Ready: false,
        o10TaskId: 'O10-217',
        waveRound: 43,
        latencyBand: 'unresponsive',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R43-01', 'Wave 43 UI export not ready drags cycle', ui.cycleNudge <= -2, String(ui.cycleNudge));

  const dash = readMacroDashboardClarityWave43ExportSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardClarityWave43Export: {
        clarityReady: false,
        signalBand: 'misleading',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R43-02', 'Wave 43 clarity export not ready drags investment', dash.investmentNudge <= -2, String(dash.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave43Export: {
        round43Ready: true,
        o10TaskId: 'O10-217',
        waveRound: 43,
        latencyBand: 'fast',
        projectedLocHint: 2_253_960
      },
      dashboardClarityWave43Export: {
        clarityReady: true,
        signalBand: 'clear',
        baselineSha: '641d7d16',
        projectedFunctionalLoc: 2_253_960
      }
    }),
    null,
    null
  );
  record(
    'R43-03',
    'State exposes wave 43 UI export summary',
    integrated.state.uiResponsivenessWave43ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R43-04',
    'Transmission includes dashboard clarity wave 43 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_dashboard_clarity_wave43_export'),
    'ok'
  );
  record(
    'R43-05',
    'Eighty-two transmission layers',
    integrated.state.transmissionReport.layers.length === 82,
    String(integrated.state.transmissionReport.layers.length)
  );

  const envelope = buildMacroTransmissionEnvelopeSnapshot(integrated.state.transmissionReport);
  record(
    'R43-06',
    'Transmission envelope finite',
    Number.isFinite(envelope.envelopeIndex),
    String(envelope.envelopeIndex)
  );
  record(
    'R43-07',
    'Transmission includes UI responsiveness wave 43 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui_responsiveness_wave43_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 65 }),
    [
      {
        id: 'ui_shock',
        overlay: {
          uiResponsivenessWave43Export: { round43Ready: false, o10TaskId: 'O10-217', waveRound: 43, latencyBand: 'critical' }
        }
      },
      {
        id: 'dash_shock',
        overlay: { dashboardClarityWave43Export: { clarityReady: false, signalBand: 'critical', baselineSha: '641d7d16' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave43Integration(compare);
  record('R43-08', 'Wave 43 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R43-09',
    'Wave 43 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave43_ui_dashboard_export_stress',
    includeWave43UiDashboardExportStress: true
  });
  record(
    'R43-10',
    'Wave 43 UI/dashboard export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
