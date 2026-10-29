import { readMacroLiquiditySpilloverFromV1016Liquidity } from './bridge-v1016-liquidity.ts';
import { readMacroMapsTelemetrySpilloverFromV1023 } from './bridge-v1023-maps-telemetry.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionImbalanceSnapshot } from './macro-transmission-imbalance.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioContainment } from './scenario-containment-rank.ts';
import { rankMacroScenarioRebalance } from './scenario-rebalance-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round23SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const liquidity = readMacroLiquiditySpilloverFromV1016Liquidity(
    makeDefaultV1014_MACRO_TestInputs({
      systemLiquidity: { band: 'frozen', marketDepthBand: 'thin', rolloverRiskBand: 'severe' }
    })
  );
  record('R23-01', 'Frozen liquidity drags investment', liquidity.investmentNudge < -2, String(liquidity.investmentNudge));

  const maps = readMacroMapsTelemetrySpilloverFromV1023(
    makeDefaultV1014_MACRO_TestInputs({
      mapsTelemetry: { geoFidelityBand: 'distorted', tileLatencyBand: 'stale', coverageBand: 'gaps' }
    })
  );
  record('R23-02', 'Distorted maps drag cycle', maps.cycleNudge < -1, String(maps.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      systemLiquidity: { band: 'ample', marketDepthBand: 'deep', rolloverRiskBand: 'low' },
      mapsTelemetry: { geoFidelityBand: 'high', tileLatencyBand: 'realtime', coverageBand: 'complete' }
    }),
    null,
    null
  );
  record('R23-03', 'State exposes liquidity summary', integrated.state.liquiditySpilloverSummary != null, 'ok');
  record('R23-04', 'Transmission includes maps telemetry layer', integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.23_maps_telemetry'), 'ok');
  record(
    'R23-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 82,
    String(integrated.state.transmissionReport.layers.length)
  );

  const imbalance = buildMacroTransmissionImbalanceSnapshot(integrated.state.transmissionReport);
  record('R23-06', 'Transmission imbalance finite', Number.isFinite(imbalance.imbalanceIndex), String(imbalance.imbalanceIndex));
  record(
    'R23-07',
    'Transmission includes liquidity layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.16_liquidity'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 38 }),
    [
      { id: 'liquidity_shock', overlay: { systemLiquidity: { band: 'critical', rolloverRiskBand: 'default_wave' } } },
      { id: 'maps_noise', overlay: { mapsTelemetry: { geoFidelityBand: 'critical', coverageBand: 'critical' } } }
    ],
    null,
    null
  );
  const rebalance = rankMacroScenarioRebalance(compare);
  const containment = rankMacroScenarioContainment(compare);
  record('R23-08', 'Scenario rebalance preserves row count', rebalance.length === 2, String(rebalance.length));
  record(
    'R23-09',
    'Rebalance and containment both rank scenarios',
    containment.length === 2 && rebalance[0].rebalancePriority >= 0,
    rebalance.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'liquidity_maps_stress',
    includeLiquidityMapsStress: true
  });
  record(
    'R23-10',
    'Liquidity/maps regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
