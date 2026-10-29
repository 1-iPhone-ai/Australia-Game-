import { readMacroIntegrationHealthWave51ExportSpilloverFromV1025 } from './bridge-v1025-integration-health-wave-round51-export.ts';
import { readMacroReplayWave51ExportSpilloverFromV1024 } from './bridge-v1024-replay-wave-round51-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave51Integration } from './scenario-wave51-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round51SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave51ExportSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave51Export: {
        round51Ready: false,
        o10TaskId: 'O10-233',
        waveRound: 48,
        integrityBand: 'corrupt',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R51-01', 'Wave 51 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave51ExportSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave51Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: 'a32b2b15',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R51-02', 'Wave 51 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave51Export: {
        round51Ready: true,
        o10TaskId: 'O10-233',
        waveRound: 51,
        integrityBand: 'sound',
        projectedLocHint: 2_887_600
      },
      integrationHealthWave51Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: 'a32b2b15',
        projectedFunctionalLoc: 2_887_600
      }
    }),
    null,
    null
  );
  record(
    'R51-03',
    'State exposes wave 51 replay export summary',
    integrated.state.replayWave51ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R51-04',
    'Transmission includes integration health wave 51 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave51_export'),
    'ok'
  );
  record(
    'R51-05',
    'Hundred transmission layers',
    integrated.state.transmissionReport.layers.length === 100,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R51-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R51-07',
    'Transmission includes replay wave 51 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave51_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 70 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave51Export: { round51Ready: false, o10TaskId: 'O10-233', waveRound: 51, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave51Export: { healthReady: false, slotBand: 'red', baselineSha: 'a32b2b15' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave51Integration(compare);
  record('R51-08', 'Wave 51 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R51-09',
    'Wave 51 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave51_replay_integration_stress',
    includeWave51ReplayIntegrationStress: true
  });
  record(
    'R51-10',
    'Wave 51 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
