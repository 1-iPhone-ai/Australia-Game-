import { readMacroIntegrationHealthWave52ExportSpilloverFromV1027 } from './bridge-v1027-integration-health-wave-round52-export.ts';
import { readMacroReplayWave52ExportSpilloverFromV1026 } from './bridge-v1026-replay-wave-round52-export.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave52Integration } from './scenario-wave52-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round52SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const replay = readMacroReplayWave52ExportSpilloverFromV1026(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave52Export: {
        round52Ready: false,
        o10TaskId: 'O10-235',
        waveRound: 48,
        integrityBand: 'corrupt',
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R52-01', 'Wave 52 replay export not ready drags cycle', replay.cycleNudge <= -2, String(replay.cycleNudge));

  const health = readMacroIntegrationHealthWave52ExportSpilloverFromV1027(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealthWave52Export: {
        healthReady: false,
        slotBand: 'red',
        baselineSha: 'a32b2b15',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R52-02', 'Wave 52 integration health export not ready drags investment', health.investmentNudge <= -2, String(health.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      replayWave52Export: {
        round52Ready: true,
        o10TaskId: 'O10-235',
        waveRound: 51,
        integrityBand: 'sound',
        projectedLocHint: 2_887_600
      },
      integrationHealthWave52Export: {
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
    'R52-03',
    'State exposes wave 51 replay export summary',
    integrated.state.replayWave52ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R52-04',
    'Transmission includes integration health wave 51 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration_health_wave52_export'),
    'ok'
  );
  record(
    'R52-05',
    'Hundred transmission layers',
    integrated.state.transmissionReport.layers.length === 100,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R52-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R52-07',
    'Transmission includes replay wave 51 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_replay_wave52_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 70 }),
    [
      {
        id: 'replay_shock',
        overlay: {
          replayWave52Export: { round52Ready: false, o10TaskId: 'O10-235', waveRound: 51, integrityBand: 'corrupt' }
        }
      },
      {
        id: 'health_shock',
        overlay: { integrationHealthWave52Export: { healthReady: false, slotBand: 'red', baselineSha: 'a32b2b15' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave52Integration(compare);
  record('R52-08', 'Wave 52 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R52-09',
    'Wave 52 integration ranks scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave52_replay_integration_stress',
    includeWave52ReplayIntegrationStress: true
  });
  record(
    'R52-10',
    'Wave 52 replay/integration regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
