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
