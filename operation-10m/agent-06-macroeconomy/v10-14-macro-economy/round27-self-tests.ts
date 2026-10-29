import { readMacroModeShiftSpilloverFromV1004 } from './bridge-v1004-mode-shift.ts';
import { readMacroSupplyChainSpilloverFromV1008 } from './bridge-v1008-supply-chain.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionEnvelopeSnapshot } from './macro-transmission-envelope.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioRegeneration } from './scenario-regeneration-rank.ts';
import { rankMacroScenarioRevival } from './scenario-revival-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round27SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const mode = readMacroModeShiftSpilloverFromV1004(
    makeDefaultV1014_MACRO_TestInputs({
      modeShift: { volatilityBand: 'chaotic', alignmentBand: 'contradictory', handoffBand: 'failed' }
    })
  );
  record('R27-01', 'Chaotic mode shift drags cycle', mode.cycleNudge < -2, String(mode.cycleNudge));

  const supply = readMacroSupplyChainSpilloverFromV1008(
    makeDefaultV1014_MACRO_TestInputs({
      supplyChainStress: { fragilityBand: 'broken', leadTimeBand: 'extreme', inventoryBand: 'empty' }
    })
  );
  record('R27-02', 'Broken supply chain drags productivity', supply.productivityNudge < -2, String(supply.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      modeShift: { volatilityBand: 'stable', alignmentBand: 'aligned', handoffBand: 'smooth' },
      supplyChainStress: { fragilityBand: 'resilient', leadTimeBand: 'normal', inventoryBand: 'healthy' }
    }),
    null,
    null
  );
  record('R27-03', 'State exposes mode shift summary', integrated.state.modeShiftSpilloverSummary != null, 'ok');
  record(
    'R27-04',
    'Transmission includes supply chain layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.08_supply_chain'),
    'ok'
  );
  record(
    'R27-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 84,
    String(integrated.state.transmissionReport.layers.length)
  );

  const envelope = buildMacroTransmissionEnvelopeSnapshot(integrated.state.transmissionReport);
  record('R27-06', 'Transmission envelope finite', Number.isFinite(envelope.envelopeIndex), String(envelope.envelopeIndex));
  record(
    'R27-07',
    'Transmission includes mode shift layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.04_mode_shift'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 46 }),
    [
      { id: 'mode_shock', overlay: { modeShift: { volatilityBand: 'critical', handoffBand: 'critical' } } },
      { id: 'supply_shock', overlay: { supplyChainStress: { fragilityBand: 'critical', inventoryBand: 'critical' } } }
    ],
    null,
    null
  );
  const regeneration = rankMacroScenarioRegeneration(compare);
  const revival = rankMacroScenarioRevival(compare);
  record('R27-08', 'Scenario regeneration preserves row count', regeneration.length === 2, String(regeneration.length));
  record(
    'R27-09',
    'Regeneration and revival both rank scenarios',
    revival.length === 2 && regeneration[0].regenerationPriority >= 0,
    regeneration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'mode_supply_stress',
    includeModeSupplyStress: true
  });
  record(
    'R27-10',
    'Mode/supply regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
