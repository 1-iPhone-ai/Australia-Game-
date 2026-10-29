import { readMacroUiSpilloverFromV1022 } from './bridge-v1022-ui.ts';
import { readMacroUtilitiesSpilloverFromV1012Utilities } from './bridge-v1012-utilities.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionStabilitySnapshot } from './macro-transmission-stability.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioContingency } from './scenario-contingency-rank.ts';
import { rankMacroScenarioRecovery } from './scenario-recovery-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round17SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const ui = readMacroUiSpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      gameUi: {
        panelLatency: { band: 'critical' },
        navigationClutter: { band: 'overloaded' },
        renderHealth: { band: 'unstable' }
      }
    })
  );
  record('R17-01', 'Critical UI latency drags productivity', ui.productivityNudge < -1, String(ui.productivityNudge));

  const utilities = readMacroUtilitiesSpilloverFromV1012Utilities(
    makeDefaultV1014_MACRO_TestInputs({
      utilitiesGrid: {
        serviceReliability: { band: 'fragile' },
        outageBand: 'rolling',
        capacityMargin: { band: 'thin' }
      }
    })
  );
  record('R17-02', 'Rolling utility outages drag cycle', utilities.cycleNudge < -2, String(utilities.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      gameUi: {
        panelLatency: { band: 'critical' },
        navigationClutter: { band: 'clear' },
        renderHealth: { band: 'stable' }
      },
      utilitiesGrid: {
        serviceReliability: { band: 'fragile' },
        outageBand: 'rare',
        capacityMargin: { band: 'ample' }
      }
    }),
    null,
    null
  );
  record('R17-03', 'State exposes UI summary', integrated.state.uiSpilloverSummary != null, 'ok');
  record('R17-04', 'State exposes utilities summary', integrated.state.utilitiesSpilloverSummary != null, 'ok');
  record(
    'R17-05',
    'Forty-four transmission layers',
    integrated.state.transmissionReport.layers.length === 44,
    String(integrated.state.transmissionReport.layers.length)
  );

  const stability = buildMacroTransmissionStabilitySnapshot(integrated.state.transmissionReport);
  record('R17-06', 'Transmission stability finite', Number.isFinite(stability.stabilityIndex), String(stability.stabilityIndex));
  record(
    'R17-07',
    'Transmission includes UI layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_ui'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 32 }),
    [
      { id: 'ui_clutter', overlay: { gameUi: { navigationClutter: { band: 'critical' }, renderHealth: { band: 'fragile' } } } },
      {
        id: 'utilities_outage',
        overlay: { utilitiesGrid: { outageBand: 'severe', serviceReliability: { band: 'critical' } } }
      }
    ],
    null,
    null
  );
  const recovery = rankMacroScenarioRecovery(compare);
  const contingency = rankMacroScenarioContingency(compare);
  record('R17-08', 'Scenario recovery preserves row count', recovery.length === 2, String(recovery.length));
  record(
    'R17-09',
    'Recovery and contingency both rank scenarios',
    contingency.length === 2 && recovery[0].recoveryPriority >= 0,
    recovery.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'ui_utilities_stress',
    includeUiUtilitiesStress: true
  });
  record(
    'R17-10',
    'UI/utilities regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
