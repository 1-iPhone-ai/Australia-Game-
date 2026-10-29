import { readMacroCommandCoordinationSpilloverFromV1017 } from './bridge-v1017-command-coordination.ts';
import { readMacroGuardianVigilanceSpilloverFromV1016 } from './bridge-v1016-guardian-vigilance.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionFragmentationSnapshot } from './macro-transmission-fragmentation.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioViability } from './scenario-viability-rank.ts';
import { rankMacroScenarioSustainability } from './scenario-sustainability-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round32SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const guardian = readMacroGuardianVigilanceSpilloverFromV1016(
    makeDefaultV1014_MACRO_TestInputs({
      guardianVigilance: { alertBand: 'red', coverageBand: 'blind', trustBand: 'eroded' }
    })
  );
  record('R32-01', 'Red vigilance drags investment', guardian.investmentNudge <= -2, String(guardian.investmentNudge));

  const command = readMacroCommandCoordinationSpilloverFromV1017(
    makeDefaultV1014_MACRO_TestInputs({
      commandCoordination: { syncBand: 'broken', latencyBand: 'unbounded', loadBand: 'saturated' }
    })
  );
  record('R32-02', 'Broken coordination drags cycle', command.cycleNudge < -2, String(command.cycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      guardianVigilance: { alertBand: 'green', coverageBand: 'full', trustBand: 'strong' },
      commandCoordination: { syncBand: 'aligned', latencyBand: 'low', loadBand: 'balanced' }
    }),
    null,
    null
  );
  record('R32-03', 'State exposes guardian vigilance summary', integrated.state.guardianVigilanceSpilloverSummary != null, 'ok');
  record(
    'R32-04',
    'Transmission includes command coordination layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.17_command_coordination'),
    'ok'
  );
  record(
    'R32-05',
    'Sixty-two two transmission layers',
    integrated.state.transmissionReport.layers.length === 62,
    String(integrated.state.transmissionReport.layers.length)
  );

  const fragmentation = buildMacroTransmissionFragmentationSnapshot(integrated.state.transmissionReport);
  record(
    'R32-06',
    'Transmission fragmentation finite',
    Number.isFinite(fragmentation.fragmentationIndex),
    String(fragmentation.fragmentationIndex)
  );
  record(
    'R32-07',
    'Transmission includes guardian vigilance layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.16_guardian_vigilance'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 54 }),
    [
      { id: 'guardian_shock', overlay: { guardianVigilance: { alertBand: 'critical', coverageBand: 'gapped' } } },
      { id: 'command_shock', overlay: { commandCoordination: { syncBand: 'critical', loadBand: 'overloaded' } } }
    ],
    null,
    null
  );
  const viability = rankMacroScenarioViability(compare);
  const sustainability = rankMacroScenarioSustainability(compare);
  record('R32-08', 'Scenario viability preserves row count', viability.length === 2, String(viability.length));
  record(
    'R32-09',
    'Viability and sustainability both rank scenarios',
    sustainability.length === 2 && viability[0].viabilityPriority >= 0,
    viability.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'guardian_command_stress',
    includeGuardianCommandStress: true
  });
  record(
    'R32-10',
    'Guardian/command regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
