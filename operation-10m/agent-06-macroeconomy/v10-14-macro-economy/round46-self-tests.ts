import { readMacroDashboardClarityWave46ExportSpilloverFromV1023 } from './bridge-v1023-dashboard-clarity-wave-round46-export.ts';
import { readMacroUiResponsivenessWave46ExportSpilloverFromV1022 } from './bridge-v1022-ui-responsiveness-wave-round46-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionEnvelopeSnapshot } from './macro-transmission-envelope.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave46Integration } from './scenario-wave46-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round46SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiResponsivenessWave46ExportSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave46Export: {
        round46Ready: false,
        o10TaskId: 'O10-223',
        waveRound: 46,
        latencyBand: 'unresponsive',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R46-01', 'Wave 46 UI export not ready drags cycle', ui.cycleNudge <= -2, String(ui.cycleNudge));

  const dash = readMacroDashboardClarityWave46ExportSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardClarityWave46Export: {
        clarityReady: false,
        signalBand: 'misleading',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R46-02', 'Wave 46 clarity export not ready drags investment', dash.investmentNudge <= -2, String(dash.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave46Export: {
        round46Ready: true,
        o10TaskId: 'O10-223',
        waveRound: 46,
        latencyBand: 'fast',
        projectedLocHint: 2_593_189
      },
      dashboardClarityWave46Export: {
        clarityReady: true,
        signalBand: 'clear',
        baselineSha: 'a9bb07e5',
        projectedFunctionalLoc: 2_593_189
      }
    }),
    null,
    null
  );
  record(
    'R46-03',
    'State exposes wave 46 UI export summary',
    integrated.state.uiResponsivenessWave46ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R46-04',
    'Transmission includes dashboard clarity wave 46 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_dashboard_clarity_wave46_export'),
    'ok'
  );
  record(
    'R46-05',
    'Eighty-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 94,
    String(integrated.state.transmissionReport.layers.length)
  );

  const envelope = buildMacroTransmissionEnvelopeSnapshot(integrated.state.transmissionReport);
  record(
    'R46-06',
    'Transmission envelope finite',
    Number.isFinite(envelope.envelopeIndex),
    String(envelope.envelopeIndex)
  );
  record(
    'R46-07',
    'Transmission includes UI responsiveness wave 46 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui_responsiveness_wave46_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 68 }),
    [
      {
        id: 'ui_shock',
        overlay: {
          uiResponsivenessWave46Export: { round46Ready: false, o10TaskId: 'O10-223', waveRound: 46, latencyBand: 'critical' }
        }
      },
      {
        id: 'dash_shock',
        overlay: { dashboardClarityWave46Export: { clarityReady: false, signalBand: 'critical', baselineSha: 'a9bb07e5' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave46Integration(compare);
  record('R46-08', 'Wave 46 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R46-09',
    'Wave 46 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave46_ui_dashboard_export_stress',
    includeWave46UiDashboardExportStress: true
  });
  record(
    'R46-10',
    'Wave 46 UI/dashboard export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
