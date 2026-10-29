import { readMacroHouseholdConfidenceSpilloverFromV1013 } from './bridge-v1013-confidence.ts';
import { readMacroCapexSpilloverFromV1008 } from './bridge-v1008-capex.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionSynchronizationSnapshot } from './macro-transmission-synchronization.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioResilience } from './scenario-resilience-rank.ts';
import { rankMacroScenarioStabilization } from './scenario-stabilization-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round19SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const confidence = readMacroHouseholdConfidenceSpilloverFromV1013(
    makeDefaultV1014_MACRO_TestInputs({
      households: {
        consumerConfidence: { band: 'collapsed', volatilityBand: 'whipsaw' }
      }
    })
  );
  record('R19-01', 'Collapsed confidence drags cycle', confidence.cycleNudge < -2, String(confidence.cycleNudge));

  const capex = readMacroCapexSpilloverFromV1008(
    makeDefaultV1014_MACRO_TestInputs({
      privateSector: {
        capexCycle: { pipelineBand: 'frozen', freezeBand: 'binding', paybackBand: 'stretched' }
      }
    })
  );
  record('R19-02', 'Frozen capex drags investment', capex.investmentNudge < -2, String(capex.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      households: { consumerConfidence: { band: 'cautious', volatilityBand: 'stable' } },
      companies: { capexCycle: { pipelineBand: 'strong', paybackBand: 'attractive' } }
    }),
    null,
    null
  );
  record('R19-03', 'State exposes confidence summary', integrated.state.confidenceSpilloverSummary != null, 'ok');
  record('R19-04', 'State exposes capex summary', integrated.state.capexSpilloverSummary != null, 'ok');
  record(
    'R19-05',
    'Fifty-two transmission layers',
    integrated.state.transmissionReport.layers.length === 52,
    String(integrated.state.transmissionReport.layers.length)
  );

  const sync = buildMacroTransmissionSynchronizationSnapshot(integrated.state.transmissionReport);
  record('R19-06', 'Transmission synchronization finite', Number.isFinite(sync.synchronizationIndex), String(sync.synchronizationIndex));
  record(
    'R19-07',
    'Transmission includes confidence layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.13_confidence'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 34 }),
    [
      {
        id: 'confidence_shock',
        overlay: { households: { consumerConfidence: { band: 'critical', volatilityBand: 'extreme' } } }
      },
      {
        id: 'capex_freeze',
        overlay: { privateSector: { capexCycle: { pipelineBand: 'critical', freezeBand: 'total' } } }
      }
    ],
    null,
    null
  );
  const stabilization = rankMacroScenarioStabilization(compare);
  const resilience = rankMacroScenarioResilience(compare);
  record('R19-08', 'Scenario stabilization preserves row count', stabilization.length === 2, String(stabilization.length));
  record(
    'R19-09',
    'Stabilization and resilience both rank scenarios',
    resilience.length === 2 && stabilization[0].stabilizationPriority >= 0,
    stabilization.map(s => s.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'confidence_capex_stress',
    includeConfidenceCapexStress: true
  });
  record(
    'R19-10',
    'Confidence/capex regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
