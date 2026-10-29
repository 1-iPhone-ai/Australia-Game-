import { readMacroExpectationsAnchorSpilloverFromV1010 } from './bridge-v1010-expectations-anchor.ts';
import { readMacroMetroMomentumSpilloverFromV1011 } from './bridge-v1011-metro-momentum.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionCentralitySnapshot } from './macro-transmission-centrality.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioConsolidation } from './scenario-consolidation-rank.ts';
import { rankMacroScenarioReconstitution } from './scenario-reconstitution-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round29SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const expectations = readMacroExpectationsAnchorSpilloverFromV1010(
    makeDefaultV1014_MACRO_TestInputs({
      inflationExpectationsAnchor: { anchorBand: 'deanchored', driftBand: 'runaway', credibilityBand: 'lost' }
    })
  );
  record('R29-01', 'Deanchored expectations drag cycle', expectations.cycleNudge < -2, String(expectations.cycleNudge));

  const metro = readMacroMetroMomentumSpilloverFromV1011(
    makeDefaultV1014_MACRO_TestInputs({
      metroMomentum: { growthBand: 'contracting', congestionBand: 'gridlocked', spreadBand: 'wide' }
    })
  );
  record('R29-02', 'Contracting metro drags investment', metro.investmentNudge <= -2, String(metro.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      inflationExpectationsAnchor: { anchorBand: 'well_anchored', driftBand: 'stable', credibilityBand: 'strong' },
      metroMomentum: { growthBand: 'strong', congestionBand: 'moderate', spreadBand: 'narrow' }
    }),
    null,
    null
  );
  record('R29-03', 'State exposes expectations summary', integrated.state.expectationsAnchorSpilloverSummary != null, 'ok');
  record(
    'R29-04',
    'Transmission includes metro momentum layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.11_metro_momentum'),
    'ok'
  );
  record(
    'R29-05',
    'Sixty-two two transmission layers',
    integrated.state.transmissionReport.layers.length === 62,
    String(integrated.state.transmissionReport.layers.length)
  );

  const centrality = buildMacroTransmissionCentralitySnapshot(integrated.state.transmissionReport);
  record('R29-06', 'Transmission centrality finite', Number.isFinite(centrality.centralityIndex), String(centrality.centralityIndex));
  record(
    'R29-07',
    'Transmission includes expectations anchor layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.10_expectations'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 50 }),
    [
      { id: 'expectations_shock', overlay: { inflationExpectationsAnchor: { anchorBand: 'critical', driftBand: 'critical' } } },
      { id: 'metro_shock', overlay: { metroMomentum: { growthBand: 'critical', congestionBand: 'critical' } } }
    ],
    null,
    null
  );
  const consolidation = rankMacroScenarioConsolidation(compare);
  const reconstitution = rankMacroScenarioReconstitution(compare);
  record('R29-08', 'Scenario consolidation preserves row count', consolidation.length === 2, String(consolidation.length));
  record(
    'R29-09',
    'Consolidation and reconstitution both rank scenarios',
    reconstitution.length === 2 && consolidation[0].consolidationPriority >= 0,
    consolidation.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'expectations_metro_stress',
    includeExpectationsMetroStress: true
  });
  record(
    'R29-10',
    'Expectations/metro regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
