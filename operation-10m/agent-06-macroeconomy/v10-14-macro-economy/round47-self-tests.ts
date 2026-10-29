import { readMacroIntegrationHealthWave47ExportSpilloverFromV1025 } from './bridge-v1025-integration-health-wave-round47-export.ts';
import { readMacroReplayWave47ExportSpilloverFromV1024 } from './bridge-v1024-replay-wave-round47-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave47Integration } from './scenario-wave47-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round47SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave47ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave47Export: {
        round47Ready: false,
        o10TaskId: 'O10-225',
        waveRound: 47,
        integrityBand: 'corrupt',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R47-01', 'Wave 47 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave47ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave47Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: '456efb9',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R47-02', 'Wave 47 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave47Export: {
        round47Ready: true,
        o10TaskId: 'O10-225',
        waveRound: 47,
        integrityBand: 'sound',
        projectedLocHint: 2_637_258
      },
      integrationHealthWave47Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: '456efb9',
        projectedFunctionalLoc: 2_637_258
      }
    }),
    null,
    null
  );
  record(
    'R47-03',
    'State exposes wave 47 replay export summary',
    integrated.state.replayWave47ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R47-04',
    'Transmission includes integration health wave 47 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave47_export'),
    'ok'
  );
  record(
    'R47-05',
    'Ninety transmission layers',
    integrated.state.transmissionReport.layers.length === 90,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R47-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R47-07',
    'Transmission includes replay wave 47 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave47_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 69 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave47Export: { round47Ready: false, o10TaskId: 'O10-225', waveRound: 47, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave47Export: { healthReady: false, slotBand: 'red', baselineSha: '456efb9' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave47Integration(compare);
  record('R47-08', 'Wave 47 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R47-09',
    'Wave 47 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave47_replay_integration_stress',
    includeWave47ReplayIntegrationStress: true
  });
  record(
    'R47-10',
    'Wave 47 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
