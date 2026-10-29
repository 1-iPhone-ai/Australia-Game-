import { readMacroIntegrationHealthWave53ExportSpilloverFromV1030 } from './bridge-v1030-integration-health-wave-round54-export.ts';
import { readMacroReplayWave53ExportSpilloverFromV1029 } from './bridge-v1029-replay-wave-round54-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave54Integration } from './scenario-wave54-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round54SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave53ExportSpilloverFromV1029(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave53Export: {
        round54Ready: false,
        o10TaskId: 'O10-240',
        waveRound: 53,
        integrityBand: 'corrupt',
        projectedLocHint: 2_800_000
      }
    })
  );
  record('R54-01', 'Wave 54 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave53ExportSpilloverFromV1030(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave53Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: '5bd043ad',
        projectedFunctionalLoc: 2_800_000
      }
    })
  );
  record('R54-02', 'Wave 54 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave52Export: {
        round54Ready: true,
        o10TaskId: 'O10-240',
        waveRound: 53,
        integrityBand: 'sound',
        projectedLocHint: 3_022_056
      },
      integrationHealthWave52Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: '5bd043ad',
        projectedFunctionalLoc: 3_022_056
      }
    }),
    null,
    null
  );
  record(
    'R54-03',
    'State exposes wave 52 replay export summary',
    integrated.state.replayWave52ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R54-04',
    'Transmission includes integration health wave 52 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave52_export'),
    'ok'
  );
  record(
    'R54-05',
    'Hundred transmission layers',
    integrated.state.transmissionReport.layers.length === 100,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R54-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R54-07',
    'Transmission includes replay wave 52 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave52_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 70 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave53Export: { round54Ready: false, o10TaskId: 'O10-240', waveRound: 53, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave53Export: { healthReady: false, slotBand: 'red', baselineSha: '5bd043ad' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave54Integration(compare);
  record('R54-08', 'Wave 54 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R54-09',
    'Wave 54 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave52_replay_integration_stress',
    includeWave52ReplayIntegrationStress: true
  });
  record(
    'R54-10',
    'Wave 54 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
