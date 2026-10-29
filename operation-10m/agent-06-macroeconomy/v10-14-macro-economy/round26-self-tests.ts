import { readMacroBudgetOutlookSpilloverFromV1007 } from './bridge-v1007-budget-outlook.ts';
import { readMacroResearchMomentumSpilloverFromV1003 } from './bridge-v1003-research-momentum.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionAttenuationSnapshot } from './macro-transmission-attenuation.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioRenewal } from './scenario-renewal-rank.ts';
import { rankMacroScenarioRevival } from './scenario-revival-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round26SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const research = readMacroResearchMomentumSpilloverFromV1003(
    makeDefaultV1014_MACRO_TestInputs({
      researchMomentum: { velocityBand: 'collapsed', diffusionBand: 'siloed', fundingBand: 'frozen' }
    })
  );
  record('R26-01', 'Collapsed research drags productivity', research.productivityNudge < -2, String(research.productivityNudge));

  const budget = readMacroBudgetOutlookSpilloverFromV1007(
    makeDefaultV1014_MACRO_TestInputs({
      budgetOutlook: { trajectoryBand: 'unsustainable', consolidationBand: 'severe', capexRoomBand: 'exhausted' }
    })
  );
  record('R26-02', 'Exhausted capex room drags investment', budget.investmentNudge < -2, String(budget.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      researchMomentum: { velocityBand: 'surging', diffusionBand: 'broad', fundingBand: 'strong' },
      budgetOutlook: { trajectoryBand: 'stable', consolidationBand: 'moderate', capexRoomBand: 'ample' }
    }),
    null,
    null
  );
  record('R26-03', 'State exposes research momentum summary', integrated.state.researchMomentumSpilloverSummary != null, 'ok');
  record(
    'R26-04',
    'Transmission includes budget outlook layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.07_budget'),
    'ok'
  );
  record(
    'R26-05',
    'Sixty-six transmission layers',
    integrated.state.transmissionReport.layers.length === 66,
    String(integrated.state.transmissionReport.layers.length)
  );

  const attenuation = buildMacroTransmissionAttenuationSnapshot(integrated.state.transmissionReport);
  record(
    'R26-06',
    'Transmission attenuation finite',
    Number.isFinite(attenuation.attenuationIndex),
    String(attenuation.attenuationIndex)
  );
  record(
    'R26-07',
    'Transmission includes research momentum layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.03_research_momentum'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 44 }),
    [
      { id: 'research_shock', overlay: { researchMomentum: { velocityBand: 'critical', fundingBand: 'starved' } } },
      { id: 'budget_shock', overlay: { budgetOutlook: { trajectoryBand: 'critical', capexRoomBand: 'critical' } } }
    ],
    null,
    null
  );
  const revival = rankMacroScenarioRevival(compare);
  const renewal = rankMacroScenarioRenewal(compare);
  record('R26-08', 'Scenario revival preserves row count', revival.length === 2, String(revival.length));
  record(
    'R26-09',
    'Revival and renewal both rank scenarios',
    renewal.length === 2 && revival[0].revivalPriority >= 0,
    revival.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'research_budget_stress',
    includeResearchBudgetStress: true
  });
  record(
    'R26-10',
    'Research/budget regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
