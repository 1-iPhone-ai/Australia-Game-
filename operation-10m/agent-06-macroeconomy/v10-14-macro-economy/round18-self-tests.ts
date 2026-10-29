import { readMacroTradeLogisticsSpilloverFromV1015 } from './bridge-v1015-logistics.ts';
import { readMacroNegotiationSpilloverFromV1005 } from './bridge-v1005-negotiation.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionAlignmentSnapshot } from './macro-transmission-alignment.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioContingency } from './scenario-contingency-rank.ts';
import { rankMacroScenarioResilience } from './scenario-resilience-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round18SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const logistics = readMacroTradeLogisticsSpilloverFromV1015(
    makeDefaultV1014_MACRO_TestInputs({
      trade: {
        logistics: {
          portBacklogBand: 'gridlocked',
          routeReliability: { band: 'disrupted' },
          leadTimeBand: 'extended'
        }
      }
    })
  );
  record('R18-01', 'Gridlocked logistics drags cycle', logistics.cycleNudge < -2, String(logistics.cycleNudge));

  const negotiation = readMacroNegotiationSpilloverFromV1005(
    makeDefaultV1014_MACRO_TestInputs({
      negotiationState: {
        deadlockBand: 'entrenched',
        trustBand: 'collapsed',
        claimPressureBand: 'surging'
      }
    })
  );
  record('R18-02', 'Entrenched negotiation drags investment', negotiation.investmentNudge < -2, String(negotiation.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      trade: {
        logistics: {
          portBacklogBand: 'elevated',
          routeReliability: { band: 'robust' },
          leadTimeBand: 'normal'
        }
      },
      negotiationState: {
        deadlockBand: 'clear',
        trustBand: 'robust',
        claimPressureBand: 'calm'
      }
    }),
    null,
    null
  );
  record('R18-03', 'State exposes logistics summary', integrated.state.logisticsSpilloverSummary != null, 'ok');
  record(
    'R18-04',
    'Transmission includes negotiation layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.5_negotiation'),
    'ok'
  );
  record(
    'R18-05',
    'Thirty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 36,
    String(integrated.state.transmissionReport.layers.length)
  );

  const alignment = buildMacroTransmissionAlignmentSnapshot(integrated.state.transmissionReport);
  record('R18-06', 'Transmission alignment finite', Number.isFinite(alignment.alignmentIndex), String(alignment.alignmentIndex));
  record(
    'R18-07',
    'Transmission includes logistics layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.15_logistics'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 33 }),
    [
      {
        id: 'logistics_gridlock',
        overlay: { trade: { logistics: { portBacklogBand: 'critical', routeReliability: { band: 'fragile' } } } }
      },
      {
        id: 'negotiation_deadlock',
        overlay: { negotiationState: { deadlockBand: 'severe', trustBand: 'broken', claimPressureBand: 'critical' } }
      }
    ],
    null,
    null
  );
  const resilience = rankMacroScenarioResilience(compare);
  const contingency = rankMacroScenarioContingency(compare);
  record('R18-08', 'Scenario resilience preserves row count', resilience.length === 2, String(resilience.length));
  record(
    'R18-09',
    'Resilience and contingency both rank scenarios',
    contingency.length === 2 && resilience[0].resiliencePriority >= 0,
    resilience.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'logistics_negotiation_stress',
    includeLogisticsNegotiationStress: true
  });
  record(
    'R18-10',
    'Logistics/negotiation regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
