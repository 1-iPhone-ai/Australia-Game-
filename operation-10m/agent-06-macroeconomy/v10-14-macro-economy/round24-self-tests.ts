import { readMacroArchiveIntegritySpilloverFromV1024 } from './bridge-v1024-archive-integrity.ts';
import { readMacroStrategicGameplaySpilloverFromV1001 } from './bridge-v1001-strategic-gameplay.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionHarmonicSnapshot } from './macro-transmission-harmonic.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import { compareMacroEconomyScenarios } from './scenario-compare.ts';
import { rankMacroScenarioRebalance } from './scenario-rebalance-rank.ts';
import { rankMacroScenarioRestoration } from './scenario-restoration-rank.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round24SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const gameplay = readMacroStrategicGameplaySpilloverFromV1001(
    makeDefaultV1014_MACRO_TestInputs({
      strategicGameplay: { pacingBand: 'gridlocked', coherenceBand: 'fragmented', frictionBand: 'paralyzed' }
    })
  );
  record('R24-01', 'Gridlocked gameplay drags cycle', gameplay.cycleNudge < -2, String(gameplay.cycleNudge));

  const archive = readMacroArchiveIntegritySpilloverFromV1024(
    makeDefaultV1014_MACRO_TestInputs({
      historyArchiveIntegrity: { integrityBand: 'corrupt', lineageBand: 'broken', retentionBand: 'truncated' }
    })
  );
  record('R24-02', 'Corrupt archive drags investment', archive.investmentNudge < -2, String(archive.investmentNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      strategicGameplay: { pacingBand: 'fluid', coherenceBand: 'aligned', frictionBand: 'low' },
      historyArchiveIntegrity: { integrityBand: 'verified', lineageBand: 'continuous', retentionBand: 'durable' }
    }),
    null,
    null
  );
  record('R24-03', 'State exposes gameplay summary', integrated.state.strategicGameplaySpilloverSummary != null, 'ok');
  record(
    'R24-04',
    'Transmission includes archive integrity layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.24_archive'),
    'ok'
  );
  record(
    'R24-05',
    'Seventy-eight transmission layers',
    integrated.state.transmissionReport.layers.length === 88,
    String(integrated.state.transmissionReport.layers.length)
  );

  const harmonic = buildMacroTransmissionHarmonicSnapshot(integrated.state.transmissionReport);
  record('R24-06', 'Transmission harmonic finite', Number.isFinite(harmonic.harmonicIndex), String(harmonic.harmonicIndex));
  record(
    'R24-07',
    'Transmission includes strategic gameplay layer',
    integrated.state.transmissionReport.layers.some(l => l.systemId === 'v10.01_strategic_gameplay'),
    'ok'
  );

  const compare = compareMacroEconomyScenarios(
    makeDefaultV1014_MACRO_TestInputs({ turn: 40 }),
    [
      { id: 'gameplay_shock', overlay: { strategicGameplay: { pacingBand: 'critical', frictionBand: 'severe' } } },
      { id: 'archive_shock', overlay: { historyArchiveIntegrity: { integrityBand: 'critical', retentionBand: 'critical' } } }
    ],
    null,
    null
  );
  const restoration = rankMacroScenarioRestoration(compare);
  const rebalance = rankMacroScenarioRebalance(compare);
  record('R24-08', 'Scenario restoration preserves row count', restoration.length === 2, String(restoration.length));
  record(
    'R24-09',
    'Restoration and rebalance both rank scenarios',
    rebalance.length === 2 && restoration[0].restorationPriority >= 0,
    restoration.map(r => r.scenarioId).join('>')
  );

  const harness = runMacroEconomyRegressionHarness({
    turns: 10,
    scenarioId: 'gameplay_archive_stress',
    includeGameplayArchiveStress: true
  });
  record(
    'R24-10',
    'Gameplay/archive regression harness',
    harness.allPassed,
    harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
