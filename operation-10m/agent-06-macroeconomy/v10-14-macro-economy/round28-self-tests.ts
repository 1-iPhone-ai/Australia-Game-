import { readMacroDemographicShiftSpilloverFromV1009 } from './bridge-v1009-demographic-shift.ts';
import { readMacroEventCascadeSpilloverFromV1005 } from './bridge-v1005-event-cascade.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionPersistenceSnapshot } from './macro-transmission-persistence.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioReconstitution } from './scenario-reconstitution-rank.ts';
import { rankMacroScenarioRegeneration } from './scenario-regeneration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round28SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const events = readMacroEventCascadeSpilloverFromV1005(
    makeDefaultV1014_MACRO_TestInputs({
      eventCascade: { intensityBand: 'runaway', propagationBand: 'accelerating', durationBand: 'chronic' }
    })
  );
  record('R28-01', 'Runaway cascade drags cycle', events.cycleNudge < -2, String(events.cycleNudge));

  const demo = readMacroDemographicShiftSpilloverFromV1009(
    makeDefaultV1014_MACRO_TestInputs({
      demographicShift: { migrationBand: 'brain_drain', agingBand: 'accelerating', participationBand: 'collapsed' }
    })
  );
  record('R28-02', 'Collapsed participation drags cycle', demo.cycleNudge < -2, String(demo.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      eventCascade: { intensityBand: 'contained', propagationBand: 'local', durationBand: 'fading' },
      demographicShift: { migrationBand: 'balanced', agingBand: 'gradual', participationBand: 'stable' }
    }),
    null,
    null
  );
  record('R28-03', 'State exposes event cascade summary', integrated.state.eventCascadeSpilloverSummary != null, 'ok');
  record(
    'R28-04',
    'Transmission includes demographic shift layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.09_demographic_shift'),
    'ok'
  );
  record(
    'R28-05',
    'Sixty-two transmission layers',
    integrated.state.transmissionReport.layers.length === 62,
    String(integrated.state.transmissionReport.layers.length)
  );

  const persistence = buildMacroTransmissionPersistenceSnapshot(integrated.state.transmissionReport);
  record(
    'R28-06',
    'Transmission persistence finite',
    Number.isFinite(persistence.persistenceIndex),
    String(persistence.persistenceIndex)
  );
  record(
    'R28-07',
    'Transmission includes event cascade layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.05_event_cascade'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 48 }),
    [
      { id: 'event_shock', overlay: { eventCascade: { intensityBand: 'critical', durationBand: 'critical' } } },
      { id: 'demo_shock', overlay: { demographicShift: { participationBand: 'critical', agingBand: 'critical' } } }
    ],
    null,
    null
  );
  const reconstitution = rankMacroScenarioReconstitution(compare);
  const regeneration = rankMacroScenarioRegeneration(compare);
  record('R28-08', 'Scenario reconstitution preserves row count', reconstitution.length === 2, String(reconstitution.length));
  record(
    'R28-09',
    'Reconstitution and regeneration both rank scenarios',
    regeneration.length === 2 && reconstitution[0].reconstitutionPriority >= 0,
    reconstitution.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'event_demographic_stress',
    includeEventDemographicStress: true
  });
  record(
    'R28-10',
    'Event/demographic regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
