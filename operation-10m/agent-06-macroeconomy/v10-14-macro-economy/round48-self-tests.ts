import { readMacroIntegrationHealthWave48ExportSpilloverFromV1025 } from './bridge-v1025-integration-health-wave-round48-export.ts';
import { readMacroReplayWave48ExportSpilloverFromV1024 } from './bridge-v1024-replay-wave-round48-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave48Integration } from './scenario-wave48-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round48SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave48ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave48Export: {
        round48Ready: false,
        o10TaskId: 'O10-227',
        waveRound: 47,
        integrityBand: 'corrupt',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R48-01', 'Wave 48 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave48ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave48Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: '4404bf0f',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R48-02', 'Wave 48 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave48Export: {
        round48Ready: true,
        o10TaskId: 'O10-227',
        waveRound: 47,
        integrityBand: 'sound',
        projectedLocHint: 2_684_235
      },
      integrationHealthWave48Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: '4404bf0f',
        projectedFunctionalLoc: 2_684_235
      }
    }),
    null,
    null
  );
  record(
    'R48-03',
    'State exposes wave 48 replay export summary',
    integrated.state.replayWave48ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R48-04',
    'Transmission includes integration health wave 48 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave48_export'),
    'ok'
  );
  record(
    'R48-05',
    'Ninety-four transmission layers',
    integrated.state.transmissionReport.layers.length === 100,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R48-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R48-07',
    'Transmission includes replay wave 48 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave48_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 69 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave48Export: { round48Ready: false, o10TaskId: 'O10-227', waveRound: 48, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave48Export: { healthReady: false, slotBand: 'red', baselineSha: '4404bf0f' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave48Integration(compare);
  record('R48-08', 'Wave 48 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R48-09',
    'Wave 48 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave48_replay_integration_stress',
    includeWave48ReplayIntegrationStress: true
  });
  record(
    'R48-10',
    'Wave 48 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
