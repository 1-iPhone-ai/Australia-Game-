import { readMacroGuardianSpilloverFromV1016Guardian } from './bridge-v1016-guardian.ts';
import { readMacroModesSpilloverFromV1006 } from './bridge-v1006-modes.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionResilienceSnapshot } from './macro-transmission-resilience.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioComposite } from './scenario-composite-rank.ts';
import { rankMacroScenarioSeverity } from './scenario-severity.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round12SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const modes = readMacroModesSpilloverFromV1006(
    makeDefaultV1014_MACRO_TestInputs({
      modesScenarios: { difficultyBand: 'crisis', campaignMomentum: { band: 'stalled' }, scenarioVolatility: { band: 'chaotic' } }
    })
  );
  record('R12-01', 'Crisis scenario drags cycle read', modes.cycleNudge < -3, String(modes.cycleNudge));

  const guardian = readMacroGuardianSpilloverFromV1016Guardian(
    makeDefaultV1014_MACRO_TestInputs({
      guardianCopilot: { alertBand: 'critical', openWarningCount: 6, guidanceConfidence: { band: 'low' } }
    })
  );
  record('R12-02', 'Critical guardian drags investment', guardian.investmentNudge < -2, String(guardian.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      modesScenarios: { difficultyBand: 'relaxed', campaignMomentum: { band: 'summit_push' }, scenarioVolatility: { band: 'stable' } },
      guardianCopilot: { alertBand: 'calm', openWarningCount: 0, guidanceConfidence: { band: 'high' } }
    }),
    null,
    null
  );
  record('R12-03', 'State exposes modes summary', integrated.state.modesSpilloverSummary != null, 'ok');
  record('R12-04', 'State exposes guardian summary', integrated.state.guardianSpilloverSummary != null, 'ok');
  record(
    'R12-05',
    'Sixty-two transmission layers',
    integrated.state.transmissionReport.layers.length === 62,
    String(integrated.state.transmissionReport.layers.length)
  );

  const resilience = buildMacroTransmissionResilienceSnapshot(integrated.state.transmissionReport);
  record('R12-06', 'Transmission resilience finite', Number.isFinite(resilience.resilienceIndex), String(resilience.resilienceIndex));
  record(
    'R12-07',
    'Transmission includes modes layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.6_modes'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 22 }),
    [
      { id: 'crisis_mode', overlay: { modesScenarios: { difficultyBand: 'extreme', scenarioVolatility: { band: 'high' } } } },
      { id: 'guardian_red', overlay: { guardianCopilot: { alertBand: 'severe', openWarningCount: 5 } } }
    ],
    null,
    null
  );
  const composite = rankMacroScenarioComposite(compare);
  const severity = rankMacroScenarioSeverity(compare);
  record('R12-08', 'Scenario composite preserves row count', composite.length === 2, String(composite.length));
  record(
    'R12-09',
    'Composite and severity both rank scenarios',
    severity.length === 2 && composite[0].compositeScore >= 0,
    composite.map(c => c.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'modes_guardian_stress',
    includeModesGuardianStress: true
  });
  record(
    'R12-10',
    'Modes/guardian regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
