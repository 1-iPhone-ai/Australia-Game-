import { reconcileAccountingLedger } from './ledger.ts';
import { validateNationalMacroEconomyState } from './validate-state.ts';
import { computeNationalMacroEconomy } from '../compute.ts';
import { makeDefaultV1014_MACRO_TestInputs } from '../inputs.ts';
import { v1014macroNormalizeRegionalShares } from '../regional-aggregation.ts';
import type { MacroSelfTestResult } from '../types.ts';

export function runAccountingReconciliationSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: MacroSelfTestResult[];
} {
  const results: MacroSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    const recon = reconcileAccountingLedger(r.state.accounting);
    record('AR01', 'Baseline ledger reconciles', recon.ok, recon.issues.join('; ') || 'ok');
  }

  {
    const r = computeNationalMacroEconomy(
      makeDefaultV1014_MACRO_TestInputs({ creditShockActive: true, highInflationScenarioActive: true }),
      null,
      null
    );
    const recon = reconcileAccountingLedger(r.state.accounting);
    const valid = validateNationalMacroEconomyState(r.state);
    record(
      'AR02',
      'Shock scenario reconciles + validates',
      recon.ok && valid.valid,
      [...recon.issues, ...valid.issues].join('; ') || 'ok'
    );
  }

  {
    const shares = v1014macroNormalizeRegionalShares([
      { regionId: 'NSW', weight: 0 },
      { regionId: 'VIC', weight: 0 }
    ]);
    const sum = Object.values(shares).reduce((a, b) => a + b, 0);
    record('AR03', 'Zero-weight fallback shares sum to 1', Math.abs(sum - 1) < 1e-5, `sum=${sum}`);
  }

  {
    const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs(), null, null);
    record(
      'AR04',
      'Gross output within 0..100',
      r.state.accounting.grossOutputIndex >= 0 && r.state.accounting.grossOutputIndex <= 100,
      String(r.state.accounting.grossOutputIndex)
    );
  }

  {
    let p = null;
    let prev = null;
    for (let t = 1; t <= 12; t++) {
      const r = computeNationalMacroEconomy(makeDefaultV1014_MACRO_TestInputs({ turn: t }), p, prev);
      const recon = reconcileAccountingLedger(r.state.accounting);
      if (!recon.ok) {
        record('AR05', `Multi-turn reconcile turn ${t}`, false, recon.issues.join('; '));
        break;
      }
      p = r.persisted;
      prev = r.state;
      if (t === 12) record('AR05', 'Multi-turn reconcile 12 turns', true, 'ok');
    }
  }

  {
    const r = computeNationalMacroEconomy(
      makeDefaultV1014_MACRO_TestInputs({
        livingRegions: {
          regions: {
            NSW: { economy: { score: 90 }, momentum: { band: 'surging' }, development: { score: 80 } },
            VIC: { economy: { score: 40 }, momentum: { band: 'declining' }, development: { score: 30 } }
          }
        }
      }),
      null,
      null
    );
    const sum = r.state.regionalContributions.reduce((a, x) => a + x.share, 0);
    record('AR06', 'Skewed regional inputs preserve share identity', Math.abs(sum - 1) < 1e-5, `sum=${sum}`);
  }

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
