// OP10M_MODULE_BEGIN agent-21-forecasting
// Operation 10M — Agent 21 forecasting / policy laboratory (bundled for Agent 25 assembly).
// O10M_AGENT21_INTEGRATION_ANCHOR — replaces inline SECTION 20AQ on merge.
// Regenerate: npm run bundle:agent-21-chunk
// --- bundled from isolation-core.ts ---
/**
 * Agent 21 — isolation primitives for forecast / policy lab work.
 * Counterfactual and policy experiments MUST run on deep copies; authoritative snapshots stay read-only.
 */

export type Ag21UncertaintyBand = 'low' | 'moderate' | 'high' | 'speculative';

export interface Ag21ForecastProvenance {
  authoritative: false;
  label: 'projection' | 'policy_experiment' | 'stress_scenario' | 'counterfactual_fork';
  sourceSystems: string[];
  isolatedCopyVerified: boolean;
  fingerprintBefore: string;
  fingerprintAfter: string;
  disclaimer: string;
}

export interface Ag21UncertaintyLabel {
  band: Ag21UncertaintyBand;
  headline: string;
  factors: string[];
  playerFacing: string;
}

const AG21_UNCERTAINTY_COPY: Record<Ag21UncertaintyBand, { headline: string; disclaimer: string }> = {
  low: { headline: 'Low uncertainty', disclaimer: 'Grounded in observable canonical state with a single forward path.' },
  moderate: { headline: 'Moderate uncertainty', disclaimer: 'Uses partial observability or stable heuristics; treat as directional.' },
  high: { headline: 'High uncertainty', disclaimer: 'Multiple branches or weak signals; ranges are illustrative only.' },
  speculative: { headline: 'Speculative', disclaimer: 'Hypothesis-only; not calibrated to live mechanics and must not drive auto-actions.' }
};

export function ag21LabelUncertainty(band: Ag21UncertaintyBand, factors: string[] = []): Ag21UncertaintyLabel {
  const base = AG21_UNCERTAINTY_COPY[band];
  const factorLine = factors.length ? ` Drivers: ${factors.slice(0, 4).join('; ')}.` : '';
  return {
    band,
    headline: base.headline,
    factors: factors.slice(0, 8),
    playerFacing: `${base.disclaimer}${factorLine} (Non-authoritative forecast.)`
  };
}

/** Matches canonical `fnv1aHashString` in V9.4 for fingerprint parity after assembly. */
export function ag21Fnv1aHashString(input: string): string {
  let hash = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0).toString(36);
}

export function ag21FingerprintSnapshot(value: unknown): string {
  try {
    return ag21Fnv1aHashString(JSON.stringify(value));
  } catch {
    return ag21Fnv1aHashString(String(value));
  }
}

function ag21DeepClone<T>(value: T): T {
  if (typeof structuredClone === 'function') {
    try {
      return structuredClone(value);
    } catch {
      /* fall through */
    }
  }
  return JSON.parse(JSON.stringify(value)) as T;
}

export function ag21VerifyIsolatedExperiment<T>(
  subject: T,
  mutateCopy: (copy: T) => unknown
): { ok: boolean; before: string; after: string; result: unknown } {
  const before = ag21FingerprintSnapshot(subject);
  const copy = ag21DeepClone(subject);
  const result = mutateCopy(copy);
  const after = ag21FingerprintSnapshot(subject);
  return { ok: before === after, before, after, result };
}

export function ag21Provenance(
  before: string,
  after: string,
  label: Ag21ForecastProvenance['label'],
  systems: string[]
): Ag21ForecastProvenance {
  return {
    authoritative: false,
    label,
    sourceSystems: systems,
    isolatedCopyVerified: before === after,
    fingerprintBefore: before,
    fingerprintAfter: after,
    disclaimer: 'This output is a non-authoritative projection. Canonical match state is unchanged.'
  };
}

export const O10M_AGENT21_MODULE_VERSION = '1.2.0';
export const O10M_AGENT21_MODULE_ID = 'forecasting_policy_lab';

// --- bundled from counterfactual-experiments.ts ---
/**
 * Agent 21 — counterfactual policy forks (read authoritative snapshot once, simulate branches on isolated copies).
 */


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

// --- bundled from forecast-evaluation-metrics.ts ---
/**
 * Agent 21 — forecast evaluation metrics (read-only analytics on lab outputs).
 */


const AG21_UNCERTAINTY_RANK: Record<Ag21UncertaintyBand, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  speculative: 3
};

export interface Ag21ForecastEvaluationInput {
  scenarioIds: string[];
  scenarios: Ag21ForecastScenarioEntry[];
  experimentCount: number;
  overallUncertainty: Ag21UncertaintyBand;
  authoritativeMutationDetected: boolean;
  isolatedCopyVerifiedRatio: number;
}

export interface Ag21ForecastEvaluationMetrics {
  coverageScore: number;
  uncertaintyAlignmentScore: number;
  isolationIntegrityScore: number;
  domainDiversityScore: number;
  compositeScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  notes: string[];
  authoritative: false;
}

export interface Ag21ScenarioComparisonRow {
  leftId: string;
  rightId: string;
  sameDomain: boolean;
  uncertaintyDelta: number;
  titleSimilarity: number;
  recommendation: 'comparable' | 'caution' | 'incompatible';
  summary: string;
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function tokenOverlap(a: string, b: string): number {
  const ta = new Set(a.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  const tb = new Set(b.toLowerCase().split(/[^a-z0-9]+/).filter(Boolean));
  if (!ta.size || !tb.size) return 0;
  let shared = 0;
  for (const t of ta) if (tb.has(t)) shared++;
  return shared / Math.max(ta.size, tb.size);
}

function gradeFromComposite(score: number): Ag21ForecastEvaluationMetrics['grade'] {
  if (score >= 0.9) return 'A';
  if (score >= 0.75) return 'B';
  if (score >= 0.6) return 'C';
  if (score >= 0.45) return 'D';
  return 'F';
}

/** Score how well a forecast lab run covers scenarios and maintains isolation. */
export function evaluateAg21ForecastRun(input: Ag21ForecastEvaluationInput): Ag21ForecastEvaluationMetrics {
  const notes: string[] = [];
  const requested = input.scenarioIds.length;
  const resolved = input.scenarios.length;
  const coverageScore = requested ? clamp01(resolved / requested) : 0;
  if (coverageScore < 1) notes.push(`Resolved ${resolved}/${requested} scenario ids.`);

  const bands = input.scenarios.map(s => s.defaultUncertainty);
  const avgBand = bands.length
    ? bands.reduce((sum, b) => sum + AG21_UNCERTAINTY_RANK[b], 0) / bands.length
    : AG21_UNCERTAINTY_RANK[input.overallUncertainty];
  const runBand = AG21_UNCERTAINTY_RANK[input.overallUncertainty];
  const uncertaintyAlignmentScore = clamp01(1 - Math.abs(avgBand - runBand) / 3);

  let isolationIntegrityScore = clamp01(input.isolatedCopyVerifiedRatio);
  if (input.authoritativeMutationDetected) {
    isolationIntegrityScore = 0;
    notes.push('Authoritative mutation detected — evaluation forced to zero isolation score.');
  }

  const domains = new Set(input.scenarios.map(s => s.domain));
  const domainDiversityScore = clamp01(domains.size / Math.max(1, Math.min(5, input.scenarios.length)));
  const experimentCoverage = clamp01(input.experimentCount / 4);

  const compositeScore = clamp01(
    coverageScore * 0.25 +
      uncertaintyAlignmentScore * 0.2 +
      isolationIntegrityScore * 0.35 +
      domainDiversityScore * 0.1 +
      experimentCoverage * 0.1
  );

  if (compositeScore >= 0.75) notes.push('Composite score indicates a trustworthy lab run for player review.');
  else notes.push('Composite score suggests elevated caution before acting on projections.');

  return {
    coverageScore,
    uncertaintyAlignmentScore,
    isolationIntegrityScore,
    domainDiversityScore,
    compositeScore,
    grade: gradeFromComposite(compositeScore),
    notes,
    authoritative: false
  };
}

/** Compare two catalog scenarios for side-by-side lab review (non-authoritative). */
export function compareAg21Scenarios(
  left: Ag21ForecastScenarioEntry,
  right: Ag21ForecastScenarioEntry
): Ag21ScenarioComparisonRow {
  const uncertaintyDelta = Math.abs(AG21_UNCERTAINTY_RANK[left.defaultUncertainty] - AG21_UNCERTAINTY_RANK[right.defaultUncertainty]);
  const titleSimilarity = tokenOverlap(left.title, right.title);
  const sameDomain = left.domain === right.domain;
  let recommendation: Ag21ScenarioComparisonRow['recommendation'] = 'comparable';
  if (!sameDomain && uncertaintyDelta >= 2) recommendation = 'incompatible';
  else if (uncertaintyDelta >= 2 || titleSimilarity < 0.08) recommendation = 'caution';

  const summary = sameDomain
    ? `Same domain (${left.domain}); uncertainty Δ=${uncertaintyDelta}.`
    : `Cross-domain (${left.domain} vs ${right.domain}); uncertainty Δ=${uncertaintyDelta}.`;

  return {
    leftId: left.id,
    rightId: right.id,
    sameDomain,
    uncertaintyDelta,
    titleSimilarity,
    recommendation,
    summary
  };
}

export function runAg21ForecastEvaluationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const results: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => results.push({ id, passed, detail });

  const sample: Ag21ForecastScenarioEntry[] = [
    {
      id: 'a',
      title: 'Cash victory pacing',
      domain: 'balance',
      narrative: 'n',
      defaultUncertainty: 'moderate'
    },
    {
      id: 'b',
      title: 'Region rush feasibility',
      domain: 'balance',
      narrative: 'n',
      defaultUncertainty: 'high'
    }
  ];

  const metrics = evaluateAg21ForecastRun({
    scenarioIds: ['a', 'b', 'missing'],
    scenarios: sample,
    experimentCount: 4,
    overallUncertainty: 'moderate',
    authoritativeMutationDetected: false,
    isolatedCopyVerifiedRatio: 1
  });
  push('eval_authoritative_false', metrics.authoritative === false, String(metrics.authoritative));
  push('eval_composite_range', metrics.compositeScore >= 0 && metrics.compositeScore <= 1, String(metrics.compositeScore));
  push('eval_mutation_zeroes_isolation', evaluateAg21ForecastRun({
    scenarioIds: ['a'],
    scenarios: sample.slice(0, 1),
    experimentCount: 1,
    overallUncertainty: 'low',
    authoritativeMutationDetected: true,
    isolatedCopyVerifiedRatio: 1
  }).isolationIntegrityScore === 0, 'mutation');

  const cmp = compareAg21Scenarios(sample[0], sample[1]);
  push('compare_same_domain', cmp.sameDomain && cmp.recommendation !== 'incompatible', cmp.recommendation);
  push(
    'compare_cross_domain_incompatible',
    compareAg21Scenarios(sample[0], { ...sample[1], domain: 'fiscal', defaultUncertainty: 'speculative' }).recommendation ===
      'incompatible',
    'cross'
  );

  return results;
}

// --- bundled from scenario-catalog.ts ---
/**
 * Agent 21 — forecast scenario catalog (non-authoritative exploratory narratives).
 * Operation 10M modular slice; Agent 25 inlines into canonical V9.4 at O10M_AGENT21_INTEGRATION_ANCHOR.
 */

export interface Ag21ForecastScenarioEntry {
  id: string;
  title: string;
  domain: string;
  narrative: string;
  defaultUncertainty: Ag21UncertaintyBand;
}

export const AG21_FORECAST_SCENARIO_CATALOG: Ag21ForecastScenarioEntry[] = [
  { id: 'ag21_sc_000', title: 'Cash victory pacing #1', domain: 'balance', narrative: 'Division E scenario 1: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_001', title: 'Region rush feasibility #2', domain: 'balance', narrative: 'Division E scenario 2: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_002', title: 'Late-match borrowing #3', domain: 'fiscal', narrative: 'Division E scenario 3: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_003', title: 'Skills pipeline lag #4', domain: 'workforce', narrative: 'Division E scenario 4: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_004', title: 'Megaproject surge #5', domain: 'workforce', narrative: 'Division E scenario 5: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_005', title: 'Crowded-out investments #6', domain: 'capital', narrative: 'Division E scenario 6: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_006', title: 'Supplier loss cascade #7', domain: 'resilience', narrative: 'Division E scenario 7: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_007', title: 'Network gateway failure #8', domain: 'resilience', narrative: 'Division E scenario 8: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_008', title: 'Theme momentum drift #9', domain: 'national_priority', narrative: 'Division E scenario 9: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_009', title: 'Priority ignore projection #10', domain: 'national_priority', narrative: 'Division E scenario 10: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_010', title: 'Cash victory pacing #11', domain: 'balance', narrative: 'Division E scenario 11: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_011', title: 'Region rush feasibility #12', domain: 'balance', narrative: 'Division E scenario 12: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_012', title: 'Late-match borrowing #13', domain: 'fiscal', narrative: 'Division E scenario 13: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_013', title: 'Skills pipeline lag #14', domain: 'workforce', narrative: 'Division E scenario 14: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_014', title: 'Megaproject surge #15', domain: 'workforce', narrative: 'Division E scenario 15: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_015', title: 'Crowded-out investments #16', domain: 'capital', narrative: 'Division E scenario 16: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_016', title: 'Supplier loss cascade #17', domain: 'resilience', narrative: 'Division E scenario 17: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_017', title: 'Network gateway failure #18', domain: 'resilience', narrative: 'Division E scenario 18: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_018', title: 'Theme momentum drift #19', domain: 'national_priority', narrative: 'Division E scenario 19: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_019', title: 'Priority ignore projection #20', domain: 'national_priority', narrative: 'Division E scenario 20: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_020', title: 'Cash victory pacing #21', domain: 'balance', narrative: 'Division E scenario 21: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_021', title: 'Region rush feasibility #22', domain: 'balance', narrative: 'Division E scenario 22: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_022', title: 'Late-match borrowing #23', domain: 'fiscal', narrative: 'Division E scenario 23: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_023', title: 'Skills pipeline lag #24', domain: 'workforce', narrative: 'Division E scenario 24: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_024', title: 'Megaproject surge #25', domain: 'workforce', narrative: 'Division E scenario 25: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_025', title: 'Crowded-out investments #26', domain: 'capital', narrative: 'Division E scenario 26: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_026', title: 'Supplier loss cascade #27', domain: 'resilience', narrative: 'Division E scenario 27: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_027', title: 'Network gateway failure #28', domain: 'resilience', narrative: 'Division E scenario 28: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_028', title: 'Theme momentum drift #29', domain: 'national_priority', narrative: 'Division E scenario 29: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_029', title: 'Priority ignore projection #30', domain: 'national_priority', narrative: 'Division E scenario 30: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_030', title: 'Cash victory pacing #31', domain: 'balance', narrative: 'Division E scenario 31: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_031', title: 'Region rush feasibility #32', domain: 'balance', narrative: 'Division E scenario 32: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_032', title: 'Late-match borrowing #33', domain: 'fiscal', narrative: 'Division E scenario 33: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_033', title: 'Skills pipeline lag #34', domain: 'workforce', narrative: 'Division E scenario 34: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_034', title: 'Megaproject surge #35', domain: 'workforce', narrative: 'Division E scenario 35: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_035', title: 'Crowded-out investments #36', domain: 'capital', narrative: 'Division E scenario 36: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_036', title: 'Supplier loss cascade #37', domain: 'resilience', narrative: 'Division E scenario 37: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_037', title: 'Network gateway failure #38', domain: 'resilience', narrative: 'Division E scenario 38: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_038', title: 'Theme momentum drift #39', domain: 'national_priority', narrative: 'Division E scenario 39: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_039', title: 'Priority ignore projection #40', domain: 'national_priority', narrative: 'Division E scenario 40: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_040', title: 'Cash victory pacing #41', domain: 'balance', narrative: 'Division E scenario 41: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_041', title: 'Region rush feasibility #42', domain: 'balance', narrative: 'Division E scenario 42: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_042', title: 'Late-match borrowing #43', domain: 'fiscal', narrative: 'Division E scenario 43: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_043', title: 'Skills pipeline lag #44', domain: 'workforce', narrative: 'Division E scenario 44: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_044', title: 'Megaproject surge #45', domain: 'workforce', narrative: 'Division E scenario 45: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_045', title: 'Crowded-out investments #46', domain: 'capital', narrative: 'Division E scenario 46: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_046', title: 'Supplier loss cascade #47', domain: 'resilience', narrative: 'Division E scenario 47: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_047', title: 'Network gateway failure #48', domain: 'resilience', narrative: 'Division E scenario 48: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_048', title: 'Theme momentum drift #49', domain: 'national_priority', narrative: 'Division E scenario 49: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_049', title: 'Priority ignore projection #50', domain: 'national_priority', narrative: 'Division E scenario 50: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_050', title: 'Cash victory pacing #51', domain: 'balance', narrative: 'Division E scenario 51: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_051', title: 'Region rush feasibility #52', domain: 'balance', narrative: 'Division E scenario 52: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_052', title: 'Late-match borrowing #53', domain: 'fiscal', narrative: 'Division E scenario 53: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_053', title: 'Skills pipeline lag #54', domain: 'workforce', narrative: 'Division E scenario 54: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_054', title: 'Megaproject surge #55', domain: 'workforce', narrative: 'Division E scenario 55: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_055', title: 'Crowded-out investments #56', domain: 'capital', narrative: 'Division E scenario 56: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_056', title: 'Supplier loss cascade #57', domain: 'resilience', narrative: 'Division E scenario 57: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_057', title: 'Network gateway failure #58', domain: 'resilience', narrative: 'Division E scenario 58: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_058', title: 'Theme momentum drift #59', domain: 'national_priority', narrative: 'Division E scenario 59: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_059', title: 'Priority ignore projection #60', domain: 'national_priority', narrative: 'Division E scenario 60: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_060', title: 'Cash victory pacing #61', domain: 'balance', narrative: 'Division E scenario 61: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_061', title: 'Region rush feasibility #62', domain: 'balance', narrative: 'Division E scenario 62: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_062', title: 'Late-match borrowing #63', domain: 'fiscal', narrative: 'Division E scenario 63: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_063', title: 'Skills pipeline lag #64', domain: 'workforce', narrative: 'Division E scenario 64: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_064', title: 'Megaproject surge #65', domain: 'workforce', narrative: 'Division E scenario 65: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_065', title: 'Crowded-out investments #66', domain: 'capital', narrative: 'Division E scenario 66: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_066', title: 'Supplier loss cascade #67', domain: 'resilience', narrative: 'Division E scenario 67: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_067', title: 'Network gateway failure #68', domain: 'resilience', narrative: 'Division E scenario 68: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_068', title: 'Theme momentum drift #69', domain: 'national_priority', narrative: 'Division E scenario 69: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_069', title: 'Priority ignore projection #70', domain: 'national_priority', narrative: 'Division E scenario 70: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_070', title: 'Cash victory pacing #71', domain: 'balance', narrative: 'Division E scenario 71: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_071', title: 'Region rush feasibility #72', domain: 'balance', narrative: 'Division E scenario 72: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_072', title: 'Late-match borrowing #73', domain: 'fiscal', narrative: 'Division E scenario 73: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_073', title: 'Skills pipeline lag #74', domain: 'workforce', narrative: 'Division E scenario 74: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_074', title: 'Megaproject surge #75', domain: 'workforce', narrative: 'Division E scenario 75: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_075', title: 'Crowded-out investments #76', domain: 'capital', narrative: 'Division E scenario 76: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_076', title: 'Supplier loss cascade #77', domain: 'resilience', narrative: 'Division E scenario 77: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_077', title: 'Network gateway failure #78', domain: 'resilience', narrative: 'Division E scenario 78: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_078', title: 'Theme momentum drift #79', domain: 'national_priority', narrative: 'Division E scenario 79: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_079', title: 'Priority ignore projection #80', domain: 'national_priority', narrative: 'Division E scenario 80: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_080', title: 'Cash victory pacing #81', domain: 'balance', narrative: 'Division E scenario 81: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_081', title: 'Region rush feasibility #82', domain: 'balance', narrative: 'Division E scenario 82: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_082', title: 'Late-match borrowing #83', domain: 'fiscal', narrative: 'Division E scenario 83: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_083', title: 'Skills pipeline lag #84', domain: 'workforce', narrative: 'Division E scenario 84: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_084', title: 'Megaproject surge #85', domain: 'workforce', narrative: 'Division E scenario 85: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_085', title: 'Crowded-out investments #86', domain: 'capital', narrative: 'Division E scenario 86: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_086', title: 'Supplier loss cascade #87', domain: 'resilience', narrative: 'Division E scenario 87: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_087', title: 'Network gateway failure #88', domain: 'resilience', narrative: 'Division E scenario 88: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_088', title: 'Theme momentum drift #89', domain: 'national_priority', narrative: 'Division E scenario 89: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_089', title: 'Priority ignore projection #90', domain: 'national_priority', narrative: 'Division E scenario 90: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_090', title: 'Cash victory pacing #91', domain: 'balance', narrative: 'Division E scenario 91: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_091', title: 'Region rush feasibility #92', domain: 'balance', narrative: 'Division E scenario 92: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_092', title: 'Late-match borrowing #93', domain: 'fiscal', narrative: 'Division E scenario 93: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_093', title: 'Skills pipeline lag #94', domain: 'workforce', narrative: 'Division E scenario 94: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_094', title: 'Megaproject surge #95', domain: 'workforce', narrative: 'Division E scenario 95: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_095', title: 'Crowded-out investments #96', domain: 'capital', narrative: 'Division E scenario 96: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_096', title: 'Supplier loss cascade #97', domain: 'resilience', narrative: 'Division E scenario 97: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_097', title: 'Network gateway failure #98', domain: 'resilience', narrative: 'Division E scenario 98: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_098', title: 'Theme momentum drift #99', domain: 'national_priority', narrative: 'Division E scenario 99: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_099', title: 'Priority ignore projection #100', domain: 'national_priority', narrative: 'Division E scenario 100: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_100', title: 'Cash victory pacing #101', domain: 'balance', narrative: 'Division E scenario 101: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_101', title: 'Region rush feasibility #102', domain: 'balance', narrative: 'Division E scenario 102: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_102', title: 'Late-match borrowing #103', domain: 'fiscal', narrative: 'Division E scenario 103: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_103', title: 'Skills pipeline lag #104', domain: 'workforce', narrative: 'Division E scenario 104: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_104', title: 'Megaproject surge #105', domain: 'workforce', narrative: 'Division E scenario 105: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_105', title: 'Crowded-out investments #106', domain: 'capital', narrative: 'Division E scenario 106: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_106', title: 'Supplier loss cascade #107', domain: 'resilience', narrative: 'Division E scenario 107: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_107', title: 'Network gateway failure #108', domain: 'resilience', narrative: 'Division E scenario 108: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_108', title: 'Theme momentum drift #109', domain: 'national_priority', narrative: 'Division E scenario 109: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_109', title: 'Priority ignore projection #110', domain: 'national_priority', narrative: 'Division E scenario 110: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_110', title: 'Cash victory pacing #111', domain: 'balance', narrative: 'Division E scenario 111: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_111', title: 'Region rush feasibility #112', domain: 'balance', narrative: 'Division E scenario 112: exploratory balance forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_112', title: 'Late-match borrowing #113', domain: 'fiscal', narrative: 'Division E scenario 113: exploratory fiscal forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_113', title: 'Skills pipeline lag #114', domain: 'workforce', narrative: 'Division E scenario 114: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_114', title: 'Megaproject surge #115', domain: 'workforce', narrative: 'Division E scenario 115: exploratory workforce forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_115', title: 'Crowded-out investments #116', domain: 'capital', narrative: 'Division E scenario 116: exploratory capital forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_116', title: 'Supplier loss cascade #117', domain: 'resilience', narrative: 'Division E scenario 117: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_117', title: 'Network gateway failure #118', domain: 'resilience', narrative: 'Division E scenario 118: exploratory resilience forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'high' },
  { id: 'ag21_sc_118', title: 'Theme momentum drift #119', domain: 'national_priority', narrative: 'Division E scenario 119: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
  { id: 'ag21_sc_119', title: 'Priority ignore projection #120', domain: 'national_priority', narrative: 'Division E scenario 120: exploratory national_priority forecast comparing baseline vs stressed inputs without writing to canonical state.', defaultUncertainty: 'moderate' },
];

export function lookupAg21Scenario(id: string) { return AG21_FORECAST_SCENARIO_CATALOG.find(s => s.id === id) || null; }

// --- bundled from strategic-forecast-policy-lab.tsx ---
/**
 * Agent 21 — Strategic Forecasting & Policy Laboratory (Operation 10M)
 * O10M_AGENT21_INTEGRATION_ANCHOR — Agent 25 inlines at this module boundary in `(V9.4) australia-game-with-ai.tsx`.
 *
 * INTEGRATION DEPENDENCIES (canonical V9.4 at assembly): BalancePolicyId, BalancePolicyRow,
 * runBalancePolicyMatrix, createWorkforceFixture, computeNationalWorkforce, simulateWorkforceWhatIf,
 * createSystemicRiskFixture, runSystemicStressTest, StrategicStressTest, fnv1aHashString (optional — ag21FingerprintSnapshot re-exported),
 * V9SelfTestResult, React, useState, useMemo.
 */
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

// --- bundled from scenario-comparison-ui.tsx ---
/**
 * Agent 21 — scenario comparison UI fragment (non-authoritative lab review).
 */


const AG21_DEFAULT_PAIR: [string, string] = ['ag21_sc_000', 'ag21_sc_001'];

export interface Ag21ScenarioComparisonStripProps {
  leftScenarioId?: string;
  rightScenarioId?: string;
  compact?: boolean;
}

export const Ag21ScenarioComparisonStrip: React.FC<Ag21ScenarioComparisonStripProps> = ({
  leftScenarioId,
  rightScenarioId,
  compact
}) => {
  const [leftId, setLeftId] = useState(leftScenarioId ?? AG21_DEFAULT_PAIR[0]);
  const [rightId, setRightId] = useState(rightScenarioId ?? AG21_DEFAULT_PAIR[1]);

  const left = lookupAg21Scenario(leftId);
  const right = lookupAg21Scenario(rightId);

  const comparison = useMemo(() => {
    if (!left || !right) return null;
    return compareAg21Scenarios(left, right);
  }, [left, right]);

  const evaluation = useMemo(() => {
    const scenarios = [left, right].filter(Boolean) as NonNullable<typeof left>[];
    return evaluateAg21ForecastRun({
      scenarioIds: [leftId, rightId],
      scenarios,
      experimentCount: 4,
      overallUncertainty: scenarios[0]?.defaultUncertainty ?? 'moderate',
      authoritativeMutationDetected: false,
      isolatedCopyVerifiedRatio: 1
    });
  }, [left, right, leftId, rightId]);

  const options = useMemo(
    () => AG21_FORECAST_SCENARIO_CATALOG.slice(0, compact ? 24 : 40),
    [compact]
  );

  return (
    <div
      className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/80 text-xs space-y-2"
      data-testid="ag21-scenario-comparison"
    >
      <div className="font-bold text-violet-200">
        🔀 Scenario Comparison <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase opacity-70">Scenario A</span>
          <select
            className="bg-slate-900 border border-slate-600 rounded px-1 py-0.5"
            value={leftId}
            onChange={e => setLeftId(e.target.value)}
            data-testid="ag21-scenario-left"
          >
            {options.map(s => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="text-[10px] uppercase opacity-70">Scenario B</span>
          <select
            className="bg-slate-900 border border-slate-600 rounded px-1 py-0.5"
            value={rightId}
            onChange={e => setRightId(e.target.value)}
            data-testid="ag21-scenario-right"
          >
            {options.map(s => (
              <option key={s.id} value={s.id}>
                {s.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      {comparison && left && right ? (
        <div className="rounded border border-slate-700/60 bg-slate-900/50 p-2 space-y-1">
          <div className="font-semibold text-violet-100" data-testid="ag21-comparison-recommendation">
            {comparison.recommendation.toUpperCase()} · {comparison.summary}
          </div>
          <div className="opacity-80">{left.narrative.slice(0, compact ? 90 : 140)}</div>
          <div className="opacity-80">{right.narrative.slice(0, compact ? 90 : 140)}</div>
        </div>
      ) : (
        <div className="text-amber-200/90">Select valid scenarios to compare.</div>
      )}
      <div className="flex flex-wrap gap-2 text-[10px]" data-testid="ag21-evaluation-metrics">
        <span className="px-2 py-0.5 rounded bg-slate-800">Grade {evaluation.grade}</span>
        <span className="px-2 py-0.5 rounded bg-slate-800">Composite {(evaluation.compositeScore * 100).toFixed(0)}%</span>
        <span className="px-2 py-0.5 rounded bg-slate-800">Coverage {(evaluation.coverageScore * 100).toFixed(0)}%</span>
        <span className="px-2 py-0.5 rounded bg-slate-800">Isolation {(evaluation.isolationIntegrityScore * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
};



/** Agent 25 — modular self-tests (subset of npm run test:ag21). */
export function runAgent21ForecastingChunkSelfTests(): {
  passed: number;
  failed: number;
  results: Array<{ id: string; passed: boolean; detail?: string }>;
} {
  const results: Array<{ id: string; passed: boolean; detail?: string }> = [];
  for (const row of runAg21CounterfactualSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ForecastEvaluationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  results.push({
    id: 'agent21_chunk_catalog',
    passed: AG21_FORECAST_SCENARIO_CATALOG.length >= 100,
    detail: String(AG21_FORECAST_SCENARIO_CATALOG.length)
  });
  const passed = results.filter(r => r.passed).length;
  return { passed, failed: results.length - passed, results };
}

// OP10M_MODULE_END agent-21-forecasting
