import { readMacroCompaniesSpilloverFromV108 } from './bridge-v108-companies.ts';
import { readMacroEventsSpilloverFromV105 } from './bridge-v105-events.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionConcentrationSnapshot } from './macro-transmission-concentration.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioConvergence } from './scenario-convergence.ts';
import { rankMacroScenarioElasticity } from './scenario-elasticity.ts';
import { rankMacroEconomyScenariosByNetOutcome } from './scenario-ranking.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round9SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const events = readMacroEventsSpilloverFromV105(
    makeDefaultV1014_MACRO_TestInputs({
      dynamicEvents: {
        nationalStabilityBand: 'critical',
        pendingBacklogBand: 'surging',
        activeCrisisCount: 3
      }
    })
  );
  record('R9-01', 'Critical event backlog drags cycle read', events.cycleNudge < -3, String(events.cycleNudge));

  const companies = readMacroCompaniesSpilloverFromV108(
    makeDefaultV1014_MACRO_TestInputs({
      privateSector: {
        nationalUtilizationBand: 'critical',
        overloadedFirmCount: 5,
        productionMomentum: { band: 'contracting' }
      }
    })
  );
  record('R9-02', 'Production strain drags productivity', companies.productivityNudge < -2, String(companies.productivityNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      dynamicEvents: { nationalStabilityBand: 'stable', pendingBacklogBand: 'calm' },
      privateSector: { nationalUtilizationBand: 'overextended', productionMomentum: { band: 'strong' } }
    }),
    null,
    null
  );
  record('R9-03', 'State exposes events summary', integrated.state.eventsSpilloverSummary != null, 'ok');
  record('R9-04', 'State exposes companies summary', integrated.state.companiesSpilloverSummary != null, 'ok');
  record(
    'R9-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 96,
    String(integrated.state.transmissionReport.layers.length)
  );

  const concentration = buildMacroTransmissionConcentrationSnapshot(integrated.state.transmissionReport);
  record('R9-06', 'Transmission concentration finite', Number.isFinite(concentration.concentrationIndex), String(concentration.concentrationIndex));
  record(
    'R9-07',
    'Transmission includes events layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.5_events'),
    integrated.state.transmissionReport.layers.map(l => l.systemId).join(',')
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 16 }),
    [
      { id: 'event_backlog', overlay: { dynamicEvents: { pendingBacklogBand: 'critical', nationalStabilityBand: 'fragile' } } },
      { id: 'production_slack', overlay: { privateSector: { nationalUtilizationBand: 'slack', productionMomentum: { band: 'contracting' } } } }
    ],
    null,
    null
  );
  const convergence = rankMacroScenarioConvergence(compare);
  const ranked = rankMacroEconomyScenariosByNetOutcome(compare);
  const elasticity = rankMacroScenarioElasticity(compare);
  record('R9-08', 'Scenario convergence preserves row count', convergence.length === 2, String(convergence.length));
  record(
    'R9-09',
    'Elasticity and ranking both order scenarios',
    ranked.length === 2 && elasticity.length === 2,
    ranked.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'events_companies_stress',
    includeEventsCompaniesStress: true
  });
  record(
    'R9-10',
    'Events/companies regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
