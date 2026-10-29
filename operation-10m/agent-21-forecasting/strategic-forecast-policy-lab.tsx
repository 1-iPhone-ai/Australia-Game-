/**
 * Agent 21 — Strategic Forecasting & Policy Laboratory (Operation 10M)
 * O10M_AGENT21_INTEGRATION_ANCHOR — Agent 25 inlines at this module boundary in `(V9.4) australia-game-with-ai.tsx`.
 *
 * INTEGRATION DEPENDENCIES (canonical V9.4 at assembly): BalancePolicyId, BalancePolicyRow,
 * runBalancePolicyMatrix, createWorkforceFixture, computeNationalWorkforce, simulateWorkforceWhatIf,
 * createSystemicRiskFixture, runSystemicStressTest, StrategicStressTest, fnv1aHashString (optional — ag21FingerprintSnapshot re-exported),
 * V9SelfTestResult, React, useState, useMemo.
 */
import React, { useMemo, useState } from 'react';
import { runAg21CounterfactualFork } from './counterfactual-experiments';
import { AG21_FORECAST_SCENARIO_CATALOG, lookupAg21Scenario } from './scenario-catalog';
import {
  O10M_AGENT21_MODULE_ID,
  O10M_AGENT21_MODULE_VERSION,
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21Provenance,
  ag21VerifyIsolatedExperiment,
  type Ag21ForecastProvenance,
  type Ag21UncertaintyBand,
  type Ag21UncertaintyLabel
} from './isolation-core';
export {
  O10M_AGENT21_MODULE_ID,
  O10M_AGENT21_MODULE_VERSION,
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21Provenance,
  ag21VerifyIsolatedExperiment,
  type Ag21ForecastProvenance,
  type Ag21UncertaintyBand,
  type Ag21UncertaintyLabel
} from './isolation-core';
export { AG21_FORECAST_SCENARIO_CATALOG, lookupAg21Scenario } from './scenario-catalog';

export interface Ag21ForecastHorizon { turns: number; uncertainty: Ag21UncertaintyBand; summary: string; metrics: Record<string, number | string>; }

export interface Ag21PolicyExperimentResult {
  id: string; label: string; domain: string; horizons: Ag21ForecastHorizon[]; uncertainty: Ag21UncertaintyLabel; provenance: Ag21ForecastProvenance; notes: string[];
}

export interface Ag21ForecastContext {
  turn: number; seed: number; actorCash: number; actorDebt: number; regionsControlled: number;
  balancePolicies?: BalancePolicyId[]; stressScenarioCount?: number; workforceScenario?: Parameters<typeof simulateWorkforceWhatIf>[1];
  nationalPriorityMomentum?: 'stable' | 'rising' | 'falling';
}

export function createDefaultAg21ForecastContext(o: Partial<Ag21ForecastContext> = {}): Ag21ForecastContext {
  return { turn: 1, seed: 1, actorCash: 1000, actorDebt: 0, regionsControlled: 0, balancePolicies: ['balanced', 'region_rush'], stressScenarioCount: 1, workforceScenario: 'major_education_push', nationalPriorityMomentum: 'stable', ...o };
}


export function runAg21BalancePolicyExperiment(ctx: Ag21ForecastContext, policies: BalancePolicyId[]): Ag21PolicyExperimentResult {
  const subject = createDefaultAg21ForecastContext(ctx);
  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    return runBalancePolicyMatrix(policies, [copy.seed, copy.seed + 1, copy.seed + 2], { winCondition: 'money', seed: copy.seed, startingMoney: copy.actorCash, days: 20 });
  });
  const rows = (iso.result || []) as BalancePolicyRow[];
  const spread = rows.length ? Math.max(...rows.map(r => r.winRate)) - Math.min(...rows.map(r => r.winRate)) : 0;
  const band: Ag21UncertaintyBand = policies.length > 3 ? 'high' : spread > 0.35 ? 'moderate' : 'low';
  const uncertainty = ag21LabelUncertainty(band, [`policy_count=${policies.length}`, `win_rate_spread=${spread.toFixed(2)}`]);
  return {
    id: 'ag21_balance_policy', label: 'Balance policy matrix (lab)', domain: 'balance',
    horizons: [{ turns: 20, uncertainty: band, summary: rows.map(r => `${r.policy}:${Math.round(r.winRate * 100)}%`).join(' · ') || 'no rows', metrics: { policies: policies.length, spread } }],
    uncertainty, notes: ['Uses V9.1 balance lab simulator only; never touches live reducer state.'],
    provenance: ag21Provenance(iso.before, iso.after, 'policy_experiment', ['V9.1 Balance Lab', 'runBalancePolicyMatrix'])
  };
}

export function runAg21WorkforcePolicyExperiment(ctx: Ag21ForecastContext): Ag21PolicyExperimentResult {
  const wfInputs = createWorkforceFixture();
  const workforce = computeNationalWorkforce(wfInputs, null).state;
  const subject = { ctx: createDefaultAg21ForecastContext(ctx), workforce };
  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    return simulateWorkforceWhatIf(copy.workforce, copy.ctx.workforceScenario || 'major_education_push');
  });
  const wi = iso.result as ReturnType<typeof simulateWorkforceWhatIf> | null;
  const band: Ag21UncertaintyBand = wi ? 'moderate' : 'high';
  const uncertainty = ag21LabelUncertainty(band, wi ? [wi.scenarioLabel] : ['missing_workforce_fixture']);
  return {
    id: 'ag21_workforce', label: 'Workforce what-if', domain: 'workforce',
    horizons: [{ turns: 8, uncertainty: band, summary: wi?.summary || 'Fixture unavailable — uncertainty elevated.', metrics: { pressure: wi?.projectedPressureBand || 'unknown' } }],
    uncertainty, notes: ['Pure simulateWorkforceWhatIf on cloned fixture state.'],
    provenance: ag21Provenance(iso.before, iso.after, 'policy_experiment', ['V10.10 Workforce', 'simulateWorkforceWhatIf'])
  };
}

export function runAg21ResilienceStressExperiment(ctx: Ag21ForecastContext): Ag21PolicyExperimentResult {
  const subject = createDefaultAg21ForecastContext(ctx);
  const iso = ag21VerifyIsolatedExperiment(subject, () => {
    try {
      const f = createSystemicRiskFixture({});
      return runSystemicStressTest(f.inputs, [{ kind: 'largest_supplier' }], f.ctx);
    } catch { return null; }
  });
  const st = iso.result as StrategicStressTest | null;
  const band: Ag21UncertaintyBand = st?.uncertainty || 'high';
  const uncertainty = ag21LabelUncertainty(band === 'low' ? 'low' : band === 'moderate' ? 'moderate' : 'high', st ? [st.label] : ['stress_fixture_failed']);
  return {
    id: 'ag21_resilience', label: 'Systemic stress projection', domain: 'resilience',
    horizons: [{ turns: 6, uncertainty: uncertainty.band, summary: st?.result || 'Stress test unavailable.', metrics: { outcome: st?.outcome || 'n/a', chainNodes: st?.projectedChain?.length || 0 } }],
    uncertainty, notes: ['V10.6 runSystemicStressTest — read-only inputs.'],
    provenance: ag21Provenance(iso.before, iso.after, 'stress_scenario', ['V10.6 Systemic Risk', 'runSystemicStressTest'])
  };
}

export interface Ag21ForecastBundle { generatedAtTurn: number; experiments: Ag21PolicyExperimentResult[]; overallUncertainty: Ag21UncertaintyLabel; authoritativeMutationDetected: boolean; }

export function runAg21StrategicForecastBundle(ctx: Ag21ForecastContext): Ag21ForecastBundle {
  const base = createDefaultAg21ForecastContext(ctx);
  const before = ag21FingerprintSnapshot(base);
  const experiments = [
    runAg21BalancePolicyExperiment(base, base.balancePolicies || ['balanced']),
    runAg21WorkforcePolicyExperiment(base),
    runAg21ResilienceStressExperiment(base),
    runAg21CounterfactualPolicyExperiment(base)
  ];
  const after = ag21FingerprintSnapshot(base);
  const bands = experiments.map(e => e.uncertainty.band);
  const overallBand: Ag21UncertaintyBand = bands.includes('speculative') ? 'speculative' : bands.includes('high') ? 'high' : bands.includes('moderate') ? 'moderate' : 'low';
  return {
    generatedAtTurn: base.turn,
    experiments,
    overallUncertainty: ag21LabelUncertainty(overallBand, [`experiments=${experiments.length}`]),
    authoritativeMutationDetected: before !== after
  };
}

export function runAg21CounterfactualPolicyExperiment(ctx: Ag21ForecastContext): Ag21PolicyExperimentResult {
  const subject = createDefaultAg21ForecastContext(ctx);
  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    const fork = runAg21CounterfactualFork(copy, [
      { id: 'ag21_cf_debt_relief', label: 'Debt relief counterfactual', apply: c => { c.actorDebt = Math.max(0, c.actorDebt - 250); } },
      { id: 'ag21_cf_region_surge', label: 'Region surge counterfactual', apply: c => { c.regionsControlled += 1; c.actorCash -= 150; } },
      { id: 'ag21_cf_cash_buffer', label: 'Liquidity buffer counterfactual', apply: c => { c.actorCash += 400; } }
    ]);
    return fork;
  });
  const fork = iso.result as ReturnType<typeof runAg21CounterfactualFork> | null;
  const band: Ag21UncertaintyBand = fork?.overallUncertainty.band || 'high';
  const summary = fork?.branches.map(b => `${b.id}:${b.deltaFromBaseline}`).join(' · ') || 'counterfactual unavailable';
  return {
    id: 'ag21_counterfactual_policy',
    label: 'Counterfactual policy fork matrix',
    domain: 'counterfactual',
    horizons: [{ turns: 4, uncertainty: band, summary, metrics: { branches: fork?.branches.length ?? 0 } }],
    uncertainty: ag21LabelUncertainty(band, [`branches=${fork?.branches.length ?? 0}`]),
    notes: ['Fork matrix mutates isolated copies only; canonical match fingerprint unchanged.'],
    provenance: ag21Provenance(iso.before, iso.after, 'counterfactual_fork', ['Agent21 Counterfactual Lab', 'runAg21CounterfactualFork'])
  };
}


export function runAg21StrategicForecastSelfTests(): V9SelfTestResult[] {
  const results: V9SelfTestResult[] = [];
  const check = (id: string, name: string, fn: () => boolean | string) => {
    try { const out = fn(); results.push({ id, name, passed: out === true, detail: out === true ? 'ok' : String(out || 'failed') }); }
    catch (e) { results.push({ id, name, passed: false, detail: e instanceof Error ? e.message : String(e) }); }
  };
  const J = (v: unknown) => JSON.stringify(v);

  check('ag21_no_mutation_bundle', 'Forecast bundle does not mutate context fingerprint', () => {
    const ctx = createDefaultAg21ForecastContext({ seed: 42, turn: 5 }); const before = ag21FingerprintSnapshot(ctx); const b = runAg21StrategicForecastBundle(ctx); return before === ag21FingerprintSnapshot(ctx) && !b.authoritativeMutationDetected || J(b);
  });
  check('ag21_provenance_flag', 'Every experiment marks authoritative:false', () => {
    const b = runAg21StrategicForecastBundle(createDefaultAg21ForecastContext({ seed: 3 })); return b.experiments.every(e => e.provenance.authoritative === false && e.provenance.isolatedCopyVerified) || J(b.experiments);
  });
  check('ag21_uncertainty_labels', 'Uncertainty copy always mentions non-authoritative', () => {
    const u = ag21LabelUncertainty('high', ['test']); return u.playerFacing.includes('Non-authoritative') && u.headline.length > 3;
  });
  check('ag21_balance_iso', 'Balance policy experiment isolates subject', () => {
    const r = runAg21BalancePolicyExperiment(createDefaultAg21ForecastContext({ seed: 9 }), ['balanced', 'cash_hoard']); return r.provenance.isolatedCopyVerified && r.uncertainty.band !== 'speculative' || J(r);
  });
  check('ag21_counterfactual_iso', 'Counterfactual experiment keeps context fingerprint', () => {
    const ctx = createDefaultAg21ForecastContext({ seed: 12 }); const before = ag21FingerprintSnapshot(ctx); const r = runAg21CounterfactualPolicyExperiment(ctx); return before === ag21FingerprintSnapshot(ctx) && r.provenance.isolatedCopyVerified || J(r);
  });
  check('ag21_catalog_size', 'Scenario catalog is populated for Division E', () => AG21_FORECAST_SCENARIO_CATALOG.length >= 100);
  check('ag21_lookup', 'Scenario lookup returns narrative', () => Boolean(lookupAg21Scenario('ag21_sc_000')?.narrative));
  check('ag21_determinism', 'Identical seeds → identical bundle summaries', () => {
    const a = runAg21StrategicForecastBundle(createDefaultAg21ForecastContext({ seed: 77 }));
    const b = runAg21StrategicForecastBundle(createDefaultAg21ForecastContext({ seed: 77 }));
    return J(a.experiments.map(e => e.horizons[0]?.summary)) === J(b.experiments.map(e => e.horizons[0]?.summary));
  });
  check('ag21_catalog_08', 'Catalog entry ag21_sc_008 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_008'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_09', 'Catalog entry ag21_sc_009 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_009'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_10', 'Catalog entry ag21_sc_010 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_010'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_11', 'Catalog entry ag21_sc_011 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_011'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_12', 'Catalog entry ag21_sc_012 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_012'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_13', 'Catalog entry ag21_sc_013 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_013'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_14', 'Catalog entry ag21_sc_014 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_014'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_15', 'Catalog entry ag21_sc_015 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_015'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_16', 'Catalog entry ag21_sc_016 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_016'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_17', 'Catalog entry ag21_sc_017 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_017'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_18', 'Catalog entry ag21_sc_018 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_018'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_19', 'Catalog entry ag21_sc_019 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_019'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_20', 'Catalog entry ag21_sc_020 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_020'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_21', 'Catalog entry ag21_sc_021 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_021'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_22', 'Catalog entry ag21_sc_022 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_022'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_23', 'Catalog entry ag21_sc_023 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_023'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_24', 'Catalog entry ag21_sc_024 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_024'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_25', 'Catalog entry ag21_sc_025 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_025'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_26', 'Catalog entry ag21_sc_026 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_026'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_27', 'Catalog entry ag21_sc_027 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_027'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_28', 'Catalog entry ag21_sc_028 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_028'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_29', 'Catalog entry ag21_sc_029 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_029'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_30', 'Catalog entry ag21_sc_030 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_030'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_31', 'Catalog entry ag21_sc_031 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_031'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_32', 'Catalog entry ag21_sc_032 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_032'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_33', 'Catalog entry ag21_sc_033 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_033'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_34', 'Catalog entry ag21_sc_034 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_034'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_35', 'Catalog entry ag21_sc_035 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_035'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_36', 'Catalog entry ag21_sc_036 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_036'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_37', 'Catalog entry ag21_sc_037 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_037'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_38', 'Catalog entry ag21_sc_038 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_038'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_39', 'Catalog entry ag21_sc_039 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_039'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_40', 'Catalog entry ag21_sc_040 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_040'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_41', 'Catalog entry ag21_sc_041 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_041'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_42', 'Catalog entry ag21_sc_042 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_042'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_43', 'Catalog entry ag21_sc_043 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_043'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  check('ag21_catalog_44', 'Catalog entry ag21_sc_044 has uncertainty', () => { const s = lookupAg21Scenario('ag21_sc_044'); return Boolean(s && s.defaultUncertainty && s.narrative); });
  return results;
}

export const Ag21StrategicForecastLabStrip: React.FC<{ compact?: boolean }> = ({ compact }) => {
  const [seed, setSeed] = useState(1);
  const bundle = useMemo(() => runAg21StrategicForecastBundle(createDefaultAg21ForecastContext({ seed })), [seed]);
  return (
    <div className="border border-cyan-500/30 rounded-lg p-3 bg-slate-950/80 text-xs space-y-2" data-testid="ag21-forecast-lab">
      <div className="flex items-center justify-between gap-2">
        <div className="font-bold text-cyan-200">📈 Strategic Forecast Lab <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span></div>
        {!compact && <label className="flex items-center gap-1">Seed <input type="number" className="w-16 bg-slate-900 border border-slate-600 rounded px-1" value={seed} onChange={e => setSeed(Number(e.target.value) || 1)} /></label>}
      </div>
      <div className="text-[10px] text-amber-200/90">{bundle.overallUncertainty.playerFacing}</div>
      <div className="space-y-1 max-h-40 overflow-y-auto">
        {bundle.experiments.map(ex => (
          <div key={ex.id} className="p-2 rounded bg-slate-900/60 border border-slate-700/50">
            <div className="font-semibold text-cyan-100">{ex.label} · {ex.uncertainty.headline}</div>
            <div className="opacity-80">{ex.horizons[0]?.summary}</div>
          </div>
        ))}
      </div>
    </div>
  );
};
