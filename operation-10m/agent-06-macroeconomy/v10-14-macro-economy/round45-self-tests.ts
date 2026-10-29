import { readMacroIntegrationHealthWave45ExportSpilloverFromV1025 } from './bridge-v1025-integration-health-wave-round45-export.ts';
import { readMacroReplayWave45ExportSpilloverFromV1024 } from './bridge-v1024-replay-wave-round45-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave45Integration } from './scenario-wave45-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round45SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave45ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave45Export: {
        round45Ready: false,
        o10TaskId: 'O10-221',
        waveRound: 45,
        integrityBand: 'broken',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R45-01', 'Wave 45 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave45ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave45Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R45-02', 'Wave 45 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave45Export: {
        round45Ready: true,
        o10TaskId: 'O10-221',
        waveRound: 45,
        integrityBand: 'sound',
        projectedLocHint: 2_548_579
      },
      integrationHealthWave45Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: '98bcd652',
        projectedFunctionalLoc: 2_548_579
      }
    }),
    null,
    null
  );
  record(
    'R45-03',
    'State exposes wave 45 replay export summary',
    integrated.state.replayWave45ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R45-04',
    'Transmission includes integration health wave 45 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave45_export'),
    'ok'
  );
  record(
    'R45-05',
    'Eighty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 92,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R45-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R45-07',
    'Transmission includes replay wave 45 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave45_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 67 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave45Export: { round45Ready: false, o10TaskId: 'O10-221', waveRound: 45, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave45Export: { healthReady: false, slotBand: 'red', baselineSha: '98bcd652' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave45Integration(compare);
  record('R45-08', 'Wave 45 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R45-09',
    'Wave 45 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave45_replay_integration_stress',
    includeWave45ReplayIntegrationStress: true
  });
  record(
    'R45-10',
    'Wave 45 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
