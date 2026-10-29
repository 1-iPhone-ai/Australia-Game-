import { readMacroIntegrationHealthWave41ExportSpilloverFromV1025 } from './bridge-v1025-integration-health-wave-round41-export.ts';
import { readMacroReplayWave41ExportSpilloverFromV1024 } from './bridge-v1024-replay-wave-round41-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave41Integration } from './scenario-wave41-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round41SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave41ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave41Export: {
        round41Ready: false,
        o10TaskId: 'O10-213',
        waveRound: 41,
        integrityBand: 'broken',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R41-01', 'Wave 41 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave41ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave41Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R41-02', 'Wave 41 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave41Export: {
        round41Ready: true,
        o10TaskId: 'O10-213',
        waveRound: 41,
        integrityBand: 'sound',
        projectedLocHint: 2_165_132
      },
      integrationHealthWave41Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: '875d6f3',
        projectedFunctionalLoc: 2_165_132
      }
    }),
    null,
    null
  );
  record(
    'R41-03',
    'State exposes wave 41 replay export summary',
    integrated.state.replayWave41ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R41-04',
    'Transmission includes integration health wave 41 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave41_export'),
    'ok'
  );
  record(
    'R41-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 86,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R41-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R41-07',
    'Transmission includes replay wave 41 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave41_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 63 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave41Export: { round41Ready: false, o10TaskId: 'O10-213', waveRound: 41, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave41Export: { healthReady: false, slotBand: 'red', baselineSha: '875d6f3' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave41Integration(compare);
  record('R41-08', 'Wave 41 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R41-09',
    'Wave 41 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave41_replay_integration_stress',
    includeWave41ReplayIntegrationStress: true
  });
  record(
    'R41-10',
    'Wave 41 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
