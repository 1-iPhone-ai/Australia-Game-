import {
  CYCLICAL_MACRO_SHOCK_CATALOG,
  CYCLICAL_MACRO_SHOCK_IDS,
  applyCyclicalShockLibrary,
  resolveActiveCyclicalShockIds
} from './cyclical-shocks.ts';
import { createMacroEvidencePush } from '../shocks.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runCyclicalShockLibrarySelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  record(
    'CS01',
    'Catalog has core shocks',
    CYCLICAL_MACRO_SHOCK_IDS.length >= 8,
    `count=${CYCLICAL_MACRO_SHOCK_IDS.length}`
  );

  const legacy = resolveActiveCyclicalShockIds({
    highInflationScenarioActive: true,
    creditShockActive: true
  });
  record(
    'CS02',
    'Legacy flags map to catalog ids',
    legacy.includes('high_inflation') && legacy.includes('credit_contraction'),
    legacy.join(',')
  );

  const ev: import('./types.ts').MacroEconomyEvidence[] = [];
  const push = createMacroEvidencePush(ev, 1);
  const out = applyCyclicalShockLibrary(['stimulus_bounce'], { productivityScore: 50, investmentScore: 50, cycleScore: 50 }, push);
  record(
    'CS03',
    'Stimulus bounce raises investment score',
    out.investmentScore > 50 && out.cycleScore > 50,
    `inv=${out.investmentScore} cycle=${out.cycleScore}`
  );

  const bust = applyCyclicalShockLibrary(
    ['commodity_bust'],
    { productivityScore: 60, investmentScore: 60, cycleScore: 60 },
    push
  );
  record(
    'CS04',
    'Commodity bust lowers cycle score',
    bust.cycleScore < 60,
    String(bust.cycleScore)
  );

  record(
    'CS05',
    'Every catalog entry has description',
    CYCLICAL_MACRO_SHOCK_IDS.every(id => CYCLICAL_MACRO_SHOCK_CATALOG[id].description.length > 10),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
