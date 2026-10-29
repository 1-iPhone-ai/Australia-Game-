import { readMacroAutomationIdleGovernanceWave36ExportSpilloverFromV1020 } from './bridge-v1020-automation-idle-governance-wave-round36-export.ts';
import { readMacroForecastWave36ProjectionSyncSpilloverFromV1021 } from './bridge-v1021-forecast-wave36-projection-sync.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionDispersionSnapshot } from './macro-transmission-dispersion.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave36Integration } from './scenario-wave36-integration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round36SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const exportSpill = readMacroAutomationIdleGovernanceWave36ExportSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave36Export: {
        round36Ready: false,
        o10TaskId: 'O10-203',
        waveRound: 36,
        projectedLocHint: 1_800_000
      }
    })
  );
  record('R36-01', 'Wave 36 export not ready drags investment', exportSpill.investmentNudge <= -2, String(exportSpill.investmentNudge));

  const projection = readMacroForecastWave36ProjectionSyncSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastWave36ProjectionSync: {
        status: 'drift',
        baselineSha: 'deadbeef',
        projectedFunctionalLoc: 1_800_000
      }
    })
  );
  record('R36-02', 'Wave 36 projection drift drags cycle', projection.cycleNudge <= -2, String(projection.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernanceWave36Export: {
        round36Ready: true,
        o10TaskId: 'O10-203',
        waveRound: 36,
        projectedLocHint: 1_962_828,
        wave36HookLines: ['O10_AGENT20_WAVE36 round36_ready=true']
      },
      forecastWave36ProjectionSync: {
        status: 'aligned',
        baselineSha: 'ea2bb03',
        projectedFunctionalLoc: 1_962_828
      }
    }),
    null,
    null
  );
  record(
    'R36-03',
    'State exposes wave 36 export summary',
    integrated.state.automationIdleGovernanceWave36ExportSpilloverSummary != null,
    'ok'
  );
  record(
    'R36-04',
    'Transmission includes forecast wave 36 projection sync layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_wave36_projection_sync'),
    'ok'
  );
  record(
    'R36-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 82,
    String(integrated.state.transmissionReport.layers.length)
  );

  const dispersion = buildMacroTransmissionDispersionSnapshot(integrated.state.transmissionReport);
  record('R36-06', 'Transmission dispersion finite', Number.isFinite(dispersion.dispersionIndex), String(dispersion.dispersionIndex));
  record(
    'R36-07',
    'Transmission includes automation wave 36 export layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance_wave36_export'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 58 }),
    [
      {
        id: 'export_shock',
        overlay: {
          automationIdleGovernanceWave36Export: { round36Ready: false, o10TaskId: 'O10-203', waveRound: 36 }
        }
      },
      {
        id: 'projection_shock',
        overlay: { forecastWave36ProjectionSync: { status: 'drift', baselineSha: 'ea2bb03' } }
      }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave36Integration(compare);
  record('R36-08', 'Wave 36 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R36-09',
    'Resilience and wave 35 integration both rank scenarios',
    integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'wave36_export_projection_stress',
    includeWave36ExportProjectionStress: true
  });
  record(
    'R36-10',
    'Wave 36 export/projection regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
