import { readMacroAccessibilitySpilloverFromV1022 } from './bridge-v1022-accessibility.ts';
import { readMacroTimelineSpilloverFromV1024 } from './bridge-v1024-timeline.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionCouplingSnapshot } from './macro-transmission-coupling.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioAdaptation } from './scenario-adaptation-rank.ts';
import { rankMacroScenarioContainment } from './scenario-containment-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round22SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const accessibility = readMacroAccessibilitySpilloverFromV1022(
    makeDefaultV1014_MACRO_TestInputs({
      uiAccessibility: { contrastBand: 'failing', inputLagBand: 'severe', coverageBand: 'gaps' }
    })
  );
  record('R22-01', 'Failing accessibility drags productivity', accessibility.productivityNudge < -2, String(accessibility.productivityNudge));

  const timeline = readMacroTimelineSpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      historyTimeline: { gapBand: 'broken', narrativeDriftBand: 'runaway', shockMemoryBand: 'scarring' }
    })
  );
  record('R22-02', 'Broken timeline drags investment', timeline.investmentNudge < -2, String(timeline.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      uiAccessibility: { contrastBand: 'strong', inputLagBand: 'snappy', coverageBand: 'full' },
      historyTimeline: { gapBand: 'coherent', narrativeDriftBand: 'stable', shockMemoryBand: 'fading' }
    }),
    null,
    null
  );
  record('R22-03', 'State exposes coupling snapshot', integrated.state.transmissionCoupling.summary.length > 0, 'ok');
  record(
    'R22-04',
    'Transmission includes timeline layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_timeline'),
    'ok'
  );
  record(
    'R22-05',
    'Sixty-two two transmission layers',
    integrated.state.transmissionReport.layers.length === 62,
    String(integrated.state.transmissionReport.layers.length)
  );

  const coupling = buildMacroTransmissionCouplingSnapshot(integrated.state.transmissionReport);
  record('R22-06', 'Transmission coupling finite', Number.isFinite(coupling.couplingIndex), String(coupling.couplingIndex));
  record(
    'R22-07',
    'Transmission includes accessibility layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.22_accessibility'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 37 }),
    [
      { id: 'a11y_fail', overlay: { uiAccessibility: { contrastBand: 'critical', coverageBand: 'critical' } } },
      { id: 'timeline_break', overlay: { historyTimeline: { gapBand: 'discontinuous', shockMemoryBand: 'deep' } } }
    ],
    null,
    null
  );
  const containment = rankMacroScenarioContainment(compare);
  const adaptation = rankMacroScenarioAdaptation(compare);
  record('R22-08', 'Scenario containment preserves row count', containment.length === 2, String(containment.length));
  record(
    'R22-09',
    'Containment and adaptation both rank scenarios',
    adaptation.length === 2 && containment[0].containmentPriority >= 0,
    containment.map(c => c.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'accessibility_timeline_stress',
    includeAccessibilityTimelineStress: true
  });
  record(
    'R22-10',
    'Accessibility/timeline regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
