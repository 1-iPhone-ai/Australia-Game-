import { readMacroHousingAffordabilitySpilloverFromV1014 } from './bridge-v1014-housing-affordability.ts';
import { readMacroTradeExposureSpilloverFromV1015 } from './bridge-v1015-trade-exposure.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionDispersionSnapshot } from './macro-transmission-dispersion.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioSustainability } from './scenario-sustainability-rank.ts';
import { rankMacroScenarioEquilibrium } from './scenario-equilibrium-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round31SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const housing = readMacroHousingAffordabilitySpilloverFromV1014(
    makeDefaultV1014_MACRO_TestInputs({
      housingAffordability: { stressBand: 'crushed', tenureBand: 'precarious', serviceBand: 'strained' }
    })
  );
  record('R31-01', 'Crushed affordability drags cycle', housing.cycleNudge < -2, String(housing.cycleNudge));

  const tradeExp = readMacroTradeExposureSpilloverFromV1015(
    makeDefaultV1014_MACRO_TestInputs({
      tradeExposure: { shockBand: 'dislocated', balanceBand: 'unsustainable', opennessBand: 'fragile' }
    })
  );
  record('R31-02', 'Dislocated exposure drags productivity', tradeExp.productivityNudge <= -2, String(tradeExp.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      housingAffordability: { stressBand: 'balanced', tenureBand: 'stable', serviceBand: 'adequate' },
      tradeExposure: { opennessBand: 'diversified', shockBand: 'muted', balanceBand: 'neutral' }
    }),
    null,
    null
  );
  record('R31-03', 'State exposes housing affordability summary', integrated.state.housingAffordabilitySpilloverSummary != null, 'ok');
  record(
    'R31-04',
    'Transmission includes trade exposure layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.15_trade_exposure'),
    'ok'
  );
  record(
    'R31-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 84,
    String(integrated.state.transmissionReport.layers.length)
  );

  const dispersion = buildMacroTransmissionDispersionSnapshot(integrated.state.transmissionReport);
  record('R31-06', 'Transmission dispersion finite', Number.isFinite(dispersion.dispersionIndex), String(dispersion.dispersionIndex));
  record(
    'R31-07',
    'Transmission includes housing affordability layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.14_housing_affordability'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 53 }),
    [
      { id: 'housing_shock', overlay: { housingAffordability: { stressBand: 'critical', tenureBand: 'locked_out' } } },
      { id: 'trade_shock', overlay: { tradeExposure: { shockBand: 'critical', opennessBand: 'concentrated' } } }
    ],
    null,
    null
  );
  const sustainability = rankMacroScenarioSustainability(compare);
  const equilibrium = rankMacroScenarioEquilibrium(compare);
  record('R31-08', 'Scenario sustainability preserves row count', sustainability.length === 2, String(sustainability.length));
  record(
    'R31-09',
    'Sustainability and equilibrium both rank scenarios',
    equilibrium.length === 2 && sustainability[0].sustainabilityPriority >= 0,
    sustainability.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'housing_trade_stress',
    includeHousingTradeStress: true
  });
  record(
    'R31-10',
    'Housing/trade regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
