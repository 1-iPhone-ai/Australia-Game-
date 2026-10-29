import { BUSINESS_CYCLE_LABEL, V1014_MACRO_INVESTMENT_LABEL, V1014_MACRO_PRODUCTIVITY_LABEL } from './constants.ts';
import { computeNationalMacroEconomy } from './compute.ts';
import { makeDefaultV1014_MACRO_TestInputs } from './inputs.ts';
import { createInitialMacroEconomyPersisted, macroEconomyInputHash, sanitizeMacroEconomyPersisted } from './persisted.ts';
import { sumRegionalShares } from './regional-aggregation.ts';
import { V1014_MACRO_SCHEMA_VERSION } from './types.ts';
import { runAccountingReconciliationSelfTests } from './accounting/reconciliation-tests.ts';
import { runRegionalReconciliationSelfTests } from './accounting/regional-reconciliation.ts';
import { runCyclicalShockLibrarySelfTests } from './catalog/cyclical-shocks-self-tests.ts';
import { runAgent06DepthSelfTests } from './depth-self-tests.ts';
import { runAgent06Round2SelfTests } from './round2-self-tests.ts';
import { runAgent06Round3SelfTests } from './round3-self-tests.ts';
import { runAgent06Round4SelfTests } from './round4-self-tests.ts';
import { runAgent06Round5SelfTests } from './round5-self-tests.ts';
import { runAgent06Round6SelfTests } from './round6-self-tests.ts';
import { runAgent06Round7SelfTests } from './round7-self-tests.ts';
import { runAgent06Round8SelfTests } from './round8-self-tests.ts';
import { runAgent06Round9SelfTests } from './round9-self-tests.ts';
import { runAgent06Round10SelfTests } from './round10-self-tests.ts';
import { runAgent06Round11SelfTests } from './round11-self-tests.ts';
import { runAgent06Round12SelfTests } from './round12-self-tests.ts';
import { runAgent06Round13SelfTests } from './round13-self-tests.ts';
import { runAgent06Round14SelfTests } from './round14-self-tests.ts';
import { runAgent06Round15SelfTests } from './round15-self-tests.ts';
import { runAgent06Round16SelfTests } from './round16-self-tests.ts';
import { runAgent06Round17SelfTests } from './round17-self-tests.ts';
import { runAgent06Round18SelfTests } from './round18-self-tests.ts';
import { runAgent06Round19SelfTests } from './round19-self-tests.ts';
import { runAgent06Round20SelfTests } from './round20-self-tests.ts';
import { runAgent06Round21SelfTests } from './round21-self-tests.ts';
import { runAgent06Round22SelfTests } from './round22-self-tests.ts';
import { runAgent06Round23SelfTests } from './round23-self-tests.ts';
import { runAgent06Round24SelfTests } from './round24-self-tests.ts';
import { runAgent06Round25SelfTests } from './round25-self-tests.ts';
import { runAgent06Round26SelfTests } from './round26-self-tests.ts';
import { runAgent06Round27SelfTests } from './round27-self-tests.ts';
import { runAgent06Round28SelfTests } from './round28-self-tests.ts';
import { runAgent06Round29SelfTests } from './round29-self-tests.ts';
import { runAgent06Round30SelfTests } from './round30-self-tests.ts';
import { runAgent06Round31SelfTests } from './round31-self-tests.ts';
import { runAgent06Round32SelfTests } from './round32-self-tests.ts';
import { runAgent06Round33SelfTests } from './round33-self-tests.ts';
import { runAgent06Round34SelfTests } from './round34-self-tests.ts';
import { runAgent06Round35SelfTests } from './round35-self-tests.ts';
import { runAgent06Round36SelfTests } from './round36-self-tests.ts';
import { runAgent06Round37SelfTests } from './round37-self-tests.ts';
import { runAgent06Round38SelfTests } from './round38-self-tests.ts';
import { runAgent06Round39SelfTests } from './round39-self-tests.ts';
import { runAgent06Round40SelfTests } from './round40-self-tests.ts';
import { runAgent06Round41SelfTests } from './round41-self-tests.ts';
import { runAgent06Round42SelfTests } from './round42-self-tests.ts';
import { runAgent06Round43SelfTests } from './round43-self-tests.ts';
import { runAgent06Round44SelfTests } from './round44-self-tests.ts';
import { runAgent06Round45SelfTests } from './round45-self-tests.ts';
import { runAgent06Round46SelfTests } from './round46-self-tests.ts';
import { runAgent06Round47SelfTests } from './round47-self-tests.ts';
import { runAgent06Round48SelfTests } from './round48-self-tests.ts';
import { runAgent06Round49SelfTests } from './round49-self-tests.ts';
import { runAgent06Round50SelfTests } from './round50-self-tests.ts';
import { runAgent06Round51SelfTests } from './round51-self-tests.ts';
import { runAgent06Round52SelfTests } from './round52-self-tests.ts';
import { runAgent06Round53SelfTests } from './round53-self-tests.ts';
import { runAgent06Round54SelfTests } from './round54-self-tests.ts';
import { runAgent06Round55SelfTests } from './round55-self-tests.ts';
import { runAgent06Round56SelfTests } from './round56-self-tests.ts';

export function runV1014_MACRO_MacroEconomySelfTests(): {
  passed: number;
  failed: number;
  total: number;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const check = (id: string, name: string, ok: boolean, detail = 'ok') =>
    results.push({ id, name, passed: ok, detail: ok ? 'ok' : detail });

  check(
    'v1014_t01',
    'TEST 01 — INIT',
    createInitialMacroEconomyPersisted().schemaVersion === V1014_MACRO_SCHEMA_VERSION
  );
  check(
    'v1014_t02',
    'TEST 02 — SANITIZE',
    sanitizeMacroEconomyPersisted({ cycleHysteresis: 'bogus', revision: -1 }, 3).cycleHysteresis === 'expansion'
  );
  {
    const a = macroEconomyInputHash(makeDefaultV1014_MACRO_TestInputs());
    const b = macroEconomyInputHash(makeDefaultV1014_MACRO_TestInputs());
    check('v1014_t03', 'TEST 03 — HASH', a === b && a.length > 10);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    const sum = sumRegionalShares(r.state.regionalContributions);
    check('v1014_t04', 'TEST 04 — SHARES', Math.abs(sum - 1) < 1e-5, `sum=${sum}`);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    check('v1014_t05', 'TEST 05 — IDENTITY', r.state.accounting.identityOk);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    check('v1014_t06', 'TEST 06 — CYCLE', BUSINESS_CYCLE_LABEL[r.state.cyclePhase] != null);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ turn: 8 }), null, null);
    check(
      'v1014_t07',
      'TEST 07 — PRODUCTIVITY',
      r.state.productivityIndex >= 0 && r.state.productivityIndex <= 100
    );
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    check('v1014_t08', 'TEST 08 — INVESTMENT', V1014_MACRO_INVESTMENT_LABEL[r.state.investmentClimate] != null);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ highInflationScenarioActive: true }), null, null);
    check('v1014_t09', 'TEST 09 — INFLATION', r.state.productivityIndex <= 100);
  }
  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ creditShockActive: true }), null, null);
    check('v1014_t10', 'TEST 10 — CREDIT', r.state.grossInvestmentIndex <= 100);
  }

  const regions = ['NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'NT', 'ACT'] as const;
  for (let i = 0; i < 40; i++) {
    const turn = 11 + i;
    const region = regions[i % regions.length];
    const inp = makeDefaultV1014_MACRO_TestInputs({ turn });
    const r = computeNationalMacroEconomy(inp, null, null);
    const row = r.state.regionalContributions.find(x => x.regionId === region);
    check(
      `v1014_t${11 + i}`,
      `TEST ${11 + i} — REG_${region}`,
      Boolean(row && row.share > 0),
      `missing ${region}`
    );
  }

  const recon = runAccountingReconciliationSelfTests();
  for (const r of recon.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const regional = runRegionalReconciliationSelfTests();
  for (const r of regional.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const shocks = runCyclicalShockLibrarySelfTests();
  for (const r of shocks.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const depth = runAgent06DepthSelfTests();
  for (const r of depth.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round2 = runAgent06Round2SelfTests();
  for (const r of round2.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round3 = runAgent06Round3SelfTests();
  for (const r of round3.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round4 = runAgent06Round4SelfTests();
  for (const r of round4.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round5 = runAgent06Round5SelfTests();
  for (const r of round5.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round6 = runAgent06Round6SelfTests();
  for (const r of round6.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round7 = runAgent06Round7SelfTests();
  for (const r of round7.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round8 = runAgent06Round8SelfTests();
  for (const r of round8.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round9 = runAgent06Round9SelfTests();
  for (const r of round9.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round10 = runAgent06Round10SelfTests();
  for (const r of round10.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round11 = runAgent06Round11SelfTests();
  for (const r of round11.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round12 = runAgent06Round12SelfTests();
  for (const r of round12.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round13 = runAgent06Round13SelfTests();
  for (const r of round13.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round14 = runAgent06Round14SelfTests();
  for (const r of round14.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round15 = runAgent06Round15SelfTests();
  for (const r of round15.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round16 = runAgent06Round16SelfTests();
  for (const r of round16.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round17 = runAgent06Round17SelfTests();
  for (const r of round17.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round18 = runAgent06Round18SelfTests();
  for (const r of round18.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round19 = runAgent06Round19SelfTests();
  for (const r of round19.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round20 = runAgent06Round20SelfTests();
  for (const r of round20.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round21 = runAgent06Round21SelfTests();
  for (const r of round21.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round22 = runAgent06Round22SelfTests();
  for (const r of round22.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round23 = runAgent06Round23SelfTests();
  for (const r of round23.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round24 = runAgent06Round24SelfTests();
  for (const r of round24.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round25 = runAgent06Round25SelfTests();
  for (const r of round25.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round26 = runAgent06Round26SelfTests();
  for (const r of round26.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round27 = runAgent06Round27SelfTests();
  for (const r of round27.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round28 = runAgent06Round28SelfTests();
  for (const r of round28.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round29 = runAgent06Round29SelfTests();
  for (const r of round29.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round30 = runAgent06Round30SelfTests();
  for (const r of round30.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round31 = runAgent06Round31SelfTests();
  for (const r of round31.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round32 = runAgent06Round32SelfTests();
  for (const r of round32.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round33 = runAgent06Round33SelfTests();
  for (const r of round33.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round34 = runAgent06Round34SelfTests();
  for (const r of round34.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round35 = runAgent06Round35SelfTests();
  for (const r of round35.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round36 = runAgent06Round36SelfTests();
  for (const r of round36.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round37 = runAgent06Round37SelfTests();
  for (const r of round37.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round38 = runAgent06Round38SelfTests();
  for (const r of round38.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round39 = runAgent06Round39SelfTests();
  for (const r of round39.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round40 = runAgent06Round40SelfTests();
  for (const r of round40.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round41 = runAgent06Round41SelfTests();
  for (const r of round41.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round42 = runAgent06Round42SelfTests();
  for (const r of round42.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round43 = runAgent06Round43SelfTests();
  for (const r of round43.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round44 = runAgent06Round44SelfTests();
  for (const r of round44.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round45 = runAgent06Round45SelfTests();
  for (const r of round45.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round46 = runAgent06Round46SelfTests();
  for (const r of round46.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round47 = runAgent06Round47SelfTests();
  for (const r of round47.results) {
    check(r.id, r.name, r.passed, r.detail);
  }
  const round48 = runAgent06Round48SelfTests();
  for (const r of round48.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round49 = runAgent06Round49SelfTests();
  for (const r of round49.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round50 = runAgent06Round50SelfTests();
  for (const r of round50.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round51 = runAgent06Round51SelfTests();
  for (const r of round51.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round52 = runAgent06Round52SelfTests();
  for (const r of round52.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round53 = runAgent06Round53SelfTests();
  for (const r of round53.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round54 = runAgent06Round54SelfTests();
  for (const r of round54.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round55 = runAgent06Round55SelfTests();
  for (const r of round55.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const round56 = runAgent06Round56SelfTests();
  for (const r of round56.results) {
    check(r.id, r.name, r.passed, r.detail);
  }

  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, total: results.length, results };
}

export function runAgent06AllSelfTests(): {
  passed: number;
  failed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const macro = runV1014_MACRO_MacroEconomySelfTests();
  return {
    ...macro,
    allPassed: macro.failed === 0
  };
}
