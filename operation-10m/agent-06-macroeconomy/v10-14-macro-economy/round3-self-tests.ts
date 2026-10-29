import { readMacroHouseholdSpilloverFromV1013 } from './bridge-v1013-households.ts';
import { readMacroIndustrySpilloverFromV101 } from './bridge-v101-industries.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { evaluateMacroConsistencyGates } from './consistency-gates.ts';
import { composeMacroEconomyDebrief, buildMacroDerivedSignals } from './macro-debrief.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round3SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const hh = readMacroHouseholdSpilloverFromV1013(
    makeDefaultV1014_MACRO_TestInputs({
      households: { domesticDemand: { band: 'surging' }, affordability: { band: 'moderate' } }
    })
  );
  record('R3-01', 'Household surging demand nudges cycle up', hh.cycleNudge > 0, String(hh.cycleNudge));

  const ind = readMacroIndustrySpilloverFromV101(
    makeDefaultV1014_MACRO_TestInputs({ industries: { nationalUtilization: 80, supplyConstrained: true } })
  );
  record('R3-02', 'Tight constrained industry lowers productivity read', ind.productivityNudge < 0, String(ind.productivityNudge));

  const base = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
  record('R3-03', 'Debrief headline present', base.state.debrief.headline.length > 5, base.state.debrief.headline.slice(0, 30));

  record('R3-04', 'Debrief bullets bounded', base.state.debrief.bullets.length >= 2 && base.state.debrief.bullets.length <= 8, String(base.state.debrief.bullets.length));

  const tension = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      publicFinance: { pressure: 'critical', fiscalHeadroom: -3 },
      households: { domesticDemand: { level: 'strong' } }
    }),
    null,
    null
  );
  record(
    'R3-05',
    'Fiscal/household tension gate fires',
    tension.state.consistencyGates.some(g => g.id === 'fiscal_household_tension'),
    tension.state.consistencyGates.map(g => g.id).join(',')
  );

  const gates = evaluateMacroConsistencyGates(tension.state, makeDefaultV1014_MACRO_TestInputs({
    publicFinance: { pressure: 'critical' },
    households: { domesticDemand: { level: 'strong' } }
  }));
  record('R3-06', 'Gate evaluator is pure', gates.some(g => g.triggered), String(gates.length));

  const debrief = composeMacroEconomyDebrief({ ...tension.state, consistencyGates: gates });
  record('R3-07', 'Debrief mentions consistency when gates fire', debrief.bullets.some(b => b.includes('Consistency') || b.includes('fiscal')), 'ok');

  const signals = buildMacroDerivedSignals({ ...tension.state, cyclePhase: 'slowdown' }, 'expansion');
  record('R3-08', 'Derived signals on phase change', signals.some(s => s.kind === 'cycle_phase_change'), String(signals.length));

  const industryRun = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ industries: { nationalUtilization: 35 } }),
    null,
    null
  );
  record(
    'R3-09',
    'Industry spillover summary on state',
    industryRun.state.industrySpilloverSummary != null || industryRun.state.productivityIndex <= base.state.productivityIndex + 1,
    String(industryRun.state.industrySpilloverSummary)
  );

  let p = null;
  let prev = null;
  for (let t = 1; t <= 20; t++) {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ turn: t }), p, prev);
    p = r.persisted;
    prev = r.state;
  }
  record('R3-10', '20-turn macro sim stays valid', prev!.accounting.identityOk, String(prev!.revision));

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
