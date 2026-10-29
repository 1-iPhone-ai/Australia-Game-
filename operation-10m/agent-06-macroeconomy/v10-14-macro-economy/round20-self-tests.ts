import { readMacroMonetarySpilloverFromV1010Monetary } from './bridge-v1010-monetary.ts';
import { readMacroRentalSpilloverFromV1014Rental } from './bridge-v1014-rental.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionIntensitySnapshot } from './macro-transmission-intensity.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioMitigation } from './scenario-mitigation-rank.ts';
import { rankMacroScenarioStabilization } from './scenario-stabilization-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round20SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const monetary = readMacroMonetarySpilloverFromV1010Monetary(
    makeDefaultV1014_MACRO_TestInputs({
      monetaryPolicy: {
        policyStance: 'restrictive',
        realRateBand: 'elevated',
        liquidityBand: 'strained'
      }
    })
  );
  record('R20-01', 'Restrictive monetary drags investment', monetary.investmentNudge < -2, String(monetary.investmentNudge));

  const rental = readMacroRentalSpilloverFromV1014Rental(
    makeDefaultV1014_MACRO_TestInputs({
      rentalMarket: {
        pressureBand: 'severe',
        vacancyBand: 'glut',
        rentGrowthBand: 'surging'
      }
    })
  );
  record('R20-02', 'Severe rental pressure drags cycle', rental.cycleNudge < -1, String(rental.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      monetaryPolicy: { policyStance: 'accommodative', liquidityBand: 'ample' },
      rentalMarket: { pressureBand: 'balanced', vacancyBand: 'tight', rentGrowthBand: 'stable' }
    }),
    null,
    null
  );
  record('R20-03', 'State exposes monetary summary', integrated.state.monetarySpilloverSummary != null, 'ok');
  record('R20-04', 'State exposes rental summary', integrated.state.rentalSpilloverSummary != null, 'ok');
  record(
    'R20-05',
    'Seventy-four transmission layers',
    integrated.state.transmissionReport.layers.length === 74,
    String(integrated.state.transmissionReport.layers.length)
  );

  const intensity = buildMacroTransmissionIntensitySnapshot(integrated.state.transmissionReport);
  record('R20-06', 'Transmission intensity finite', Number.isFinite(intensity.intensityIndex), String(intensity.intensityIndex));
  record(
    'R20-07',
    'Transmission includes monetary layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.10_monetary'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 35 }),
    [
      {
        id: 'monetary_tight',
        overlay: { monetaryPolicy: { policyStance: 'aggressive_tightening', realRateBand: 'very_high' } }
      },
      {
        id: 'rental_shock',
        overlay: { rentalMarket: { pressureBand: 'critical', rentGrowthBand: 'accelerating' } }
      }
    ],
    null,
    null
  );
  const mitigation = rankMacroScenarioMitigation(compare);
  const stabilization = rankMacroScenarioStabilization(compare);
  record('R20-08', 'Scenario mitigation preserves row count', mitigation.length === 2, String(mitigation.length));
  record(
    'R20-09',
    'Mitigation and stabilization both rank scenarios',
    stabilization.length === 2 && mitigation[0].mitigationPriority >= 0,
    mitigation.map(m => m.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'monetary_rental_stress',
    includeMonetaryRentalStress: true
  });
  record(
    'R20-10',
    'Monetary/rental regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
