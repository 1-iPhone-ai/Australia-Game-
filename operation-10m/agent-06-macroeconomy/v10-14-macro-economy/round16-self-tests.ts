import { readMacroDashboardsSpilloverFromV1023 } from './bridge-v1023-dashboards.ts';
import { readMacroMemorySpilloverFromV1019 } from './bridge-v1019-memory.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionDivergenceSnapshot } from './macro-transmission-divergence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioContingency } from './scenario-contingency-rank.ts';
import { rankMacroScenarioTriage } from './scenario-triage-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round16SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const memory = readMacroMemorySpilloverFromV1019(
    makeDefaultV1014_MACRO_TestInputs({
      aiMemory: { driftBand: 'runaway', recallFidelity: { band: 'degraded' }, auditGap: { band: 'wide' } }
    })
  );
  record('R16-01', 'Runaway memory drift drags cycle', memory.cycleNudge < -2, String(memory.cycleNudge));

  const dashboards = readMacroDashboardsSpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      dashboardsMaps: {
        refreshLag: { band: 'stale' },
        signalCoherence: { band: 'fragmented' },
        alertDensity: { band: 'flooded' }
      }
    })
  );
  record('R16-02', 'Flooded dashboard alerts drag investment', dashboards.investmentNudge < -1, String(dashboards.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      aiMemory: { driftBand: 'runaway', recallFidelity: { band: 'degraded' }, auditGap: { band: 'narrow' } },
      dashboardsMaps: { refreshLag: { band: 'stale' }, signalCoherence: { band: 'aligned' }, alertDensity: { band: 'calm' } }
    }),
    null,
    null
  );
  record('R16-03', 'State exposes memory summary', integrated.state.memorySpilloverSummary != null, 'ok');
  record('R16-04', 'State exposes dashboards summary', integrated.state.dashboardsSpilloverSummary != null, 'ok');
  record(
    'R16-05',
    'Fifty-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 58,
    String(integrated.state.transmissionReport.layers.length)
  );

  const divergence = buildMacroTransmissionDivergenceSnapshot(integrated.state.transmissionReport);
  record('R16-06', 'Transmission divergence finite', Number.isFinite(divergence.divergenceIndex), String(divergence.divergenceIndex));
  record(
    'R16-07',
    'Transmission includes memory layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.19_memory'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 30 }),
    [
      { id: 'memory_drift', overlay: { aiMemory: { driftBand: 'critical', auditGap: { band: 'unresolved' } } } },
      { id: 'dashboard_lag', overlay: { dashboardsMaps: { refreshLag: { band: 'critical' }, alertDensity: { band: 'severe' } } } }
    ],
    null,
    null
  );
  const contingency = rankMacroScenarioContingency(compare);
  const triage = rankMacroScenarioTriage(compare);
  record('R16-08', 'Scenario contingency preserves row count', contingency.length === 2, String(contingency.length));
  record(
    'R16-09',
    'Contingency and triage both rank scenarios',
    triage.length === 2 && contingency[0].contingencyPriority >= 0,
    contingency.map(c => c.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'memory_dashboard_stress',
    includeMemoryDashboardStress: true
  });
  record(
    'R16-10',
    'Memory/dashboard regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
