import { readMacroEnergySpilloverFromV1018 } from './bridge-v1018-energy.ts';
import { readMacroInflationSpilloverFromV1010 } from './bridge-v1010-inflation.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionCoherenceSnapshot } from './macro-transmission-coherence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioElasticity } from './scenario-elasticity.ts';
import { rankMacroEconomyScenariosByNetOutcome } from './scenario-ranking.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round8SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const inflation = readMacroInflationSpilloverFromV1010(
    makeDefaultV1014_MACRO_TestInputs({
      nationalFinance: { inflation: { band: 'elevated' }, inflationExpectations: { band: 'rising' } }
    })
  );
  record('R8-01', 'Elevated inflation drags cycle read', inflation.cycleNudge < -1, String(inflation.cycleNudge));

  const energy = readMacroEnergySpilloverFromV1018(
    makeDefaultV1014_MACRO_TestInputs({
      industrialEnergy: { supplyReliability: { band: 'critical' }, energyCost: { band: 'severe' } }
    })
  );
  record('R8-02', 'Critical energy supply drags productivity', energy.productivityNudge < -1, String(energy.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      nationalFinance: { inflation: { band: 'moderate' } },
      industrialEnergy: { transition: { band: 'accelerating' }, supplyReliability: { band: 'robust' } }
    }),
    null,
    null
  );
  record('R8-03', 'State exposes inflation summary', integrated.state.inflationSpilloverSummary != null, 'ok');
  record('R8-04', 'State exposes energy summary', integrated.state.energySpilloverSummary != null, 'ok');
  record(
    'R8-05',
    'Twenty-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 28,
    String(integrated.state.transmissionReport.layers.length)
  );

  const coherence = buildMacroTransmissionCoherenceSnapshot(integrated.state.transmissionReport, integrated.state.cyclePhase);
  record('R8-06', 'Transmission coherence finite', Number.isFinite(coherence.coherenceIndex), String(coherence.coherenceIndex));
  record(
    'R8-07',
    'Transmission includes inflation layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.10_inflation'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 14 }),
    [
      { id: 'energy_cost_shock', overlay: { industrialEnergy: { energyCost: { band: 'severe' } } } },
      { id: 'disinflation', overlay: { nationalFinance: { inflation: { band: 'disinflation' } } } }
    ],
    null,
    null
  );
  const ranked = rankMacroEconomyScenariosByNetOutcome(compare);
  const elasticity = rankMacroScenarioElasticity(compare);
  record('R8-08', 'Scenario elasticity preserves row count', elasticity.length === 2, String(elasticity.length));
  record(
    'R8-09',
    'Disinflation ranks above energy cost shock',
    ranked[0].scenarioId === 'disinflation',
    ranked.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'inflation_energy_stress',
    includeInflationEnergyStress: true
  });
  record(
    'R8-10',
    'Inflation/energy regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
