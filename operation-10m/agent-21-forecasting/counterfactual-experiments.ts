/**
 * Agent 21 — counterfactual policy forks (read authoritative snapshot once, simulate branches on isolated copies).
 */

import {
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21Provenance,
  ag21VerifyIsolatedExperiment,
  type Ag21ForecastProvenance,
  type Ag21UncertaintyBand,
  type Ag21UncertaintyLabel
} from './isolation-core';

export interface Ag21CounterfactualBranchSpec<TSnapshot> {
  id: string;
  label: string;
  /** Mutates the isolated copy only; never the live snapshot reference. */
  apply: (copy: TSnapshot) => void;
}

export interface Ag21CounterfactualBranchResult {
  id: string;
  label: string;
  fingerprint: string;
  deltaFromBaseline: string;
  uncertainty: Ag21UncertaintyBand;
}

export interface Ag21CounterfactualForkResult<TSnapshot> {
  baselineFingerprint: string;
  branches: Ag21CounterfactualBranchResult[];
  authoritativeMutationDetected: boolean;
  overallUncertainty: Ag21UncertaintyLabel;
  provenance: Ag21ForecastProvenance;
  /** Isolated branch payloads for downstream forecast hooks (never written to canonical state). */
  branchSnapshots: TSnapshot[];
}

export interface Ag21CounterfactualMetricRow {
  branchId: string;
  metric: string;
  baseline: number;
  projected: number;
  delta: number;
}

function ag21DeltaFingerprint(baseline: string, branch: string): string {
  if (baseline === branch) return 'unchanged';
  return `Δ ${baseline.slice(0, 6)}→${branch.slice(0, 6)}`;
}

function ag21BandFromSpread(spread: number, branchCount: number): Ag21UncertaintyBand {
  if (branchCount > 6) return 'high';
  if (spread > 0.45) return 'high';
  if (spread > 0.15) return 'moderate';
  return 'low';
}

/**
 * Run labeled counterfactual branches against a read-only snapshot.
 * Each branch deep-clones the snapshot, applies `apply`, and fingerprints the copy — the subject fingerprint is unchanged.
 */
export function runAg21CounterfactualFork<TSnapshot extends Record<string, unknown>>(
  snapshot: TSnapshot,
  branches: Ag21CounterfactualBranchSpec<TSnapshot>[]
): Ag21CounterfactualForkResult<TSnapshot> {
  const baselineFingerprint = ag21FingerprintSnapshot(snapshot);
  const branchSnapshots: TSnapshot[] = [];
  const branchResults: Ag21CounterfactualBranchResult[] = [];
  let maxSpread = 0;

  for (const spec of branches) {
    const iso = ag21VerifyIsolatedExperiment(snapshot, copy => {
      spec.apply(copy);
      branchSnapshots.push(copy);
      return ag21FingerprintSnapshot(copy);
    });
    const branchFp = String(iso.result ?? '');
    const spread = branchFp === baselineFingerprint ? 0 : 1;
    maxSpread = Math.max(maxSpread, spread);
    branchResults.push({
      id: spec.id,
      label: spec.label,
      fingerprint: branchFp,
      deltaFromBaseline: ag21DeltaFingerprint(baselineFingerprint, branchFp),
      uncertainty: spread ? 'moderate' : 'low'
    });
  }

  const after = ag21FingerprintSnapshot(snapshot);
  const overallBand = ag21BandFromSpread(maxSpread, branches.length);
  const provenance = ag21Provenance(baselineFingerprint, after, 'counterfactual_fork', [
    'Agent21 Counterfactual Lab',
    'runAg21CounterfactualFork'
  ]);

  return {
    baselineFingerprint,
    branches: branchResults,
    authoritativeMutationDetected: baselineFingerprint !== after,
    overallUncertainty: ag21LabelUncertainty(overallBand, [`branches=${branches.length}`]),
    provenance,
    branchSnapshots
  };
}

/** Numeric counterfactual matrix — compares scalar metrics per branch without touching the baseline object. */
export function runAg21CounterfactualMetricMatrix<TSnapshot extends Record<string, unknown>>(
  snapshot: TSnapshot,
  metric: keyof TSnapshot & string,
  branches: Ag21CounterfactualBranchSpec<TSnapshot>[]
): { rows: Ag21CounterfactualMetricRow[]; fork: Ag21CounterfactualForkResult<TSnapshot> } {
  const baselineValue = Number(snapshot[metric] ?? 0);
  const fork = runAg21CounterfactualFork(snapshot, branches);
  const rows: Ag21CounterfactualMetricRow[] = fork.branchSnapshots.map((copy, idx) => {
    const projected = Number(copy[metric] ?? 0);
    return {
      branchId: branches[idx]?.id ?? `branch_${idx}`,
      metric,
      baseline: baselineValue,
      projected,
      delta: projected - baselineValue
    };
  });
  return { rows, fork };
}

export function runAg21CounterfactualSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const results: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => results.push({ id, passed, detail });

  const snapshot = { turn: 4, seed: 11, actorCash: 500, actorDebt: 120, regionsControlled: 2 };
  const before = ag21FingerprintSnapshot(snapshot);
  const fork = runAg21CounterfactualFork(snapshot, [
    { id: 'fiscal_austerity', label: 'Austerity fork', apply: c => { c.actorCash = (c.actorCash ?? 0) - 50; } },
    { id: 'expansion_push', label: 'Expansion fork', apply: c => { c.regionsControlled = (c.regionsControlled ?? 0) + 1; } }
  ]);
  push(
    'cf_no_authoritative_mutation',
    before === ag21FingerprintSnapshot(snapshot) && !fork.authoritativeMutationDetected,
    `before=${before} after=${ag21FingerprintSnapshot(snapshot)}`
  );
  push(
    'cf_provenance_non_authoritative',
    fork.provenance.authoritative === false && fork.provenance.isolatedCopyVerified,
    fork.provenance.label
  );
  push('cf_branch_count', fork.branches.length === 2, String(fork.branches.length));
  push(
    'cf_metric_matrix',
    runAg21CounterfactualMetricMatrix(snapshot, 'actorCash', [
      { id: 'spend', label: 'Spend', apply: c => { c.actorCash = (c.actorCash ?? 0) - 100; } }
    ]).rows[0]?.delta === -100,
    'actorCash delta'
  );
  push(
    'cf_uncertainty_copy',
    fork.overallUncertainty.playerFacing.includes('Non-authoritative'),
    fork.overallUncertainty.playerFacing.slice(0, 40)
  );

  return results;
}
