import { readMacroIntegrationHealthWave55ExportSpilloverFromV1034 } from './bridge-v1034-integration-health-wave-round56-export.ts';
import { readMacroReplayWave55ExportSpilloverFromV1033 } from './bridge-v1033-replay-wave-round56-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave56Integration } from './scenario-wave56-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round56SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave55ExportSpilloverFromV1033(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave55Export: {
        round56Ready: false,
        o10TaskId: 'O10-254',
        waveRound: 55,
        integrityBand: 'corrupt',
        projectedLocHint: 2_900_000
      }
    })
  );
  record('R55-01', 'Wave 55 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave55ExportSpilloverFromV1034(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave55Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: 'c4bbec67',
        projectedFunctionalLoc: 2_900_000
      }
    })
  );
  record('R55-02', 'Wave 55 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave52Export: {
        round56Ready: true,
        o10TaskId: 'O10-254',
        waveRound: 55,
        integrityBand: 'sound',
        projectedLocHint: 3_054_213
      },
      integrationHealthWave52Export: {
        healthReady: true,
        slotBand: 'latched',
        baselineSha: 'c4bbec67',
        projectedFunctionalLoc: 3_054_213
      }
    }),
    null,
    null
  );
  record(
    'R55-03',
    'State exposes wave 52 replay export summary',
    integrated.state.replayWave52ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R55-04',
    'Transmission includes integration health wave 52 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave52_export'),
    'ok'
  );
  record(
    'R55-05',
    'Hundred transmission layers',
    integrated.state.transmissionReport.layers.length === 100,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R55-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R55-07',
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
          replayWave55Export: { round56Ready: false, o10TaskId: 'O10-254', waveRound: 55, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave55Export: { healthReady: false, slotBand: 'red', baselineSha: 'c4bbec67' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave56Integration(compare);
  record('R55-08', 'Wave 55 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R55-09',
    'Wave 55 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave52_replay_integration_stress',
    includeWave52ReplayIntegrationStress: true
  });
  record(
    'R55-10',
    'Wave 55 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
