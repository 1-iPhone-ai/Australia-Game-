import { readMacroTransportSpilloverFromV1017 } from './bridge-v1017-transport.ts';
import { readMacroTurnsSpilloverFromV102 } from './bridge-v102-turns.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionAsymmetrySnapshot } from './macro-transmission-asymmetry.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioConvergence } from './scenario-convergence.ts';
import { rankMacroScenarioDivergence } from './scenario-divergence.ts';
import { rankMacroScenarioElasticity } from './scenario-elasticity.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round10SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const turns = readMacroTurnsSpilloverFromV102(
    makeDefaultV1014_MACRO_TestInputs({
      turnsTime: { paceBand: 'stalled', macroPhaseBand: 'late_cycle', season: 'Winter' }
    })
  );
  record('R10-01', 'Stalled turn cadence drags cycle', turns.cycleNudge < -2, String(turns.cycleNudge));

  const transport = readMacroTransportSpilloverFromV1017(
    makeDefaultV1014_MACRO_TestInputs({
      transportInfrastructure: {
        connectivityBand: 'critical',
        throughputBand: 'constrained',
        maintenanceBacklog: { band: 'severe' }
      }
    })
  );
  record('R10-02', 'Critical transport drags productivity', transport.productivityNudge < -2, String(transport.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      turnsTime: { paceBand: 'accelerated', season: 'Spring', macroPhaseBand: 'expansionary_cadence' },
      transportInfrastructure: { connectivityBand: 'robust', throughputBand: 'ample' }
    }),
    null,
    null
  );
  record('R10-03', 'State exposes turns summary', integrated.state.turnsSpilloverSummary != null, 'ok');
  record('R10-04', 'State exposes transport summary', integrated.state.transportSpilloverSummary != null, 'ok');
  record(
    'R10-05',
    'Sixteen transmission layers',
    integrated.state.transmissionReport.layers.length === 16,
    String(integrated.state.transmissionReport.layers.length)
  );

  const asymmetry = buildMacroTransmissionAsymmetrySnapshot(integrated.state.transmissionReport);
  record('R10-06', 'Transmission asymmetry finite', Number.isFinite(asymmetry.asymmetryIndex), String(asymmetry.asymmetryIndex));
  record(
    'R10-07',
    'Transmission includes turns layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.2_turns'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 18 }),
    [
      { id: 'cadence_stall', overlay: { turnsTime: { paceBand: 'frozen', macroPhaseBand: 'late_cycle' } } },
      { id: 'logistics_fragile', overlay: { transportInfrastructure: { connectivityBand: 'fragmented', throughputBand: 'bottlenecked' } } }
    ],
    null,
    null
  );
  const divergence = rankMacroScenarioDivergence(compare);
  const convergence = rankMacroScenarioConvergence(compare);
  const elasticity = rankMacroScenarioElasticity(compare);
  record('R10-08', 'Scenario divergence preserves row count', divergence.length === 2, String(divergence.length));
  record(
    'R10-09',
    'Divergence and convergence both rank scenarios',
    convergence.length === 2 && elasticity.length === 2,
    divergence.map(d => d.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'turns_transport_stress',
    includeTurnsTransportStress: true
  });
  record(
    'R10-10',
    'Turns/transport regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
