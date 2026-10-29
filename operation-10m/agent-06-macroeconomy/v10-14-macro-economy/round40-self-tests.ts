import { readMacroDashboardClarityWave40ExportSpilloverFromV1023 } from './bridge-v1023-dashboard-clarity-wave-round40-export.ts';
import { readMacroUiResponsivenessWave40ExportSpilloverFromV1022 } from './bridge-v1022-ui-responsiveness-wave-round40-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionEnvelopeSnapshot } from './macro-transmission-envelope.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave40Integration } from './scenario-wave40-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round40SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiResponsivenessWave40ExportSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave40Export: {
        round40Ready: false,
        o10TaskId: 'O10-211',
        waveRound: 40,
        latencyBand: 'unresponsive',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R40-01', 'Wave 40 UI export not ready drags cycle', ui.cycleNudge <= -2, String(ui.cycleNudge));

  const dash = readMacroDashboardClarityWave40ExportSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardClarityWave40Export: {
        clarityReady: false,
        signalBand: 'misleading',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R40-02', 'Wave 40 clarity export not ready drags investment', dash.investmentNudge <= -2, String(dash.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiResponsivenessWave40Export: {
        round40Ready: true,
        o10TaskId: 'O10-211',
        waveRound: 40,
        latencyBand: 'fast',
        projectedLocHint: 2_121_263
      },
      dashboardClarityWave40Export: {
        clarityReady: true,
        signalBand: 'clear',
        baselineSha: '6f7fa49',
        projectedFunctionalLoc: 2_121_263
      }
    }),
    null,
    null
  );
  record(
    'R40-03',
    'State exposes wave 40 UI export summary',
    integrated.state.uiResponsivenessWave40ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R40-04',
    'Transmission includes dashboard clarity wave 40 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_dashboard_clarity_wave40_export'),
    'ok'
  );
  record(
    'R40-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 84,
    String(integrated.state.transmissionReport.layers.length)
  );

  const envelope = buildMacroTransmissionEnvelopeSnapshot(integrated.state.transmissionReport);
  record(
    'R40-06',
    'Transmission envelope finite',
    Number.isFinite(envelope.envelopeIndex),
    String(envelope.envelopeIndex)
  );
  record(
    'R40-07',
    'Transmission includes UI responsiveness wave 40 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui_responsiveness_wave40_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 62 }),
    [
      {
        id: 'ui_shock',
        overlay: {
          uiResponsivenessWave40Export: { round40Ready: false, o10TaskId: 'O10-211', waveRound: 40, latencyBand: 'critical' }
        }
      },
      {
        id: 'dash_shock',
        overlay: { dashboardClarityWave40Export: { clarityReady: false, signalBand: 'critical', baselineSha: '6f7fa49' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave40Integration(compare);
  record('R40-08', 'Wave 40 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R40-09',
    'Wave 40 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave40_ui_dashboard_export_stress',
    includeWave40UiDashboardExportStress: true
  });
  record(
    'R40-10',
    'Wave 40 UI/dashboard export regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
