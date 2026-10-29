import { readMacroIntegrationHealthWave38ExportSpilloverFromV1025 } from './bridge-v1025-integration-health-wave-round38-export.ts';
import { readMacroReplayWave38ExportSpilloverFromV1024 } from './bridge-v1024-replay-wave-round38-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionSynthesisSnapshot } from './macro-transmission-synthesis.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave38Integration } from './scenario-wave38-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round38SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave38ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave38Export: {
        round38Ready: false,
        o10TaskId: 'O10-207',
        waveRound: 38,
        integrityBand: 'broken',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R38-01', 'Wave 38 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave38ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave38Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R38-02', 'Wave 38 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave38Export: {
        round38Ready: true,
        o10TaskId: 'O10-207',
        waveRound: 38,
        integrityBand: 'sound',
        projectedLocHint: 2_039_227
      },
      integrationHealthWave38Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: 'b44b36f',
        projectedFunctionalLoc: 2_039_227
      }
    }),
    null,
    null
  );
  record(
    'R38-03',
    'State exposes wave 38 replay export summary',
    integrated.state.replayWave38ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R38-04',
    'Transmission includes integration health wave 38 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave38_export'),
    'ok'
  );
  record(
    'R38-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 78,
    String(integrated.state.transmissionReport.layers.length)
  );

  const synthesis = buildMacroTransmissionSynthesisSnapshot(integrated.state.transmissionReport);
  record(
    'R38-06',
    'Transmission synthesis finite',
    Number.isFinite(synthesis.synthesisIndex),
    String(synthesis.synthesisIndex)
  );
  record(
    'R38-07',
    'Transmission includes replay wave 38 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave38_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 60 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave38Export: { round38Ready: false, o10TaskId: 'O10-207', waveRound: 38, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave38Export: { healthReady: false, slotBand: 'red', baselineSha: 'b44b36f' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave38Integration(compare);
  record('R38-08', 'Wave 38 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R38-09',
    'Wave 38 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave38_replay_integration_stress',
    includeWave38ReplayIntegrationStress: true
  });
  record(
    'R38-10',
    'Wave 38 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
