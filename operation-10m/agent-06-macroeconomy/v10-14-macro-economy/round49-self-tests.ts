import { readMacroIntegrationHealthWave49ExportSpilloverFromV1025 } from './bridge-v1025-integration-health-wave-round49-export.ts';
import { readMacroReplayWave49ExportSpilloverFromV1024 } from './bridge-v1024-replay-wave-round49-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave49Integration } from './scenario-wave49-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round49SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave49ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave49Export: {
        round49Ready: false,
        o10TaskId: 'O10-229',
        waveRound: 47,
        integrityBand: 'corrupt',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R49-01', 'Wave 49 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave49ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave49Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: '73e5e01e',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R49-02', 'Wave 49 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave49Export: {
        round49Ready: true,
        o10TaskId: 'O10-229',
        waveRound: 47,
        integrityBand: 'sound',
        projectedLocHint: 2_727_364
      },
      integrationHealthWave49Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: '73e5e01e',
        projectedFunctionalLoc: 2_727_364
      }
    }),
    null,
    null
  );
  record(
    'R49-03',
    'State exposes wave 49 replay export summary',
    integrated.state.replayWave49ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R49-04',
    'Transmission includes integration health wave 49 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave49_export'),
    'ok'
  );
  record(
    'R49-05',
    'Ninety-six transmission layers',
    integrated.state.transmissionReport.layers.length === 96,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R49-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R49-07',
    'Transmission includes replay wave 49 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave49_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 69 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave49Export: { round49Ready: false, o10TaskId: 'O10-229', waveRound: 49, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave49Export: { healthReady: false, slotBand: 'red', baselineSha: '73e5e01e' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave49Integration(compare);
  record('R49-08', 'Wave 49 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R49-09',
    'Wave 49 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave49_replay_integration_stress',
    includeWave49ReplayIntegrationStress: true
  });
  record(
    'R49-10',
    'Wave 49 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
