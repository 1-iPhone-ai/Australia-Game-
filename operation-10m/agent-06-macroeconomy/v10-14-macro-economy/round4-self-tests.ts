import { readMacroGeographySpillover } from './bridge-economic-geography.ts';
import { readMacroTradeSpilloverFromV1015 } from './bridge-v1015-trade.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { buildMacroTransmissionReport } from './macro-transmission.ts';
import { readMacroFiscalSpilloverFromV1012 } from './bridge-v1012-fiscal.ts';
import { readMacroHouseholdSpilloverFromV1013 } from './bridge-v1013-households.ts';
import { readMacroIndustrySpilloverFromV101 } from './bridge-v101-industries.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { runMacroEconomyRegressionHarness } from './regression-harness.ts';
import type { MacroSelfTestResult } from './types.ts';

export function runAgent06Round4SelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const trade = readMacroTradeSpilloverFromV1015(
    makeDefaultV1014_MACRO_TestInputs({ trade: { termsOfTrade: { band: 'weak' }, exportMomentum: -5 } })
  );
  record('R4-01', 'Weak trade terms drag cycle', trade.cycleNudge < 0, String(trade.cycleNudge));

  const geo = readMacroGeographySpillover(
    makeDefaultV1014_MACRO_TestInputs({ economicGeography: { connectivity: { band: 'strong' } } })
  );
  record('R4-02', 'Strong geography lifts investment read', geo.investmentNudge > 0, String(geo.investmentNudge));

  const report = buildMacroTransmissionReport({
    turn: 4,
    fiscal: readMacroFiscalSpilloverFromV1012(makeDefaultV1014_MACRO_TestInputs({ publicFinance: { pressure: 'strained' } })),
    household: readMacroHouseholdSpilloverFromV1013(makeDefaultV1014_MACRO_TestInputs()),
    industry: readMacroIndustrySpilloverFromV101(makeDefaultV1014_MACRO_TestInputs()),
    trade,
    geography: geo,
    credit: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null },
    innovation: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null },
    workforce: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null },
    strategic: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null },
    housing: { cycleNudge: 0, investmentNudge: 0, productivityNudge: 0, summary: null }
  });
  record('R4-03', 'Transmission report has sixty layers', report.layers.length === 60, String(report.layers.length));
  record('R4-04', 'Net cycle nudge finite', Number.isFinite(report.netCycleNudge), String(report.netCycleNudge));

  const integrated = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      trade: { termsOfTrade: { band: 'favorable' } },
      economicGeography: { connectivity: { band: 'moderate' } }
    }),
    null,
    null
  );
  record('R4-05', 'State carries transmission report', integrated.state.transmissionReport.layers.length === 60, 'ok');
  record('R4-06', 'Trade summary on state', integrated.state.tradeSpilloverSummary != null, String(integrated.state.tradeSpilloverSummary));

  const stress = computeNationalMacroEconomy(
    makeDefaultV1014_MACRO_TestInputs({
      publicFinance: { pressure: 'critical' },
      trade: { termsOfTrade: { band: 'weak' } }
    }),
    null,
    null
  );
  record(
    'R4-07',
    'Trade/fiscal stress gate',
    stress.state.consistencyGates.some(g => g.id === 'trade_fiscal_stress'),
    stress.state.consistencyGates.map(g => g.id).join(',')
  );

  const harness = runMacroEconomyRegressionHarness({ turns: 12, scenarioId: 'resource_bust' });
  record('R4-08', 'Regression harness passes', harness.allPassed, harness.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'ok');

  record(
    'R4-09',
    'Debrief cites dominant transmission when present',
    integrated.state.debrief.bullets.some(b => b.includes('Dominant transmission') || b.includes('external')),
    integrated.state.debrief.bullets.join('|').slice(0, 60)
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
