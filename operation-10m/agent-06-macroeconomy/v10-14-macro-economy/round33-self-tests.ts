import { readMacroMemoryRetentionSpilloverFromV1019 } from './bridge-v1019-memory-retention.ts';
import { readMacroTeamAiCohesionSpilloverFromV1018 } from './bridge-v1018-team-ai-cohesion.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionRedundancySnapshot } from './macro-transmission-redundancy.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioContinuity } from './scenario-continuity-rank.ts';
import { rankMacroScenarioViability } from './scenario-viability-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round33SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const team = readMacroTeamAiCohesionSpilloverFromV1018(
    makeDefaultV1014_MACRO_TestInputs({
      teamAiCohesion: { alignmentBand: 'split', driftBand: 'unbounded', qualityBand: 'hallucinating' }
    })
  );
  record('R33-01', 'Split cohesion drags productivity', team.productivityNudge <= -2, String(team.productivityNudge));

  const memory = readMacroMemoryRetentionSpilloverFromV1019(
    makeDefaultV1014_MACRO_TestInputs({
      memoryRetention: { retentionBand: 'lost', decayBand: 'runaway', recallBand: 'corrupted' }
    })
  );
  record('R33-02', 'Lost retention drags investment', memory.investmentNudge <= -2, String(memory.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      teamAiCohesion: { alignmentBand: 'unified', driftBand: 'stable', qualityBand: 'reliable' },
      memoryRetention: { retentionBand: 'durable', decayBand: 'slow', recallBand: 'accurate' }
    }),
    null,
    null
  );
  record('R33-03', 'State exposes team AI cohesion summary', integrated.state.teamAiCohesionSpilloverSummary != null, 'ok');
  record(
    'R33-04',
    'Transmission includes memory retention layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.19_memory_retention'),
    'ok'
  );
  record(
    'R33-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const redundancy = buildMacroTransmissionRedundancySnapshot(integrated.state.transmissionReport);
  record('R33-06', 'Transmission redundancy finite', Number.isFinite(redundancy.redundancyIndex), String(redundancy.redundancyIndex));
  record(
    'R33-07',
    'Transmission includes team AI cohesion layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.18_team_ai_cohesion'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 55 }),
    [
      { id: 'team_shock', overlay: { teamAiCohesion: { alignmentBand: 'critical', driftBand: 'runaway' } } },
      { id: 'memory_shock', overlay: { memoryRetention: { retentionBand: 'critical', recallBand: 'noisy' } } }
    ],
    null,
    null
  );
  const continuity = rankMacroScenarioContinuity(compare);
  const viability = rankMacroScenarioViability(compare);
  record('R33-08', 'Scenario continuity preserves row count', continuity.length === 2, String(continuity.length));
  record(
    'R33-09',
    'Continuity and viability both rank scenarios',
    viability.length === 2 && continuity[0].continuityPriority >= 0,
    continuity.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'team_memory_stress',
    includeTeamMemoryStress: true
  });
  record(
    'R33-10',
    'Team/memory regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
