import { readMacroAutomationSpilloverFromV1020 } from './bridge-v1020-automation.ts';
import { readMacroCommandSpilloverFromV1017Command } from './bridge-v1017-command.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionAmplificationSnapshot } from './macro-transmission-amplification.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioFrontier } from './scenario-frontier-rank.ts';
import { rankMacroScenarioHedge } from './scenario-hedge-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round14SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const command = readMacroCommandSpilloverFromV1017Command(
    makeDefaultV1014_MACRO_TestInputs({
      commandCenter: { postureBand: 'crisis', coordinationBand: 'fragmented', decisionBacklog: { band: 'critical' } }
    })
  );
  record('R14-01', 'Crisis command drags cycle read', command.cycleNudge < -3, String(command.cycleNudge));

  const automation = readMacroAutomationSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      idleAutomation: { throughputBand: 'stalled', reliabilityBand: 'fragile', adoptionBand: 'minimal' }
    })
  );
  record('R14-02', 'Stalled automation drags productivity', automation.productivityNudge < -2, String(automation.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      commandCenter: { postureBand: 'steady', coordinationBand: 'integrated', decisionBacklog: { band: 'clear' } },
      idleAutomation: { throughputBand: 'surging', reliabilityBand: 'robust', adoptionBand: 'broad' }
    }),
    null,
    null
  );
  record('R14-03', 'State exposes command summary', integrated.state.commandSpilloverSummary != null, 'ok');
  record('R14-04', 'State exposes automation summary', integrated.state.automationSpilloverSummary != null, 'ok');
  record(
    'R14-05',
    'Twenty-four transmission layers',
    integrated.state.transmissionReport.layers.length === 24,
    String(integrated.state.transmissionReport.layers.length)
  );

  const amplification = buildMacroTransmissionAmplificationSnapshot(integrated.state.transmissionReport);
  record('R14-06', 'Transmission amplification finite', Number.isFinite(amplification.amplificationIndex), String(amplification.amplificationIndex));
  record(
    'R14-07',
    'Transmission includes command layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.17_command'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 26 }),
    [
      { id: 'command_crisis', overlay: { commandCenter: { postureBand: 'red', coordinationBand: 'degraded' } } },
      { id: 'automation_boost', overlay: { idleAutomation: { throughputBand: 'surging', adoptionBand: 'deep' } } }
    ],
    null,
    null
  );
  const hedge = rankMacroScenarioHedge(compare);
  const frontier = rankMacroScenarioFrontier(compare);
  record('R14-08', 'Scenario hedge preserves row count', hedge.length === 2, String(hedge.length));
  record(
    'R14-09',
    'Hedge and frontier both rank scenarios',
    frontier.length === 2 && hedge[0].hedgeIndex >= 0,
    hedge.map(h => h.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'command_automation_stress',
    includeCommandAutomationStress: true
  });
  record(
    'R14-10',
    'Command/automation regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
