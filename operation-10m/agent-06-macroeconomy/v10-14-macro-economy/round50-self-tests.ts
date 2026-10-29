import { readMacroIntegrationHealthWave50ExportSpilloverFromV1025 } from './bridge-v1025-integration-health-wave-round50-export.ts';
import { readMacroReplayWave50ExportSpilloverFromV1024 } from './bridge-v1024-replay-wave-round50-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave50Integration } from './scenario-wave50-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round50SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave50ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave50Export: {
        round50Ready: false,
        o10TaskId: 'O10-231',
        waveRound: 48,
        integrityBand: 'corrupt',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R50-01', 'Wave 50 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave50ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave50Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: '8aaaf700',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R50-02', 'Wave 50 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave50Export: {
        round50Ready: true,
        o10TaskId: 'O10-231',
        waveRound: 50,
        integrityBand: 'sound',
        projectedLocHint: 2_771_207
      },
      integrationHealthWave50Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: '8aaaf700',
        projectedFunctionalLoc: 2_771_207
      }
    }),
    null,
    null
  );
  record(
    'R50-03',
    'State exposes wave 50 replay export summary',
    integrated.state.replayWave50ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R50-04',
    'Transmission includes integration health wave 50 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave50_export'),
    'ok'
  );
  record(
    'R50-05',
    'Ninety-six transmission layers',
    integrated.state.transmissionReport.layers.length === 100,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R50-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R50-07',
    'Transmission includes replay wave 50 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave50_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 70 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave50Export: { round50Ready: false, o10TaskId: 'O10-231', waveRound: 50, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave50Export: { healthReady: false, slotBand: 'red', baselineSha: '8aaaf700' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave50Integration(compare);
  record('R50-08', 'Wave 50 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R50-09',
    'Wave 50 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave50_replay_integration_stress',
    includeWave50ReplayIntegrationStress: true
  });
  record(
    'R50-10',
    'Wave 50 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
