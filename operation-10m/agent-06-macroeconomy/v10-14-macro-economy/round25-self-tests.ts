import { readMacroCadenceDriftSpilloverFromV1002 } from './bridge-v1002-cadence-drift.ts';
import { readMacroIntegrationHealthSpilloverFromV1025 } from './bridge-v1025-integration-health.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionGradientSnapshot } from './macro-transmission-gradient.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioRenewal } from './scenario-renewal-rank.ts';
import { rankMacroScenarioRestoration } from './scenario-restoration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round25SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const integration = readMacroIntegrationHealthSpilloverFromV1025(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealth: { meshBand: 'fractured', contractDriftBand: 'critical', smokeBand: 'failing' }
    })
  );
  record('R25-01', 'Fractured integration drags cycle', integration.cycleNudge < -2, String(integration.cycleNudge));

  const cadence = readMacroCadenceDriftSpilloverFromV1002(
    makeDefaultV1014_MACRO_TestInputs({
      turnCadenceDrift: { skewBand: 'runaway', jitterBand: 'chaotic', resolutionBand: 'missed' }
    })
  );
  record('R25-02', 'Chaotic cadence drags productivity', cadence.productivityNudge < -2, String(cadence.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      integrationHealth: { meshBand: 'healthy', contractDriftBand: 'stable', smokeBand: 'green' },
      turnCadenceDrift: { skewBand: 'anchored', jitterBand: 'low', resolutionBand: 'on_time' }
    }),
    null,
    null
  );
  record('R25-03', 'State exposes integration summary', integrated.state.integrationHealthSpilloverSummary != null, 'ok');
  record(
    'R25-04',
    'Transmission includes cadence drift layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.02_cadence'),
    'ok'
  );
  record(
    'R25-05',
    'Fifty-two transmission layers',
    integrated.state.transmissionReport.layers.length === 52,
    String(integrated.state.transmissionReport.layers.length)
  );

  const gradient = buildMacroTransmissionGradientSnapshot(integrated.state.transmissionReport);
  record('R25-06', 'Transmission gradient finite', Number.isFinite(gradient.gradientIndex), String(gradient.gradientIndex));
  record(
    'R25-07',
    'Transmission includes integration health layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.25_integration'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 42 }),
    [
      { id: 'integration_shock', overlay: { integrationHealth: { meshBand: 'critical', smokeBand: 'red' } } },
      { id: 'cadence_shock', overlay: { turnCadenceDrift: { skewBand: 'critical', resolutionBand: 'critical' } } }
    ],
    null,
    null
  );
  const renewal = rankMacroScenarioRenewal(compare);
  const restoration = rankMacroScenarioRestoration(compare);
  record('R25-08', 'Scenario renewal preserves row count', renewal.length === 2, String(renewal.length));
  record(
    'R25-09',
    'Renewal and restoration both rank scenarios',
    restoration.length === 2 && renewal[0].renewalPriority >= 0,
    renewal.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'integration_cadence_stress',
    includeIntegrationCadenceStress: true
  });
  record(
    'R25-10',
    'Integration/cadence regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
