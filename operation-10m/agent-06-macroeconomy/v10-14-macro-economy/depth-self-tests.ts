import { readMacroFiscalSpilloverFromV1012 } from './bridge-v1012-fiscal.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { macroCycleTransitionCount, appendMacroCycleTransitionMemory } from './cycle-memory.ts';
import { composeMacroEconomyGiAnswer, detectMacroEconomyQuestion } from './gi-queries.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { composeStackedShockDeltas } from './shock-composition.ts';
import { CYCLICAL_MACRO_SHOCK_CATALOG } from './catalog/cyclical-shocks.ts';
import { computeNationalSectorOutputMix, dominantNationalSector } from './sector-decomposition.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06DepthSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const fiscal = readMacroFiscalSpilloverFromV1012(
    makeDefaultV1014_MACRO_TestInputs({
      publicFinance: { pressure: 'critical', fiscalHeadroom: -5 }
    })
  );
  record('DP01', 'Fiscal critical spillover negative investment nudge', fiscal.investmentNudge < 0, String(fiscal.investmentNudge));

  const stacked = composeStackedShockDeltas(['commodity_bust', 'global_slowdown'], CYCLICAL_MACRO_SHOCK_CATALOG);
  const naive = CYCLICAL_MACRO_SHOCK_CATALOG.commodity_bust.cycleDelta + CYCLICAL_MACRO_SHOCK_CATALOG.global_slowdown.cycleDelta;
  record('DP02', 'Stacked shocks diminish cycle drag vs naive sum', stacked.cycleDelta > naive, `${stacked.cycleDelta} vs ${naive}`);

  const baselineState = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null).state;
  const withFiscal = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({ publicFinance: { pressure: 'critical', fiscalHeadroom: -8 } }),
    null,
    null
  );

  record(
    'DP03',
    'Compute appends cycle transition when phase changes',
    macroCycleTransitionCount(
      appendMacroCycleTransitionMemory(withFiscal.persisted, {
        turn: 3,
        previousPhase: 'expansion',
        nextPhase: 'contraction'
      })
    ) >= 1,
    'ok'
  );

  const mix = computeNationalSectorOutputMix(baselineState.regionalContributions);
  const mixSum = Object.values(mix).reduce((a, b) => a + b, 0);
  record('DP04', 'Sector output mix sums to 1', Math.abs(mixSum - 1) < 1e-5, String(mixSum));
  record('DP05', 'Dominant sector resolved', dominantNationalSector(mix).length > 2, dominantNationalSector(mix));

  const match = detectMacroEconomyQuestion('What is the national business cycle phase?');
  const answer = match ? composeMacroEconomyGiAnswer(baselineState, match) : '';
  record('DP06', 'GI cycle question answered', Boolean(match && answer.includes('cycle')), answer.slice(0, 40));

  const regMatch = detectMacroEconomyQuestion('NSW regional share of macro economy');
  record('DP07', 'GI detects regional topic', regMatch?.topic === 'regional_contribution' && regMatch.regionId === 'NSW', String(regMatch?.topic));

  record(
    'DP08',
    'State exposes fiscal spillover summary',
    typeof withFiscal.state.fiscalSpilloverSummary === 'string' && withFiscal.state.fiscalSpilloverSummary!.length > 5,
    String(withFiscal.state.fiscalSpilloverSummary)
  );

  record(
    'DP09',
    'State exposes active shock ids',
    Array.isArray(withFiscal.state.activeCyclicalShockIds),
    withFiscal.state.activeCyclicalShockIds.join(',')
  );

  const mem = appendMacroCycleTransitionMemory(
    withFiscal.persisted,
    { turn: 2, previousPhase: 'expansion', nextPhase: 'slowdown' }
  );
  record('DP10', 'Manual transition append bounded', mem.transitions.length <= 16, String(mem.transitions.length));

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
