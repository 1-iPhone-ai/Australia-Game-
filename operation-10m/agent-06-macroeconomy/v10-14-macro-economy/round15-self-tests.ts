import { readMacroReplaySpilloverFromV1024 } from './bridge-v1024-replay.ts';
import { readMacroTeamAiSpilloverFromV1018Team } from './bridge-v1018-team-ai.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionTensionSnapshot } from './macro-transmission-tension.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioHedge } from './scenario-hedge-rank.ts';
import { rankMacroScenarioTriage } from './scenario-triage-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round15SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const team = readMacroTeamAiSpilloverFromV1018Team(
    makeDefaultV1014_MACRO_TestInputs({
      teamIntelligence: { cohesionBand: 'fractured', internalConflict: { band: 'severe' }, analysisThroughput: { band: 'blocked' } }
    })
  );
  record('R15-01', 'Fractured team AI drags productivity', team.productivityNudge < -2, String(team.productivityNudge));

  const replay = readMacroReplaySpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      historyReplay: { stressMemory: { band: 'scarring' }, volatilityBand: 'extreme', recoveryArc: { band: 'l-shaped' } }
    })
  );
  record('R15-02', 'Replay stress memory drags cycle', replay.cycleNudge < -1, String(replay.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      teamIntelligence: { cohesionBand: 'strong', analysisThroughput: { band: 'high' }, internalConflict: { band: 'low' } },
      historyReplay: { recoveryArc: { band: 'strong' }, volatilityBand: 'stable', stressMemory: { band: 'fading' } }
    }),
    null,
    null
  );
  record('R15-03', 'State exposes team AI summary', integrated.state.teamAiSpilloverSummary != null, 'ok');
  record('R15-04', 'State exposes replay summary', integrated.state.replaySpilloverSummary != null, 'ok');
  record(
    'R15-05',
    'Sixty-two two transmission layers',
    integrated.state.transmissionReport.layers.length === 62,
    String(integrated.state.transmissionReport.layers.length)
  );

  const tension = buildMacroTransmissionTensionSnapshot(integrated.state.transmissionReport);
  record('R15-06', 'Transmission tension finite', Number.isFinite(tension.tensionIndex), String(tension.tensionIndex));
  record(
    'R15-07',
    'Transmission includes team layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.18_team'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 28 }),
    [
      { id: 'team_fracture', overlay: { teamIntelligence: { cohesionBand: 'critical', internalConflict: { band: 'severe' } } } },
      { id: 'replay_scar', overlay: { historyReplay: { stressMemory: { band: 'persistent' }, recoveryArc: { band: 'weak' } } } }
    ],
    null,
    null
  );
  const triage = rankMacroScenarioTriage(compare);
  const hedge = rankMacroScenarioHedge(compare);
  record('R15-08', 'Scenario triage preserves row count', triage.length === 2, String(triage.length));
  record(
    'R15-09',
    'Triage and hedge both rank scenarios',
    hedge.length === 2 && triage[0].triagePriority >= 0,
    triage.map(t => t.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'team_replay_stress',
    includeTeamReplayStress: true
  });
  record(
    'R15-10',
    'Team/replay regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
