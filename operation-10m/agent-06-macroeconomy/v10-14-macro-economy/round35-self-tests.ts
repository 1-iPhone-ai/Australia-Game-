import { readMacroAutomationIdleGovernanceSpilloverFromV1020 } from './bridge-v1020-automation-idle-governance.ts';
import { readMacroForecastProjectionSyncSpilloverFromV1021 } from './bridge-v1021-forecast-projection-sync.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionElasticitySnapshot } from './macro-transmission-elasticity.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioWave35Integration } from './scenario-wave35-integration-rank.ts';
import { rankMacroScenarioProjectionSync } from './scenario-projection-sync-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round35SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const governance = readMacroAutomationIdleGovernanceSpilloverFromV1020(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernance: { governanceBand: 'runaway', idleBand: 'frozen', escrowBand: 'misaligned' }
    })
  );
  record('R35-01', 'Runaway idle governance drags investment', governance.investmentNudge <= -2, String(governance.investmentNudge));

  const projection = readMacroForecastProjectionSyncSpilloverFromV1021(
    makeDefaultV1014_MACRO_TestInputs({
      forecastProjectionSync: { ledgerBand: 'orphaned', driftBand: 'runaway', syncBand: 'desynced' }
    })
  );
  record('R35-02', 'Runaway projection drift drags cycle', projection.cycleNudge <= -2, String(projection.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      automationIdleGovernance: { governanceBand: 'grounded', idleBand: 'bounded', escrowBand: 'latched' },
      forecastProjectionSync: { ledgerBand: 'synced', driftBand: 'stable', syncBand: 'latched' }
    }),
    null,
    null
  );
  record('R35-03', 'State exposes idle governance summary', integrated.state.automationIdleGovernanceSpilloverSummary != null, 'ok');
  record(
    'R35-04',
    'Transmission includes forecast projection sync layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.21_forecast_projection_sync'),
    'ok'
  );
  record(
    'R35-05',
    'Seventy-four transmission layers',
    integrated.state.transmissionReport.layers.length === 74,
    String(integrated.state.transmissionReport.layers.length)
  );

  const elasticity = buildMacroTransmissionElasticitySnapshot(integrated.state.transmissionReport);
  record('R35-06', 'Transmission elasticity finite', Number.isFinite(elasticity.elasticityIndex), String(elasticity.elasticityIndex));
  record(
    'R35-07',
    'Transmission includes automation idle governance layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.20_automation_idle_governance'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 57 }),
    [
      { id: 'governance_shock', overlay: { automationIdleGovernance: { governanceBand: 'critical', escrowBand: 'leaking' } } },
      { id: 'projection_shock', overlay: { forecastProjectionSync: { driftBand: 'critical', syncBand: 'broken' } } }
    ],
    null,
    null
  );
  const integration = rankMacroScenarioWave35Integration(compare);
  const projectionRank = rankMacroScenarioProjectionSync(compare);
  record('R35-08', 'Wave 35 integration rank preserves row count', integration.length === 2, String(integration.length));
  record(
    'R35-09',
    'Integration and projection sync both rank scenarios',
    projectionRank.length === 2 && integration[0].integrationPriority >= 0,
    integration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'governance_projection_stress',
    includeGovernanceProjectionStress: true
  });
  record(
    'R35-10',
    'Governance/projection regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
