import { readMacroEnergyTransitionPaceSpilloverFromV1013 } from './bridge-v1013-energy-transition-pace.ts';
import { readMacroTransportThroughputSpilloverFromV1012 } from './bridge-v1012-transport-throughput.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionSynthesisSnapshot } from './macro-transmission-synthesis.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioEquilibrium } from './scenario-equilibrium-rank.ts';
import { rankMacroScenarioConsolidation } from './scenario-consolidation-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round30SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const transport = readMacroTransportThroughputSpilloverFromV1012(
    makeDefaultV1014_MACRO_TestInputs({
      transportThroughput: { flowBand: 'collapsed', backlogBand: 'unbounded', reliabilityBand: 'failing' }
    })
  );
  record('R30-01', 'Collapsed throughput drags productivity', transport.productivityNudge < -2, String(transport.productivityNudge));

  const energy = readMacroEnergyTransitionPaceSpilloverFromV1013(
    makeDefaultV1014_MACRO_TestInputs({
      energyTransitionPace: { paceBand: 'forced', costBand: 'spiking', gridBand: 'unstable' }
    })
  );
  record('R30-02', 'Forced transition drags investment', energy.investmentNudge <= -2, String(energy.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      transportThroughput: { flowBand: 'fluid', backlogBand: 'moderate', reliabilityBand: 'robust' },
      energyTransitionPace: { paceBand: 'orderly', costBand: 'manageable', gridBand: 'stable' }
    }),
    null,
    null
  );
  record('R30-03', 'State exposes transport throughput summary', integrated.state.transportThroughputSpilloverSummary != null, 'ok');
  record(
    'R30-04',
    'Transmission includes energy transition layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.13_energy_transition'),
    'ok'
  );
  record(
    'R30-05',
    'Sixty-four transmission layers',
    integrated.state.transmissionReport.layers.length === 64,
    String(integrated.state.transmissionReport.layers.length)
  );

  const synthesis = buildMacroTransmissionSynthesisSnapshot(integrated.state.transmissionReport);
  record('R30-06', 'Transmission synthesis finite', Number.isFinite(synthesis.synthesisIndex), String(synthesis.synthesisIndex));
  record(
    'R30-07',
    'Transmission includes transport throughput layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.12_transport_throughput'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 52 }),
    [
      { id: 'transport_shock', overlay: { transportThroughput: { flowBand: 'critical', backlogBand: 'critical' } } },
      { id: 'energy_shock', overlay: { energyTransitionPace: { paceBand: 'critical', gridBand: 'critical' } } }
    ],
    null,
    null
  );
  const equilibrium = rankMacroScenarioEquilibrium(compare);
  const consolidation = rankMacroScenarioConsolidation(compare);
  record('R30-08', 'Scenario equilibrium preserves row count', equilibrium.length === 2, String(equilibrium.length));
  record(
    'R30-09',
    'Equilibrium and consolidation both rank scenarios',
    consolidation.length === 2 && equilibrium[0].equilibriumPriority >= 0,
    equilibrium.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'transport_energy_stress',
    includeTransportEnergyStress: true
  });
  record(
    'R30-10',
    'Transport/energy regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
