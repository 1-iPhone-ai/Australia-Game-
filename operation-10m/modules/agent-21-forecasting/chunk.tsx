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

export const O10M_AGENT21_MODULE_VERSION = '2.3.0';
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

// --- bundled from forecast-lab-depth.ts ---
/**
 * Agent 21 — extended forecast lab depth (multi-horizon ladders, batch scenario review).
 * All projections operate on isolated copies; outputs are non-authoritative.
 */


export interface Ag21HorizonProjectionStep {
  turns: number;
  projectedCash: number;
  projectedDebt: number;
  regionsControlled: number;
  uncertainty: Ag21UncertaintyBand;
  note: string;
}

export interface Ag21MultiHorizonProjection {
  seed: number;
  baselineFingerprint: string;
  steps: Ag21HorizonProjectionStep[];
  overallUncertainty: Ag21UncertaintyLabel;
  authoritativeMutationDetected: boolean;
}

export interface Ag21ScenarioBatchComparison {
  scenarioIds: string[];
  pairwise: ReturnType<typeof compareAg21Scenarios>[];
  domainCounts: Record<string, number>;
  evaluation: ReturnType<typeof evaluateAg21ForecastRun>;
  headline: string;
}

export interface Ag21BundleDepthSummary {
  experimentCount: number;
  domainCount: number;
  horizonCount: number;
  worstUncertainty: Ag21UncertaintyBand;
  isolationOk: boolean;
  experimentScore: number;
  notes: string[];
  authoritative: false;
}

const AG21_HORIZON_LADDER = [4, 8, 12, 16] as const;

const AG21_UNCERTAINTY_MAX: Record<Ag21UncertaintyBand, number> = {
  low: 0,
  moderate: 1,
  high: 2,
  speculative: 3
};

function ag21MaxUncertainty(bands: Ag21UncertaintyBand[]): Ag21UncertaintyBand {
  let max: Ag21UncertaintyBand = 'low';
  for (const b of bands) {
    if (AG21_UNCERTAINTY_MAX[b] > AG21_UNCERTAINTY_MAX[max]) max = b;
  }
  return max;
}

function ag21HorizonBand(turns: number, debtRatio: number): Ag21UncertaintyBand {
  if (debtRatio > 1.2) return 'high';
  if (turns >= 12) return 'moderate';
  return 'low';
}

/** Deterministic cash/debt projection ladder from an isolated forecast context (lab-only heuristics). */
export function buildAg21MultiHorizonProjection(ctx: Ag21ForecastContext): Ag21MultiHorizonProjection {
  const subject = { ...ctx };
  const baselineFingerprint = ag21FingerprintSnapshot(subject);
  const steps: Ag21HorizonProjectionStep[] = [];

  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    let cash = copy.actorCash;
    let debt = copy.actorDebt;
    let regions = copy.regionsControlled;
    const momentum = copy.nationalPriorityMomentum ?? 'stable';
    const momentumFactor = momentum === 'rising' ? 1.04 : momentum === 'falling' ? 0.96 : 1;

    for (const turns of AG21_HORIZON_LADDER) {
      const income = 35 + regions * 8 + (copy.seed % 7);
      const spend = 22 + debt * 0.04;
      cash = Math.round((cash + income - spend) * momentumFactor);
      debt = Math.max(0, Math.round(debt * 0.985 - regions * 2));
      if (turns % 8 === 0 && cash > 400) regions += 1;
      const debtRatio = debt / Math.max(1, cash);
      steps.push({
        turns,
        projectedCash: cash,
        projectedDebt: debt,
        regionsControlled: regions,
        uncertainty: ag21HorizonBand(turns, debtRatio),
        note: `Lab ladder @${turns}t · momentum=${momentum}`
      });
    }
    return steps;
  });

  const ladder = (iso.result || []) as Ag21HorizonProjectionStep[];
  const bands = ladder.map(s => s.uncertainty);
  return {
    seed: subject.seed,
    baselineFingerprint,
    steps: ladder,
    overallUncertainty: ag21LabelUncertainty(ag21MaxUncertainty(bands), [`horizons=${ladder.length}`]),
    authoritativeMutationDetected: baselineFingerprint !== ag21FingerprintSnapshot(subject)
  };
}

/** Compare a batch of catalog scenarios for portfolio-style lab review. */
export function runAg21ScenarioBatchComparison(scenarioIds: string[]): Ag21ScenarioBatchComparison {
  const scenarios = scenarioIds
    .map(id => lookupAg21Scenario(id))
    .filter((s): s is Ag21ForecastScenarioEntry => Boolean(s));

  const pairwise: ReturnType<typeof compareAg21Scenarios>[] = [];
  for (let i = 0; i < scenarios.length; i++) {
    for (let j = i + 1; j < scenarios.length; j++) {
      pairwise.push(compareAg21Scenarios(scenarios[i], scenarios[j]));
    }
  }

  const domainCounts: Record<string, number> = {};
  for (const s of scenarios) domainCounts[s.domain] = (domainCounts[s.domain] ?? 0) + 1;

  const evaluation = evaluateAg21ForecastRun({
    scenarioIds,
    scenarios,
    experimentCount: 4,
    overallUncertainty: ag21MaxUncertainty(scenarios.map(s => s.defaultUncertainty)),
    authoritativeMutationDetected: false,
    isolatedCopyVerifiedRatio: 1
  });

  const caution = pairwise.filter(p => p.recommendation !== 'comparable').length;
  const headline =
    scenarios.length === 0
      ? 'No scenarios resolved — batch comparison empty.'
      : `${scenarios.length} scenarios · ${pairwise.length} pairs · ${caution} caution/incompatible pairs.`;

  return { scenarioIds, pairwise, domainCounts, evaluation, headline };
}

/** Summarize an existing forecast bundle for dashboard depth readouts. */
export function summarizeAg21ForecastBundleDepth(bundle: Ag21ForecastBundle): Ag21BundleDepthSummary {
  const domains = new Set(bundle.experiments.map(e => e.domain));
  const horizonCount = bundle.experiments.reduce((n, e) => n + e.horizons.length, 0);
  const bands = bundle.experiments.map(e => e.uncertainty.band);
  const worst = ag21MaxUncertainty(bands);
  const isolationOk = !bundle.authoritativeMutationDetected &&
    bundle.experiments.every(e => e.provenance.isolatedCopyVerified && e.provenance.authoritative === false);

  const experimentScore = clamp01(
    (isolationOk ? 0.45 : 0) +
      clamp01(bundle.experiments.length / 5) * 0.25 +
      clamp01(horizonCount / 8) * 0.15 +
      (worst === 'low' ? 0.15 : worst === 'moderate' ? 0.1 : 0.05)
  );

  const notes: string[] = [];
  if (!isolationOk) notes.push('Isolation or provenance flags require review.');
  if (domains.size < 3) notes.push('Low domain diversity across experiments.');
  else notes.push(`Coverage spans ${domains.size} domains.`);

  return {
    experimentCount: bundle.experiments.length,
    domainCount: domains.size,
    horizonCount,
    worstUncertainty: worst,
    isolationOk,
    experimentScore,
    notes,
    authoritative: false
  };
}

/** Counterfactual stress ladder — sequential forks on isolated copies (still read-only on subject). */
export function runAg21CounterfactualStressLadder(ctx: Ag21ForecastContext): {
  ladder: ReturnType<typeof runAg21CounterfactualFork<Ag21ForecastContext>>;
  projection: Ag21MultiHorizonProjection;
} {
  const subject = { ...ctx };
  const branches: Ag21CounterfactualBranchSpec<Ag21ForecastContext>[] = [
    {
      id: 'shock_revenue',
      label: 'Revenue shock',
      apply: c => {
        c.actorCash = Math.max(0, c.actorCash - 180);
      }
    },
    {
      id: 'debt_spike',
      label: 'Debt spike',
      apply: c => {
        c.actorDebt += 220;
      }
    },
    {
      id: 'region_stall',
      label: 'Region stall',
      apply: c => {
        c.regionsControlled = Math.max(0, c.regionsControlled - 1);
        c.nationalPriorityMomentum = 'falling';
      }
    }
  ];

  const iso = ag21VerifyIsolatedExperiment(subject, copy => runAg21CounterfactualFork(copy, branches));
  const ladder = iso.result as ReturnType<typeof runAg21CounterfactualFork<Ag21ForecastContext>>;
  const projection = buildAg21MultiHorizonProjection(subject);
  return { ladder, projection };
}

function clamp01(n: number): number {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

export function runAg21ForecastLabDepthSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = {
    turn: 6,
    seed: 31,
    actorCash: 1200,
    actorDebt: 90,
    regionsControlled: 2,
    nationalPriorityMomentum: 'rising'
  };

  const before = ag21FingerprintSnapshot(ctx);
  const projection = buildAg21MultiHorizonProjection(ctx);
  push('depth_projection_steps', projection.steps.length === AG21_HORIZON_LADDER.length, String(projection.steps.length));
  push('depth_projection_no_mutation', before === ag21FingerprintSnapshot(ctx), 'fingerprint');
  push('depth_projection_non_auth', projection.overallUncertainty.playerFacing.includes('Non-authoritative'), 'copy');

  const batch = runAg21ScenarioBatchComparison(['ag21_sc_000', 'ag21_sc_006', 'ag21_sc_008']);
  push('depth_batch_pairs', batch.pairwise.length === 3, String(batch.pairwise.length));
  push('depth_batch_eval', batch.evaluation.authoritative === false && batch.evaluation.compositeScore > 0, batch.headline);

  const mockBundle: Ag21ForecastBundle = {
    generatedAtTurn: 1,
    authoritativeMutationDetected: false,
    overallUncertainty: ag21LabelUncertainty('moderate'),
    experiments: [
      mockExperiment('balance'),
      mockExperiment('workforce'),
      mockExperiment('resilience'),
      mockExperiment('counterfactual')
    ]
  };
  const summary = summarizeAg21ForecastBundleDepth(mockBundle);
  push('depth_bundle_summary', summary.isolationOk && summary.experimentCount === 4, summary.notes.join('; '));

  const stress = runAg21CounterfactualStressLadder(ctx);
  push(
    'depth_stress_ladder',
    stress.ladder.branches.length === 3 && !stress.ladder.authoritativeMutationDetected,
    String(stress.ladder.branches.length)
  );

  return out;
}

function mockExperiment(domain: string): Ag21PolicyExperimentResult {
  return {
    id: `mock_${domain}`,
    label: domain,
    domain,
    horizons: [{ turns: 4, uncertainty: 'moderate', summary: 'mock', metrics: {} }],
    uncertainty: ag21LabelUncertainty('moderate'),
    provenance: {
      authoritative: false,
      label: 'policy_experiment',
      sourceSystems: ['mock'],
      isolatedCopyVerified: true,
      fingerprintBefore: 'a',
      fingerprintAfter: 'a',
      disclaimer: 'mock'
    },
    notes: []
  };
}

// --- bundled from forecast-policy-sensitivity.ts ---
/**
 * Agent 21 — policy sensitivity sweep (isolated context perturbations, non-authoritative).
 */


export interface Ag21PolicySensitivityRow {
  lever: 'actorCash' | 'actorDebt' | 'regionsControlled' | 'nationalPriorityMomentum';
  deltaLabel: string;
  projectedCash: number;
  projectedDebt: number;
  regionsControlled: number;
  sensitivityScore: number;
  uncertainty: Ag21UncertaintyBand;
}

export interface Ag21PolicySensitivityReport {
  baselineFingerprint: string;
  rows: Ag21PolicySensitivityRow[];
  dominantLever: Ag21PolicySensitivityRow['lever'] | 'none';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritativeMutationDetected: boolean;
}

type Momentum = NonNullable<Ag21ForecastContext['nationalPriorityMomentum']>;

const AG21_SENSITIVITY_PERTURBATIONS: Array<{
  lever: Ag21PolicySensitivityRow['lever'];
  deltaLabel: string;
  apply: (c: Ag21ForecastContext) => void;
}> = [
  { lever: 'actorCash', deltaLabel: 'cash -15%', apply: c => { c.actorCash = Math.round(c.actorCash * 0.85); } },
  { lever: 'actorCash', deltaLabel: 'cash +20%', apply: c => { c.actorCash = Math.round(c.actorCash * 1.2); } },
  { lever: 'actorDebt', deltaLabel: 'debt +25%', apply: c => { c.actorDebt = Math.round(c.actorDebt * 1.25 + 40); } },
  { lever: 'regionsControlled', deltaLabel: 'regions +1', apply: c => { c.regionsControlled += 1; } },
  {
    lever: 'nationalPriorityMomentum',
    deltaLabel: 'momentum falling',
    apply: c => { c.nationalPriorityMomentum = 'falling' as Momentum; }
  },
  {
    lever: 'nationalPriorityMomentum',
    deltaLabel: 'momentum rising',
    apply: c => { c.nationalPriorityMomentum = 'rising' as Momentum; }
  }
];

function ag21ProjectOneTurn(copy: Ag21ForecastContext): { cash: number; debt: number; regions: number } {
  const income = 30 + copy.regionsControlled * 10 + (copy.seed % 5);
  const spend = 18 + copy.actorDebt * 0.05;
  const momentum = copy.nationalPriorityMomentum ?? 'stable';
  const factor = momentum === 'rising' ? 1.05 : momentum === 'falling' ? 0.94 : 1;
  const cash = Math.round((copy.actorCash + income - spend) * factor);
  const debt = Math.max(0, Math.round(copy.actorDebt * 0.99));
  return { cash, debt, regions: copy.regionsControlled };
}

function ag21SensitivityScore(baseline: ReturnType<typeof ag21ProjectOneTurn>, projected: ReturnType<typeof ag21ProjectOneTurn>): number {
  const cashDelta = Math.abs(projected.cash - baseline.cash) / Math.max(1, Math.abs(baseline.cash));
  const debtDelta = Math.abs(projected.debt - baseline.debt) / Math.max(1, Math.abs(baseline.debt));
  const regionDelta = Math.abs(projected.regions - baseline.regions) * 0.15;
  return Math.min(1, cashDelta * 0.55 + debtDelta * 0.35 + regionDelta);
}

function ag21BandFromScore(score: number): Ag21UncertaintyBand {
  if (score > 0.45) return 'high';
  if (score > 0.2) return 'moderate';
  return 'low';
}

export function runAg21PolicySensitivitySweep(ctx: Ag21ForecastContext): Ag21PolicySensitivityReport {
  const subject: Ag21ForecastContext = { ...ctx, nationalPriorityMomentum: ctx.nationalPriorityMomentum ?? 'stable' };
  const baselineFingerprint = ag21FingerprintSnapshot(subject);
  const rows: Ag21PolicySensitivityRow[] = [];

  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    const baseline = ag21ProjectOneTurn(copy);
    for (const spec of AG21_SENSITIVITY_PERTURBATIONS) {
      const fork: Ag21ForecastContext = { ...copy, nationalPriorityMomentum: copy.nationalPriorityMomentum ?? 'stable' };
      spec.apply(fork);
      const projected = ag21ProjectOneTurn(fork);
      const sensitivityScore = ag21SensitivityScore(baseline, projected);
      rows.push({
        lever: spec.lever,
        deltaLabel: spec.deltaLabel,
        projectedCash: projected.cash,
        projectedDebt: projected.debt,
        regionsControlled: projected.regions,
        sensitivityScore,
        uncertainty: ag21BandFromScore(sensitivityScore)
      });
    }
    return rows;
  });

  const resultRows = (iso.result || []) as Ag21PolicySensitivityRow[];
  let dominant: Ag21PolicySensitivityRow | null = null;
  for (const row of resultRows) {
    if (!dominant || row.sensitivityScore > dominant.sensitivityScore) dominant = row;
  }

  const bands = resultRows.map(r => r.uncertainty);
  const overallBand: Ag21UncertaintyBand = bands.includes('high')
    ? 'high'
    : bands.includes('moderate')
      ? 'moderate'
      : 'low';

  return {
    baselineFingerprint,
    rows: resultRows,
    dominantLever: dominant?.lever ?? 'none',
    overallUncertainty: ag21LabelUncertainty(overallBand, [`perturbations=${resultRows.length}`]),
    authoritativeMutationDetected: baselineFingerprint !== ag21FingerprintSnapshot(subject)
  };
}

export function runAg21PolicySensitivitySelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 5, seed: 44, actorCash: 900, actorDebt: 120, regionsControlled: 2 };
  const before = ag21FingerprintSnapshot(ctx);
  const report = runAg21PolicySensitivitySweep(ctx);
  push('sensitivity_rows', report.rows.length === AG21_SENSITIVITY_PERTURBATIONS.length, String(report.rows.length));
  push('sensitivity_no_mutation', before === ag21FingerprintSnapshot(ctx), 'fp');
  push('sensitivity_dominant', report.dominantLever !== 'none', report.dominantLever);
  push('sensitivity_non_auth', report.overallUncertainty.playerFacing.includes('Non-authoritative'), 'copy');

  return out;
}

// --- bundled from forecast-domain-matrix.ts ---
/**
 * Agent 21 — domain stress matrix (catalog-driven cross-domain lab grid).
 */


export interface Ag21DomainStressCell {
  domain: string;
  scenarioId: string;
  title: string;
  stressIndex: number;
  uncertainty: Ag21UncertaintyBand;
}

export interface Ag21DomainStressMatrix {
  domains: string[];
  cells: Ag21DomainStressCell[];
  matrixScore: number;
  hotspots: string[];
  evaluationGrade: ReturnType<typeof evaluateAg21ForecastRun>['grade'];
  headline: string;
  authoritative: false;
}

const AG21_DOMAIN_ORDER = ['balance', 'fiscal', 'workforce', 'capital', 'resilience', 'national_priority'] as const;

const AG21_UNCERTAINTY_WEIGHT: Record<Ag21UncertaintyBand, number> = {
  low: 0.15,
  moderate: 0.35,
  high: 0.65,
  speculative: 0.9
};

function ag21PickScenarioForDomain(domain: string, offset: number): Ag21DomainStressCell | null {
  const pool = AG21_FORECAST_SCENARIO_CATALOG.filter(s => s.domain === domain);
  if (!pool.length) return null;
  const entry = pool[offset % pool.length];
  const stressIndex = AG21_UNCERTAINTY_WEIGHT[entry.defaultUncertainty] + (offset % 3) * 0.05;
  return {
    domain,
    scenarioId: entry.id,
    title: entry.title,
    stressIndex: Math.min(1, stressIndex),
    uncertainty: entry.defaultUncertainty
  };
}

/** Build a fixed cross-domain stress matrix using catalog entries (read-only). */
export function buildAg21DomainStressMatrix(samplePerDomain = 2): Ag21DomainStressMatrix {
  const cells: Ag21DomainStressCell[] = [];
  const domains: string[] = [];

  for (const domain of AG21_DOMAIN_ORDER) {
    let added = 0;
    for (let i = 0; i < samplePerDomain; i++) {
      const cell = ag21PickScenarioForDomain(domain, i);
      if (!cell) continue;
      cells.push(cell);
      added++;
    }
    if (added) domains.push(domain);
  }

  const scenarios = cells.map(c => lookupAg21Scenario(c.scenarioId)).filter(Boolean) as NonNullable<
    ReturnType<typeof lookupAg21Scenario>
  >[];

  const evaluation = evaluateAg21ForecastRun({
    scenarioIds: scenarios.map(s => s.id),
    scenarios,
    experimentCount: 4,
    overallUncertainty: 'moderate',
    authoritativeMutationDetected: false,
    isolatedCopyVerifiedRatio: 1
  });

  const matrixScore =
    cells.reduce((sum, c) => sum + c.stressIndex, 0) / Math.max(1, cells.length);

  const hotspots = cells
    .filter(c => c.stressIndex >= 0.6)
    .sort((a, b) => b.stressIndex - a.stressIndex)
    .slice(0, 4)
    .map(c => `${c.domain}:${c.scenarioId}`);

  return {
    domains,
    cells,
    matrixScore,
    hotspots,
    evaluationGrade: evaluation.grade,
    headline: ag21LabelUncertainty(
      matrixScore > 0.65 ? 'high' : matrixScore > 0.4 ? 'moderate' : 'low',
      [`domains=${domains.length}`, `cells=${cells.length}`]
    ).headline,
    authoritative: false
  };
}

export function runAg21DomainStressMatrixSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const matrix = buildAg21DomainStressMatrix(2);
  push('domain_matrix_cells', matrix.cells.length >= 10, String(matrix.cells.length));
  push('domain_matrix_domains', matrix.domains.length >= 5, String(matrix.domains.length));
  push('domain_matrix_non_auth', matrix.authoritative === false, 'flag');
  push('domain_matrix_score', matrix.matrixScore > 0 && matrix.matrixScore <= 1, String(matrix.matrixScore));

  return out;
}

// --- bundled from forecast-audit-ledger.ts ---
/**
 * Agent 21 — in-memory forecast audit ledger (lab session trace; never canonical).
 */


export interface Ag21ForecastAuditEntry {
  id: string;
  atTurn: number;
  kind: 'sensitivity' | 'domain_matrix' | 'projection' | 'batch';
  summary: string;
  fingerprint: string;
  authoritative: false;
}

export interface Ag21ForecastAuditLedger {
  entries: Ag21ForecastAuditEntry[];
  maxEntries: number;
}

let AG21_AUDIT_SEQ = 0;

export function createAg21ForecastAuditLedger(maxEntries = 32): Ag21ForecastAuditLedger {
  return { entries: [], maxEntries };
}

export function appendAg21ForecastAuditEntry(
  ledger: Ag21ForecastAuditLedger,
  entry: Omit<Ag21ForecastAuditEntry, 'id' | 'fingerprint' | 'authoritative'> & { payload: unknown }
): Ag21ForecastAuditEntry {
  const record: Ag21ForecastAuditEntry = {
    id: `ag21_audit_${++AG21_AUDIT_SEQ}`,
    atTurn: entry.atTurn,
    kind: entry.kind,
    summary: entry.summary,
    fingerprint: ag21FingerprintSnapshot({ kind: entry.kind, summary: entry.summary, payload: entry.payload }),
    authoritative: false
  };
  ledger.entries.push(record);
  if (ledger.entries.length > ledger.maxEntries) {
    ledger.entries.splice(0, ledger.entries.length - ledger.maxEntries);
  }
  return record;
}

export function summarizeAg21ForecastAuditLedger(ledger: Ag21ForecastAuditLedger): {
  count: number;
  byKind: Record<string, number>;
  latestSummary: string;
  authoritative: false;
} {
  const byKind: Record<string, number> = {};
  for (const e of ledger.entries) byKind[e.kind] = (byKind[e.kind] ?? 0) + 1;
  return {
    count: ledger.entries.length,
    byKind,
    latestSummary: ledger.entries[ledger.entries.length - 1]?.summary ?? 'empty',
    authoritative: false
  };
}

export function runAg21ForecastAuditSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ledger = createAg21ForecastAuditLedger(3);
  appendAg21ForecastAuditEntry(ledger, { atTurn: 1, kind: 'projection', summary: 'a', payload: { x: 1 } });
  appendAg21ForecastAuditEntry(ledger, { atTurn: 2, kind: 'batch', summary: 'b', payload: { x: 2 } });
  appendAg21ForecastAuditEntry(ledger, { atTurn: 3, kind: 'sensitivity', summary: 'c', payload: { x: 3 } });
  appendAg21ForecastAuditEntry(ledger, { atTurn: 4, kind: 'domain_matrix', summary: 'd', payload: { x: 4 } });

  push('audit_trim', ledger.entries.length === 3, String(ledger.entries.length));
  const summary = summarizeAg21ForecastAuditLedger(ledger);
  push('audit_summary', summary.count === 3 && summary.authoritative === false, summary.latestSummary);
  push('audit_kinds', (summary.byKind.sensitivity ?? 0) >= 1, JSON.stringify(summary.byKind));

  return out;
}

// --- bundled from forecast-ensemble-projection.ts ---
/**
 * Agent 21 — ensemble projection bands (fuse lab signals on isolated snapshots).
 */


export interface Ag21EnsembleBand {
  label: 'p10' | 'p50' | 'p90';
  projectedCash: number;
  projectedDebt: number;
  uncertainty: Ag21UncertaintyBand;
}

export interface Ag21EnsembleProjection {
  seed: number;
  baselineFingerprint: string;
  bands: Ag21EnsembleBand[];
  dispersion: number;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritativeMutationDetected: boolean;
}

function ag21Percentile(values: number[], p: number): number {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.max(0, Math.floor(p * (sorted.length - 1))));
  return sorted[idx];
}

export function buildAg21EnsembleProjection(ctx: Ag21ForecastContext): Ag21EnsembleProjection {
  const subject: Ag21ForecastContext = { ...ctx, nationalPriorityMomentum: ctx.nationalPriorityMomentum ?? 'stable' };
  const baselineFingerprint = ag21FingerprintSnapshot(subject);

  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    const ladder = buildAg21MultiHorizonProjection(copy);
    const sensitivity = runAg21PolicySensitivitySweep(copy);
    const cashSamples = [
      ...ladder.steps.map(s => s.projectedCash),
      ...sensitivity.rows.map(r => r.projectedCash)
    ];
    const debtSamples = [
      ...ladder.steps.map(s => s.projectedDebt),
      ...sensitivity.rows.map(r => r.projectedDebt)
    ];
    const p10Cash = ag21Percentile(cashSamples, 0.1);
    const p50Cash = ag21Percentile(cashSamples, 0.5);
    const p90Cash = ag21Percentile(cashSamples, 0.9);
    const p10Debt = ag21Percentile(debtSamples, 0.1);
    const p50Debt = ag21Percentile(debtSamples, 0.5);
    const p90Debt = ag21Percentile(debtSamples, 0.9);
    const dispersion = Math.abs(p90Cash - p10Cash) / Math.max(1, Math.abs(p50Cash));

    const bandUncertainty = (spread: number): Ag21UncertaintyBand =>
      spread > 0.55 ? 'high' : spread > 0.25 ? 'moderate' : 'low';

    const bands: Ag21EnsembleBand[] = [
      { label: 'p10', projectedCash: p10Cash, projectedDebt: p10Debt, uncertainty: bandUncertainty(dispersion * 0.8) },
      { label: 'p50', projectedCash: p50Cash, projectedDebt: p50Debt, uncertainty: bandUncertainty(dispersion * 0.5) },
      { label: 'p90', projectedCash: p90Cash, projectedDebt: p90Debt, uncertainty: bandUncertainty(dispersion) }
    ];
    return { bands, dispersion };
  });

  const payload = iso.result as { bands: Ag21EnsembleBand[]; dispersion: number };
  const overallBand: Ag21UncertaintyBand =
    payload.dispersion > 0.55 ? 'high' : payload.dispersion > 0.28 ? 'moderate' : 'low';

  return {
    seed: subject.seed,
    baselineFingerprint,
    bands: payload.bands,
    dispersion: payload.dispersion,
    overallUncertainty: ag21LabelUncertainty(overallBand, [`bands=3`, `dispersion=${payload.dispersion.toFixed(2)}`]),
    authoritativeMutationDetected: baselineFingerprint !== ag21FingerprintSnapshot(subject)
  };
}

export function runAg21EnsembleProjectionSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 7, seed: 58, actorCash: 1100, actorDebt: 140, regionsControlled: 3 };
  const before = ag21FingerprintSnapshot(ctx);
  const ensemble = buildAg21EnsembleProjection(ctx);
  push('ensemble_bands', ensemble.bands.length === 3, String(ensemble.bands.length));
  push('ensemble_order', ensemble.bands[0].projectedCash <= ensemble.bands[2].projectedCash, 'p10<=p90');
  push('ensemble_no_mutation', before === ag21FingerprintSnapshot(ctx), 'fp');
  push('ensemble_non_auth', ensemble.overallUncertainty.playerFacing.includes('Non-authoritative'), 'copy');

  return out;
}

// --- bundled from forecast-calibration-drift.ts ---
/**
 * Agent 21 — calibration drift diagnostics (compare isolated forecast contexts).
 */


export interface Ag21CalibrationDriftReport {
  baselineFingerprint: string;
  candidateFingerprint: string;
  cashDriftPct: number;
  debtDriftPct: number;
  regionDrift: number;
  driftScore: number;
  severity: 'stable' | 'watch' | 'elevated' | 'critical';
  uncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21PctDelta(baseline: number, candidate: number): number {
  return Math.abs(candidate - baseline) / Math.max(1, Math.abs(baseline));
}

function ag21Severity(score: number): Ag21CalibrationDriftReport['severity'] {
  if (score >= 0.65) return 'critical';
  if (score >= 0.4) return 'elevated';
  if (score >= 0.18) return 'watch';
  return 'stable';
}

function ag21BandFromSeverity(severity: Ag21CalibrationDriftReport['severity']): Ag21UncertaintyBand {
  if (severity === 'critical') return 'high';
  if (severity === 'elevated') return 'moderate';
  if (severity === 'watch') return 'moderate';
  return 'low';
}

/** Read-only drift check between two lab contexts (does not mutate either input). */
export function measureAg21CalibrationDrift(
  baseline: Ag21ForecastContext,
  candidate: Ag21ForecastContext
): Ag21CalibrationDriftReport {
  const baselineFingerprint = ag21FingerprintSnapshot(baseline);
  const candidateFingerprint = ag21FingerprintSnapshot(candidate);
  const cashDriftPct = ag21PctDelta(baseline.actorCash, candidate.actorCash);
  const debtDriftPct = ag21PctDelta(baseline.actorDebt, candidate.actorDebt);
  const regionDrift = Math.abs(baseline.regionsControlled - candidate.regionsControlled);
  const driftScore = Math.min(1, cashDriftPct * 0.45 + debtDriftPct * 0.35 + regionDrift * 0.12);
  const severity = ag21Severity(driftScore);

  return {
    baselineFingerprint,
    candidateFingerprint,
    cashDriftPct,
    debtDriftPct,
    regionDrift,
    driftScore,
    severity,
    uncertainty: ag21LabelUncertainty(ag21BandFromSeverity(severity), [`severity=${severity}`]),
    authoritative: false
  };
}

export function runAg21CalibrationDriftSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const base: Ag21ForecastContext = { turn: 4, seed: 10, actorCash: 1000, actorDebt: 100, regionsControlled: 2 };
  const near: Ag21ForecastContext = { ...base, actorCash: 980 };
  const far: Ag21ForecastContext = { ...base, actorCash: 400, actorDebt: 900, regionsControlled: 0 };

  const stable = measureAg21CalibrationDrift(base, near);
  const critical = measureAg21CalibrationDrift(base, far);
  push('drift_stable', stable.severity === 'stable' || stable.severity === 'watch', stable.severity);
  push('drift_critical', critical.severity === 'critical' || critical.severity === 'elevated', critical.severity);
  push('drift_non_auth', stable.authoritative === false && critical.authoritative === false, 'flags');

  return out;
}

// --- bundled from forecast-trajectory-fusion.ts ---
/**
 * Agent 21 — trajectory fusion (scenario + ensemble alignment, read-only).
 */


export interface Ag21TrajectoryFusionPoint {
  scenarioId: string;
  domain: string;
  alignmentScore: number;
  driftSeverity: ReturnType<typeof measureAg21CalibrationDrift>['severity'];
  uncertainty: Ag21UncertaintyBand;
}

export interface Ag21TrajectoryFusionReport {
  points: Ag21TrajectoryFusionPoint[];
  fusionScore: number;
  headline: string;
  overallUncertainty: ReturnType<typeof ag21LabelUncertainty>;
  authoritative: false;
}

function ag21ScenarioContext(base: Ag21ForecastContext, scenarioId: string): Ag21ForecastContext {
  const scenario = lookupAg21Scenario(scenarioId);
  const domainBoost =
    scenario?.domain === 'fiscal' ? -80 :
    scenario?.domain === 'workforce' ? 40 :
    scenario?.domain === 'resilience' ? -120 :
    0;
  return {
    ...base,
    actorCash: Math.max(0, base.actorCash + domainBoost),
    actorDebt: Math.max(0, base.actorDebt + (scenario?.defaultUncertainty === 'high' ? 60 : 20))
  };
}

export function fuseAg21ScenarioTrajectories(
  baseCtx: Ag21ForecastContext,
  scenarioIds: string[]
): Ag21TrajectoryFusionReport {
  const ensemble = buildAg21EnsembleProjection(baseCtx);
  const p50 = ensemble.bands.find(b => b.label === 'p50') ?? ensemble.bands[1];

  const points: Ag21TrajectoryFusionPoint[] = scenarioIds.map(id => {
    const scenario = lookupAg21Scenario(id);
    const candidate = ag21ScenarioContext(baseCtx, id);
    const drift = measureAg21CalibrationDrift(baseCtx, candidate);
    const cashGap = Math.abs((p50?.projectedCash ?? baseCtx.actorCash) - candidate.actorCash);
    const alignmentScore = Math.max(0, 1 - cashGap / Math.max(1, baseCtx.actorCash));
    const uncertainty: Ag21UncertaintyBand =
      drift.severity === 'critical' ? 'high' :
      drift.severity === 'elevated' ? 'moderate' :
      scenario?.defaultUncertainty ?? 'moderate';

    return {
      scenarioId: id,
      domain: scenario?.domain ?? 'unknown',
      alignmentScore,
      driftSeverity: drift.severity,
      uncertainty
    };
  });

  const fusionScore = points.reduce((sum, p) => sum + p.alignmentScore, 0) / Math.max(1, points.length);
  const overallBand: Ag21UncertaintyBand = fusionScore < 0.45 ? 'high' : fusionScore < 0.7 ? 'moderate' : 'low';

  return {
    points,
    fusionScore,
    headline: `Fusion score ${(fusionScore * 100).toFixed(0)}% across ${points.length} scenario trajectories.`,
    overallUncertainty: ag21LabelUncertainty(overallBand, [`ensemble_dispersion=${ensemble.dispersion.toFixed(2)}`]),
    authoritative: false
  };
}

export function runAg21TrajectoryFusionSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 6, seed: 21, actorCash: 950, actorDebt: 80, regionsControlled: 2 };
  const fusion = fuseAg21ScenarioTrajectories(ctx, ['ag21_sc_002', 'ag21_sc_006', 'ag21_sc_012']);
  push('fusion_points', fusion.points.length === 3, String(fusion.points.length));
  push('fusion_score_range', fusion.fusionScore >= 0 && fusion.fusionScore <= 1, String(fusion.fusionScore));
  push('fusion_non_auth', fusion.authoritative === false, fusion.headline);

  return out;
}

// --- bundled from forecast-residual-backtest.ts ---
/**
 * Agent 21 — ensemble residual backtest (p50 vs isolated one-turn realization).
 */


export interface Ag21ResidualBacktestRow {
  metric: 'cash' | 'debt';
  predicted: number;
  realized: number;
  residualPct: number;
  withinBand: boolean;
}

export interface Ag21ResidualBacktestReport {
  baselineFingerprint: string;
  rows: Ag21ResidualBacktestRow[];
  meanAbsoluteResidualPct: number;
  calibrationTone: 'tight' | 'balanced' | 'loose';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritativeMutationDetected: boolean;
}

function ag21PctResidual(predicted: number, realized: number): number {
  return Math.abs(realized - predicted) / Math.max(1, Math.abs(predicted));
}

function ag21RealizeOneTurn(copy: Ag21ForecastContext): { cash: number; debt: number } {
  const income = 32 + copy.regionsControlled * 9 + (copy.seed % 6);
  const spend = 20 + copy.actorDebt * 0.045;
  const momentum = copy.nationalPriorityMomentum ?? 'stable';
  const factor = momentum === 'rising' ? 1.04 : momentum === 'falling' ? 0.95 : 1;
  const cash = Math.round((copy.actorCash + income - spend) * factor);
  const debt = Math.max(0, Math.round(copy.actorDebt * 0.988 - copy.regionsControlled));
  return { cash, debt };
}

function ag21ToneFromMean(mean: number): Ag21ResidualBacktestReport['calibrationTone'] {
  if (mean <= 0.12) return 'tight';
  if (mean <= 0.32) return 'balanced';
  return 'loose';
}

function ag21BandFromMean(mean: number): Ag21UncertaintyBand {
  if (mean > 0.38) return 'high';
  if (mean > 0.18) return 'moderate';
  return 'low';
}

/** Compare ensemble p50 to an isolated one-turn realization (lab backtest, read-only). */
export function runAg21EnsembleResidualBacktest(ctx: Ag21ForecastContext): Ag21ResidualBacktestReport {
  const subject: Ag21ForecastContext = { ...ctx, nationalPriorityMomentum: ctx.nationalPriorityMomentum ?? 'stable' };
  const baselineFingerprint = ag21FingerprintSnapshot(subject);

  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    const ensemble = buildAg21EnsembleProjection(copy);
    const p10 = ensemble.bands.find(b => b.label === 'p10');
    const p50 = ensemble.bands.find(b => b.label === 'p50');
    const p90 = ensemble.bands.find(b => b.label === 'p90');
    const realized = ag21RealizeOneTurn(copy);
    const sensitivity = runAg21PolicySensitivitySweep(copy);
    const baselineRow = sensitivity.rows[0];

    const cashPredicted = p50?.projectedCash ?? baselineRow?.projectedCash ?? copy.actorCash;
    const debtPredicted = p50?.projectedDebt ?? baselineRow?.projectedDebt ?? copy.actorDebt;

    const cashLow = Math.min(p10?.projectedCash ?? cashPredicted, cashPredicted);
    const cashHigh = Math.max(p90?.projectedCash ?? cashPredicted, cashPredicted);
    const debtLow = Math.min(p10?.projectedDebt ?? debtPredicted, debtPredicted);
    const debtHigh = Math.max(p90?.projectedDebt ?? debtPredicted, debtPredicted);

    const rows: Ag21ResidualBacktestRow[] = [
      {
        metric: 'cash',
        predicted: cashPredicted,
        realized: realized.cash,
        residualPct: ag21PctResidual(cashPredicted, realized.cash),
        withinBand: realized.cash >= cashLow && realized.cash <= cashHigh
      },
      {
        metric: 'debt',
        predicted: debtPredicted,
        realized: realized.debt,
        residualPct: ag21PctResidual(debtPredicted, realized.debt),
        withinBand: realized.debt >= debtLow && realized.debt <= debtHigh
      }
    ];

    const meanAbsoluteResidualPct =
      rows.reduce((sum, r) => sum + r.residualPct, 0) / Math.max(1, rows.length);

    return { rows, meanAbsoluteResidualPct };
  });

  const payload = iso.result as { rows: Ag21ResidualBacktestRow[]; meanAbsoluteResidualPct: number };
  const tone = ag21ToneFromMean(payload.meanAbsoluteResidualPct);

  return {
    baselineFingerprint,
    rows: payload.rows,
    meanAbsoluteResidualPct: payload.meanAbsoluteResidualPct,
    calibrationTone: tone,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromMean(payload.meanAbsoluteResidualPct), [`tone=${tone}`]),
    authoritativeMutationDetected: baselineFingerprint !== ag21FingerprintSnapshot(subject)
  };
}

export function runAg21ResidualBacktestSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 8, seed: 31, actorCash: 880, actorDebt: 90, regionsControlled: 3 };
  const before = ag21FingerprintSnapshot(ctx);
  const report = runAg21EnsembleResidualBacktest(ctx);

  push('backtest_rows', report.rows.length === 2, String(report.rows.length));
  push('backtest_mean_range', report.meanAbsoluteResidualPct >= 0 && report.meanAbsoluteResidualPct <= 2, String(report.meanAbsoluteResidualPct));
  push('backtest_no_mutation', before === ag21FingerprintSnapshot(ctx), 'fp');
  push('backtest_non_auth', report.overallUncertainty.playerFacing.includes('Non-authoritative'), 'copy');

  return out;
}

// --- bundled from forecast-policy-regret.ts ---
/**
 * Agent 21 — policy regret ranking (counterfactual branches vs baseline ladder).
 */


export interface Ag21PolicyRegretRow {
  branchId: string;
  label: string;
  regretScore: number;
  cashDeltaVsBaseline: number;
  debtDeltaVsBaseline: number;
  uncertainty: Ag21UncertaintyBand;
}

export interface Ag21PolicyRegretRanking {
  baselineFingerprint: string;
  baselineHorizonCash: number;
  rows: Ag21PolicyRegretRow[];
  lowestRegretBranchId: string | null;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritativeMutationDetected: boolean;
}

const AG21_REGRET_BRANCHES = [
  { branchId: 'ag21_regret_fiscal_tight', label: 'Fiscal tightening fork', cashScale: 0.92, debtBump: 30 },
  { branchId: 'ag21_regret_invest_regions', label: 'Region investment fork', cashScale: 0.88, debtBump: 10, regionBump: 1 },
  { branchId: 'ag21_regret_debt_relief', label: 'Debt relief fork', cashScale: 1.02, debtBump: -40 },
  { branchId: 'ag21_regret_momentum_push', label: 'Momentum push fork', cashScale: 1.05, debtBump: 15, momentum: 'rising' as const }
] as const;

function ag21BandFromRegret(score: number): Ag21UncertaintyBand {
  if (score > 0.55) return 'high';
  if (score > 0.28) return 'moderate';
  return 'low';
}

function ag21HorizonTail(ctx: Ag21ForecastContext): { cash: number; debt: number } {
  const ladder = buildAg21MultiHorizonProjection(ctx);
  const last = ladder.steps[ladder.steps.length - 1];
  return {
    cash: last?.projectedCash ?? ctx.actorCash,
    debt: last?.projectedDebt ?? ctx.actorDebt
  };
}

/** Rank isolated counterfactual branches by regret vs baseline horizon cash (lab-only). */
export function rankAg21PolicyRegret(ctx: Ag21ForecastContext): Ag21PolicyRegretRanking {
  const subject: Ag21ForecastContext = { ...ctx, nationalPriorityMomentum: ctx.nationalPriorityMomentum ?? 'stable' };
  const baselineFingerprint = ag21FingerprintSnapshot(subject);

  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    const baseline = ag21HorizonTail(copy);
    const rows: Ag21PolicyRegretRow[] = AG21_REGRET_BRANCHES.map(spec => {
      const forkCtx: Ag21ForecastContext = {
        ...copy,
        actorCash: Math.round(copy.actorCash * spec.cashScale),
        actorDebt: Math.max(0, copy.actorDebt + spec.debtBump),
        regionsControlled: copy.regionsControlled + ('regionBump' in spec ? spec.regionBump ?? 0 : 0),
        nationalPriorityMomentum: 'momentum' in spec ? spec.momentum : copy.nationalPriorityMomentum
      };
      const branch = ag21HorizonTail(forkCtx);
      const cashDeltaVsBaseline = branch.cash - baseline.cash;
      const debtDeltaVsBaseline = branch.debt - baseline.debt;
      const regretScore = Math.min(
        1,
        Math.abs(cashDeltaVsBaseline) / Math.max(1, baseline.cash) * 0.65 +
          Math.abs(debtDeltaVsBaseline) / Math.max(1, baseline.debt) * 0.35
      );

      return {
        branchId: spec.branchId,
        label: spec.label,
        regretScore,
        cashDeltaVsBaseline,
        debtDeltaVsBaseline,
        uncertainty: ag21BandFromRegret(regretScore)
      };
    }).sort((a, b) => a.regretScore - b.regretScore);

    return { baselineHorizonCash: baseline.cash, rows };
  });

  const payload = iso.result as { baselineHorizonCash: number; rows: Ag21PolicyRegretRow[] };
  const bands = payload.rows.map(r => r.uncertainty);
  const overallBand: Ag21UncertaintyBand = bands.includes('high')
    ? 'high'
    : bands.includes('moderate')
      ? 'moderate'
      : 'low';

  return {
    baselineFingerprint,
    baselineHorizonCash: payload.baselineHorizonCash,
    rows: payload.rows,
    lowestRegretBranchId: payload.rows[0]?.branchId ?? null,
    overallUncertainty: ag21LabelUncertainty(overallBand, [`branches=${payload.rows.length}`]),
    authoritativeMutationDetected: baselineFingerprint !== ag21FingerprintSnapshot(subject)
  };
}

export function runAg21PolicyRegretSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 7, seed: 52, actorCash: 920, actorDebt: 110, regionsControlled: 2 };
  const before = ag21FingerprintSnapshot(ctx);
  const ranking = rankAg21PolicyRegret(ctx);

  push('regret_row_count', ranking.rows.length === AG21_REGRET_BRANCHES.length, String(ranking.rows.length));
  push('regret_sorted', ranking.rows.every((r, i, arr) => !i || arr[i - 1].regretScore <= r.regretScore), 'order');
  push('regret_lowest', ranking.lowestRegretBranchId === ranking.rows[0]?.branchId, ranking.lowestRegretBranchId ?? 'none');
  push('regret_no_mutation', before === ag21FingerprintSnapshot(ctx), 'fp');

  return out;
}

// --- bundled from forecast-reliability-gates.ts ---
/**
 * Agent 21 — reliability gates (ensemble + drift + fusion composite, read-only).
 */


export interface Ag21ReliabilityGate {
  id: 'ensemble_dispersion' | 'calibration_drift' | 'trajectory_fusion';
  passed: boolean;
  score: number;
  detail: string;
}

export interface Ag21ReliabilityGateReport {
  gates: Ag21ReliabilityGate[];
  passCount: number;
  overallPass: boolean;
  playerGuidance: 'proceed_with_caution' | 'hold_for_review' | 'do_not_surface';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21GuidanceFromGates(passCount: number, gates: Ag21ReliabilityGate[]): Ag21ReliabilityGateReport['playerGuidance'] {
  if (passCount >= 3) return 'proceed_with_caution';
  if (passCount >= 1) return 'hold_for_review';
  return 'do_not_surface';
}

function ag21BandFromPass(passCount: number): Ag21UncertaintyBand {
  if (passCount >= 3) return 'low';
  if (passCount >= 2) return 'moderate';
  return 'high';
}

/** Evaluate whether lab signals are reliable enough for player-facing surfacing (non-authoritative). */
export function evaluateAg21ReliabilityGates(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ReliabilityGateReport {
  const ensemble = buildAg21EnsembleProjection(baseCtx);
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.82),
      actorDebt: baseCtx.actorDebt + 150
    } satisfies Ag21ForecastContext);

  const drift = measureAg21CalibrationDrift(baseCtx, candidate);
  const fusion = fuseAg21ScenarioTrajectories(baseCtx, ['ag21_sc_004', 'ag21_sc_011', 'ag21_sc_018', 'ag21_sc_022']);

  const gates: Ag21ReliabilityGate[] = [
    {
      id: 'ensemble_dispersion',
      passed: ensemble.dispersion <= 0.62,
      score: Math.max(0, 1 - ensemble.dispersion),
      detail: `dispersion=${ensemble.dispersion.toFixed(2)}`
    },
    {
      id: 'calibration_drift',
      passed: drift.severity === 'stable' || drift.severity === 'watch',
      score: Math.max(0, 1 - drift.driftScore),
      detail: `severity=${drift.severity}`
    },
    {
      id: 'trajectory_fusion',
      passed: fusion.fusionScore >= 0.42,
      score: fusion.fusionScore,
      detail: `fusion=${fusion.fusionScore.toFixed(2)}`
    }
  ];

  const passCount = gates.filter(g => g.passed).length;
  const overallPass = passCount === gates.length;

  return {
    gates,
    passCount,
    overallPass,
    playerGuidance: ag21GuidanceFromGates(passCount, gates),
    overallUncertainty: ag21LabelUncertainty(ag21BandFromPass(passCount), [`pass=${passCount}/${gates.length}`]),
    authoritative: false
  };
}

export function runAg21ReliabilityGatesSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 9, seed: 18, actorCash: 1000, actorDebt: 70, regionsControlled: 3 };
  const report = evaluateAg21ReliabilityGates(ctx);

  push('gates_count', report.gates.length === 3, String(report.gates.length));
  push('gates_pass_range', report.passCount >= 0 && report.passCount <= 3, String(report.passCount));
  push('gates_non_auth', report.authoritative === false, String(report.overallPass));
  push('gates_guidance', ['proceed_with_caution', 'hold_for_review', 'do_not_surface'].includes(report.playerGuidance), report.playerGuidance);

  return out;
}

// --- bundled from forecast-horizon-volatility.ts ---
/**
 * Agent 21 — multi-horizon ladder volatility (step-to-step spread, read-only).
 */


export interface Ag21HorizonVolatilityMetric {
  metric: 'cash' | 'debt';
  stepCount: number;
  meanStepDelta: number;
  maxStepDeltaPct: number;
  volatilityIndex: number;
}

export interface Ag21HorizonVolatilityReport {
  baselineFingerprint: string;
  metrics: Ag21HorizonVolatilityMetric[];
  compositeVolatility: number;
  stabilityTone: 'steady' | 'wobbly' | 'chaotic';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritativeMutationDetected: boolean;
}

function ag21StepDeltas(values: number[]): number[] {
  const deltas: number[] = [];
  for (let i = 1; i < values.length; i++) {
    deltas.push(Math.abs(values[i] - values[i - 1]));
  }
  return deltas;
}

function ag21VolatilityIndex(deltas: number[], baseline: number): number {
  if (!deltas.length) return 0;
  const mean = deltas.reduce((s, d) => s + d, 0) / deltas.length;
  const denom = Math.max(1, Math.abs(baseline));
  return Math.min(1, (mean / denom) * 0.85 + (Math.max(...deltas) / denom) * 0.15);
}

function ag21ToneFromComposite(v: number): Ag21HorizonVolatilityReport['stabilityTone'] {
  if (v <= 0.22) return 'steady';
  if (v <= 0.48) return 'wobbly';
  return 'chaotic';
}

function ag21BandFromComposite(v: number): Ag21UncertaintyBand {
  if (v > 0.52) return 'high';
  if (v > 0.28) return 'moderate';
  return 'low';
}

/** Measure ladder step volatility for cash/debt (isolated multi-horizon projection). */
export function measureAg21HorizonVolatility(ctx: Ag21ForecastContext): Ag21HorizonVolatilityReport {
  const subject: Ag21ForecastContext = { ...ctx, nationalPriorityMomentum: ctx.nationalPriorityMomentum ?? 'stable' };
  const baselineFingerprint = ag21FingerprintSnapshot(subject);

  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    const ladder = buildAg21MultiHorizonProjection(copy);
    const cashSeries = ladder.steps.map(s => s.projectedCash);
    const debtSeries = ladder.steps.map(s => s.projectedDebt);

    const buildMetric = (metric: 'cash' | 'debt', series: number[]): Ag21HorizonVolatilityMetric => {
      const deltas = ag21StepDeltas(series);
      const baseline = series[0] ?? copy.actorCash;
      const meanStepDelta = deltas.length ? deltas.reduce((s, d) => s + d, 0) / deltas.length : 0;
      const maxStepDeltaPct = deltas.length
        ? Math.max(...deltas) / Math.max(1, Math.abs(baseline))
        : 0;
      return {
        metric,
        stepCount: series.length,
        meanStepDelta,
        maxStepDeltaPct,
        volatilityIndex: ag21VolatilityIndex(deltas, baseline)
      };
    };

    const metrics = [
      buildMetric('cash', cashSeries),
      buildMetric('debt', debtSeries)
    ];
    const compositeVolatility =
      metrics.reduce((sum, m) => sum + m.volatilityIndex, 0) / Math.max(1, metrics.length);

    return { metrics, compositeVolatility };
  });

  const payload = iso.result as { metrics: Ag21HorizonVolatilityMetric[]; compositeVolatility: number };
  const tone = ag21ToneFromComposite(payload.compositeVolatility);

  return {
    baselineFingerprint,
    metrics: payload.metrics,
    compositeVolatility: payload.compositeVolatility,
    stabilityTone: tone,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromComposite(payload.compositeVolatility), [`tone=${tone}`]),
    authoritativeMutationDetected: baselineFingerprint !== ag21FingerprintSnapshot(subject)
  };
}

export function runAg21HorizonVolatilitySelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 11, seed: 22, actorCash: 940, actorDebt: 55, regionsControlled: 4 };
  const before = ag21FingerprintSnapshot(ctx);
  const report = measureAg21HorizonVolatility(ctx);

  push('vol_metrics', report.metrics.length === 2, String(report.metrics.length));
  push('vol_composite_range', report.compositeVolatility >= 0 && report.compositeVolatility <= 1, String(report.compositeVolatility));
  push('vol_no_mutation', before === ag21FingerprintSnapshot(ctx), 'fp');
  push('vol_tone', ['steady', 'wobbly', 'chaotic'].includes(report.stabilityTone), report.stabilityTone);

  return out;
}

// --- bundled from forecast-lever-attribution.ts ---
/**
 * Agent 21 — sensitivity lever attribution (share of ensemble spread, read-only).
 */


export interface Ag21LeverAttributionRow {
  lever: string;
  attributedShare: number;
  sensitivityScore: number;
  uncertainty: Ag21UncertaintyBand;
}

export interface Ag21LeverAttributionReport {
  baselineFingerprint: string;
  ensembleDispersion: number;
  rows: Ag21LeverAttributionRow[];
  topLever: string | null;
  concentrationIndex: number;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritativeMutationDetected: boolean;
}

function ag21BandFromConcentration(c: number): Ag21UncertaintyBand {
  if (c > 0.72) return 'high';
  if (c > 0.45) return 'moderate';
  return 'low';
}

/** Attribute ensemble dispersion to policy sensitivity levers (lab-only). */
export function buildAg21LeverAttributionReport(ctx: Ag21ForecastContext): Ag21LeverAttributionReport {
  const subject: Ag21ForecastContext = { ...ctx, nationalPriorityMomentum: ctx.nationalPriorityMomentum ?? 'stable' };
  const baselineFingerprint = ag21FingerprintSnapshot(subject);

  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    const ensemble = buildAg21EnsembleProjection(copy);
    const sweep = runAg21PolicySensitivitySweep(copy);
    const totalSensitivity = sweep.rows.reduce((sum, r) => sum + r.sensitivityScore, 0) || 1;

    const byLever = new Map<string, { score: number; band: Ag21UncertaintyBand }>();
    for (const row of sweep.rows) {
      const prev = byLever.get(row.lever) ?? { score: 0, band: row.uncertainty };
      byLever.set(row.lever, {
        score: prev.score + row.sensitivityScore,
        band: row.uncertainty === 'high' || prev.band === 'high' ? 'high' : row.uncertainty
      });
    }

    const rows: Ag21LeverAttributionRow[] = [...byLever.entries()]
      .map(([lever, agg]) => ({
        lever,
        sensitivityScore: agg.score,
        attributedShare: agg.score / totalSensitivity,
        uncertainty: agg.band
      }))
      .sort((a, b) => b.attributedShare - a.attributedShare);

    const top = rows[0] ?? null;
    const concentrationIndex = top ? top.attributedShare : 0;

    return {
      ensembleDispersion: ensemble.dispersion,
      rows,
      topLever: top?.lever ?? null,
      concentrationIndex
    };
  });

  const payload = iso.result as {
    ensembleDispersion: number;
    rows: Ag21LeverAttributionRow[];
    topLever: string | null;
    concentrationIndex: number;
  };

  return {
    baselineFingerprint,
    ensembleDispersion: payload.ensembleDispersion,
    rows: payload.rows,
    topLever: payload.topLever,
    concentrationIndex: payload.concentrationIndex,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromConcentration(payload.concentrationIndex), [
      `top=${payload.topLever ?? 'none'}`
    ]),
    authoritativeMutationDetected: baselineFingerprint !== ag21FingerprintSnapshot(subject)
  };
}

export function runAg21LeverAttributionSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 7, seed: 44, actorCash: 720, actorDebt: 110, regionsControlled: 2 };
  const report = buildAg21LeverAttributionReport(ctx);

  push('attrib_rows', report.rows.length >= 3, String(report.rows.length));
  push('attrib_share_sum', report.rows.reduce((s, r) => s + r.attributedShare, 0) > 0.95, String(report.rows.length));
  push('attrib_dispersion', report.ensembleDispersion >= 0, String(report.ensembleDispersion));
  push('attrib_top', report.topLever !== null, report.topLever ?? 'none');

  return out;
}

// --- bundled from forecast-surfacing-scorecard.ts ---
/**
 * Agent 21 — player surfacing scorecard (gates + backtest + regret composite, read-only).
 */


export interface Ag21SurfacingScorecard {
  readinessScore: number;
  tier: 'green' | 'amber' | 'red';
  gatePassRatio: number;
  backtestTone: ReturnType<typeof runAg21EnsembleResidualBacktest>['calibrationTone'];
  regretSpread: number;
  horizonStability: ReturnType<typeof measureAg21HorizonVolatility>['stabilityTone'];
  playerGuidance: 'surface_brief' | 'surface_with_caveats' | 'suppress';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21TierFromScore(score: number): Ag21SurfacingScorecard['tier'] {
  if (score >= 72) return 'green';
  if (score >= 45) return 'amber';
  return 'red';
}

function ag21GuidanceFromTier(tier: Ag21SurfacingScorecard['tier']): Ag21SurfacingScorecard['playerGuidance'] {
  if (tier === 'green') return 'surface_brief';
  if (tier === 'amber') return 'surface_with_caveats';
  return 'suppress';
}

function ag21BandFromTier(tier: Ag21SurfacingScorecard['tier']): Ag21UncertaintyBand {
  if (tier === 'green') return 'low';
  if (tier === 'amber') return 'moderate';
  return 'high';
}

function ag21ToneScore(tone: Ag21SurfacingScorecard['backtestTone']): number {
  if (tone === 'tight') return 28;
  if (tone === 'balanced') return 18;
  return 8;
}

function ag21StabilityScore(tone: Ag21SurfacingScorecard['horizonStability']): number {
  if (tone === 'steady') return 22;
  if (tone === 'wobbly') return 12;
  return 4;
}

/** Composite scorecard for whether lab outputs may surface to players (non-authoritative). */
export function buildAg21SurfacingScorecard(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21SurfacingScorecard {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.8),
      actorDebt: baseCtx.actorDebt + 120
    } satisfies Ag21ForecastContext);

  const gates = evaluateAg21ReliabilityGates(baseCtx, candidate);
  const backtest = runAg21EnsembleResidualBacktest(baseCtx);
  const regret = rankAg21PolicyRegret(baseCtx);
  const volatility = measureAg21HorizonVolatility(baseCtx);

  const gatePassRatio = gates.passCount / Math.max(1, gates.gates.length);
  const regretSpread =
    regret.rows.length >= 2
      ? Math.abs(regret.rows[regret.rows.length - 1].regretScore - regret.rows[0].regretScore)
      : 0;

  const readinessScore = Math.min(
    100,
    Math.round(
      gatePassRatio * 40 +
        ag21ToneScore(backtest.calibrationTone) +
        ag21StabilityScore(volatility.stabilityTone) +
        Math.max(0, 10 - regretSpread * 12)
    )
  );

  const tier = ag21TierFromScore(readinessScore);

  return {
    readinessScore,
    tier,
    gatePassRatio,
    backtestTone: backtest.calibrationTone,
    regretSpread,
    horizonStability: volatility.stabilityTone,
    playerGuidance: ag21GuidanceFromTier(tier),
    overallUncertainty: ag21LabelUncertainty(ag21BandFromTier(tier), [`score=${readinessScore}`]),
    authoritative: false
  };
}

export function runAg21SurfacingScorecardSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 10, seed: 19, actorCash: 1050, actorDebt: 65, regionsControlled: 3 };
  const card = buildAg21SurfacingScorecard(ctx);

  push('score_range', card.readinessScore >= 0 && card.readinessScore <= 100, String(card.readinessScore));
  push('score_tier', ['green', 'amber', 'red'].includes(card.tier), card.tier);
  push('score_guidance', ['surface_brief', 'surface_with_caveats', 'suppress'].includes(card.playerGuidance), card.playerGuidance);
  push('score_non_auth', card.authoritative === false, String(card.readinessScore));

  return out;
}

// --- bundled from forecast-ensemble-convergence.ts ---
/**
 * Agent 21 — ensemble vs trajectory fusion convergence (read-only round 6).
 */


export interface Ag21EnsembleConvergenceReport {
  baselineFingerprint: string;
  ensembleDispersion: number;
  fusionScore: number;
  convergenceGap: number;
  convergenceTone: 'aligned' | 'drifting' | 'divergent';
  scenarioSampleCount: number;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritativeMutationDetected: boolean;
}

const AG21_DEFAULT_FUSION_SCENARIOS = ['ag21_sc_003', 'ag21_sc_009', 'ag21_sc_014', 'ag21_sc_027'];

function ag21ToneFromGap(gap: number): Ag21EnsembleConvergenceReport['convergenceTone'] {
  if (gap <= 0.28) return 'aligned';
  if (gap <= 0.52) return 'drifting';
  return 'divergent';
}

function ag21BandFromGap(gap: number): Ag21UncertaintyBand {
  if (gap > 0.55) return 'high';
  if (gap > 0.32) return 'moderate';
  return 'low';
}

/** Compare ensemble dispersion against scenario fusion alignment (lab-only). */
export function measureAg21EnsembleConvergence(
  ctx: Ag21ForecastContext,
  scenarioIds: string[] = AG21_DEFAULT_FUSION_SCENARIOS
): Ag21EnsembleConvergenceReport {
  const subject: Ag21ForecastContext = { ...ctx, nationalPriorityMomentum: ctx.nationalPriorityMomentum ?? 'stable' };
  const baselineFingerprint = ag21FingerprintSnapshot(subject);

  const iso = ag21VerifyIsolatedExperiment(subject, copy => {
    const ensemble = buildAg21EnsembleProjection(copy);
    const fusion = fuseAg21ScenarioTrajectories(copy, scenarioIds);
    const normalizedDispersion = Math.min(1, ensemble.dispersion);
    const convergenceGap = Math.abs(normalizedDispersion - (1 - fusion.fusionScore));
    return {
      ensembleDispersion: ensemble.dispersion,
      fusionScore: fusion.fusionScore,
      convergenceGap,
      scenarioSampleCount: scenarioIds.length
    };
  });

  const payload = iso.result as {
    ensembleDispersion: number;
    fusionScore: number;
    convergenceGap: number;
    scenarioSampleCount: number;
  };

  return {
    baselineFingerprint,
    ensembleDispersion: payload.ensembleDispersion,
    fusionScore: payload.fusionScore,
    convergenceGap: payload.convergenceGap,
    convergenceTone: ag21ToneFromGap(payload.convergenceGap),
    scenarioSampleCount: payload.scenarioSampleCount,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromGap(payload.convergenceGap), [
      `gap=${payload.convergenceGap.toFixed(2)}`
    ]),
    authoritativeMutationDetected: baselineFingerprint !== ag21FingerprintSnapshot(subject)
  };
}

export function runAg21EnsembleConvergenceSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 9, seed: 33, actorCash: 880, actorDebt: 95, regionsControlled: 2 };
  const report = measureAg21EnsembleConvergence(ctx);

  push('conv_gap_range', report.convergenceGap >= 0 && report.convergenceGap <= 1.5, String(report.convergenceGap));
  push('conv_tone', ['aligned', 'drifting', 'divergent'].includes(report.convergenceTone), report.convergenceTone);
  push('conv_fusion', report.fusionScore >= 0 && report.fusionScore <= 1, String(report.fusionScore));
  push('conv_samples', report.scenarioSampleCount === AG21_DEFAULT_FUSION_SCENARIOS.length, String(report.scenarioSampleCount));

  return out;
}

// --- bundled from forecast-player-brief.ts ---
/**
 * Agent 21 — player-facing forecast brief assembler (scorecard stack, read-only).
 */


export interface Ag21PlayerForecastBrief {
  headline: string;
  bullets: string[];
  readinessScore: number;
  surfacingTier: ReturnType<typeof buildAg21SurfacingScorecard>['tier'];
  convergenceTone: ReturnType<typeof measureAg21EnsembleConvergence>['convergenceTone'];
  topLever: string | null;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Assemble a non-authoritative player brief from round 5–6 lab signals. */
export function assembleAg21PlayerForecastBrief(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21PlayerForecastBrief {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.8),
      actorDebt: baseCtx.actorDebt + 120
    } satisfies Ag21ForecastContext);

  const scorecard = buildAg21SurfacingScorecard(baseCtx, candidate);
  const volatility = measureAg21HorizonVolatility(baseCtx);
  const attribution = buildAg21LeverAttributionReport(baseCtx);
  const convergence = measureAg21EnsembleConvergence(baseCtx);

  const bullets = [
    `Readiness ${scorecard.readinessScore}/100 (${scorecard.tier}) · guidance ${scorecard.playerGuidance}.`,
    `Horizon stability ${volatility.stabilityTone}; volatility index ${volatility.compositeVolatility.toFixed(2)}.`,
    `Top sensitivity lever ${attribution.topLever ?? 'none'}; convergence ${convergence.convergenceTone}.`
  ];

  const headline = `Forecast brief · ${scorecard.playerGuidance.replace(/_/g, ' ')} · ${convergence.convergenceTone} ensemble/fusion.`;

  return {
    headline,
    bullets,
    readinessScore: scorecard.readinessScore,
    surfacingTier: scorecard.tier,
    convergenceTone: convergence.convergenceTone,
    topLever: attribution.topLever,
    overallUncertainty: ag21LabelUncertainty(scorecard.overallUncertainty.band, [
      ...scorecard.overallUncertainty.factors,
      `convergence=${convergence.convergenceTone}`
    ]),
    authoritative: false
  };
}

export function runAg21PlayerBriefSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 11, seed: 26, actorCash: 990, actorDebt: 70, regionsControlled: 3 };
  const brief = assembleAg21PlayerForecastBrief(ctx);

  push('brief_bullets', brief.bullets.length === 3, String(brief.bullets.length));
  push('brief_headline', brief.headline.includes('Forecast brief'), brief.headline);
  push('brief_readiness', brief.readinessScore >= 0 && brief.readinessScore <= 100, String(brief.readinessScore));
  push('brief_non_auth', brief.authoritative === false, brief.headline);

  return out;
}

// --- bundled from forecast-lab-playbook.ts ---
/**
 * Agent 21 — lab operator playbook hints (regret + gates + brief, read-only).
 */


export interface Ag21LabPlaybookHint {
  id: string;
  priority: 'high' | 'medium' | 'low';
  action: string;
  rationale: string;
}

export interface Ag21LabPlaybook {
  hints: Ag21LabPlaybookHint[];
  lowestRegretBranchId: string | null;
  gatePassRatio: number;
  briefHeadline: string;
  operatorMode: 'investigate' | 'monitor' | 'surface';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21OperatorMode(
  gatePassRatio: number,
  readinessScore: number
): Ag21LabPlaybook['operatorMode'] {
  if (gatePassRatio >= 0.66 && readinessScore >= 60) return 'surface';
  if (gatePassRatio >= 0.33 || readinessScore >= 45) return 'monitor';
  return 'investigate';
}

function ag21BandFromMode(mode: Ag21LabPlaybook['operatorMode']): Ag21UncertaintyBand {
  if (mode === 'surface') return 'low';
  if (mode === 'monitor') return 'moderate';
  return 'high';
}

/** Build operator playbook hints from regret, gates, and assembled brief. */
export function buildAg21LabPlaybook(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabPlaybook {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.78),
      actorDebt: baseCtx.actorDebt + 160
    } satisfies Ag21ForecastContext);

  const gates = evaluateAg21ReliabilityGates(baseCtx, candidate);
  const regret = rankAg21PolicyRegret(baseCtx);
  const brief = assembleAg21PlayerForecastBrief(baseCtx, candidate);

  const gatePassRatio = gates.passCount / Math.max(1, gates.gates.length);
  const hints: Ag21LabPlaybookHint[] = [];

  if (gatePassRatio < 0.66) {
    hints.push({
      id: 'recheck_gates',
      priority: 'high',
      action: 'Re-run reliability gates after adjusting stress context.',
      rationale: `Only ${gates.passCount}/${gates.gates.length} gates passed.`
    });
  }

  if (regret.rows.length >= 2) {
    const spread = Math.abs(regret.rows[regret.rows.length - 1].regretScore - regret.rows[0].regretScore);
    if (spread > 0.35) {
      hints.push({
        id: 'compare_regret',
        priority: 'medium',
        action: `Compare branch ${regret.lowestRegretBranchId ?? 'baseline'} against highest-regret path.`,
        rationale: `Regret spread ${spread.toFixed(2)} exceeds comfort band.`
      });
    }
  }

  if (brief.convergenceTone === 'divergent') {
    hints.push({
      id: 'fusion_reconcile',
      priority: 'high',
      action: 'Reconcile ensemble dispersion with scenario fusion before surfacing.',
      rationale: 'Ensemble/fusion convergence is divergent.'
    });
  } else if (brief.surfacingTier === 'green') {
    hints.push({
      id: 'surface_brief',
      priority: 'low',
      action: 'Brief may surface with standard non-authoritative disclaimer.',
      rationale: brief.headline
    });
  }

  if (!hints.length) {
    hints.push({
      id: 'hold_monitor',
      priority: 'medium',
      action: 'Continue monitoring; no urgent lab intervention required.',
      rationale: `Operator mode ${ag21OperatorMode(gatePassRatio, brief.readinessScore)}.`
    });
  }

  const operatorMode = ag21OperatorMode(gatePassRatio, brief.readinessScore);

  return {
    hints,
    lowestRegretBranchId: regret.lowestRegretBranchId,
    gatePassRatio,
    briefHeadline: brief.headline,
    operatorMode,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromMode(operatorMode), [`mode=${operatorMode}`]),
    authoritative: false
  };
}

export function runAg21LabPlaybookSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 8, seed: 52, actorCash: 810, actorDebt: 140, regionsControlled: 2 };
  const playbook = buildAg21LabPlaybook(ctx);

  push('playbook_hints', playbook.hints.length >= 1, String(playbook.hints.length));
  push('playbook_mode', ['investigate', 'monitor', 'surface'].includes(playbook.operatorMode), playbook.operatorMode);
  push('playbook_ratio', playbook.gatePassRatio >= 0 && playbook.gatePassRatio <= 1, String(playbook.gatePassRatio));
  push('playbook_non_auth', playbook.authoritative === false, playbook.briefHeadline);

  return out;
}

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

// --- bundled from forecast-depth-panel.tsx ---
/**
 * Agent 21 — forecast lab depth panel (multi-horizon + batch scenario review).
 */


export const Ag21ForecastDepthPanel: React.FC<{ seed?: number; compact?: boolean }> = ({ seed = 17, compact }) => {
  const [batchSeed, setBatchSeed] = useState(seed);
  const ctx = useMemo(() => createDefaultAg21ForecastContext({ seed: batchSeed, turn: 8 }), [batchSeed]);

  const projection = useMemo(() => buildAg21MultiHorizonProjection(ctx), [ctx]);
  const batch = useMemo(
    () => runAg21ScenarioBatchComparison(['ag21_sc_000', 'ag21_sc_006', 'ag21_sc_012', 'ag21_sc_018']),
    []
  );
  const depth = useMemo(() => {
    const pseudoBundle: Ag21ForecastBundle = {
      generatedAtTurn: ctx.turn,
      authoritativeMutationDetected: false,
      overallUncertainty: projection.overallUncertainty,
      experiments: batch.pairwise.map((pair, idx) => ({
        id: `ag21_depth_pair_${idx}`,
        label: pair.summary,
        domain: pair.sameDomain ? 'balance' : 'cross_domain',
        horizons: [
          {
            turns: 4 + idx,
            uncertainty: pair.uncertaintyDelta >= 2 ? 'high' : 'moderate',
            summary: pair.summary,
            metrics: { similarity: pair.titleSimilarity }
          }
        ],
        uncertainty: ag21LabelUncertainty(pair.uncertaintyDelta >= 2 ? 'high' : 'moderate'),
        provenance: {
          authoritative: false,
          label: 'projection',
          sourceSystems: ['Agent21 Forecast Depth Panel'],
          isolatedCopyVerified: true,
          fingerprintBefore: 'depth',
          fingerprintAfter: 'depth',
          disclaimer: 'non-authoritative'
        },
        notes: []
      }))
    };
    return summarizeAg21ForecastBundleDepth(pseudoBundle);
  }, [batch, ctx.turn, projection.overallUncertainty]);
  const stress = useMemo(() => runAg21CounterfactualStressLadder(ctx), [ctx]);

  return (
    <div
      className="border border-emerald-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2"
      data-testid="ag21-forecast-depth-panel"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="font-bold text-emerald-200">
          🧪 Forecast Lab Depth <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
        </div>
        {!compact && (
          <label className="flex items-center gap-1">
            Seed
            <input
              type="number"
              className="w-16 bg-slate-900 border border-slate-600 rounded px-1"
              value={batchSeed}
              onChange={e => setBatchSeed(Number(e.target.value) || 1)}
            />
          </label>
        )}
      </div>
      <div className="text-[10px] text-amber-200/90" data-testid="ag21-depth-headline">
        {batch.headline} · stress branches={stress.ladder.branches.length}
      </div>
      <div className="grid grid-cols-2 gap-2" data-testid="ag21-depth-metrics">
        <div className="rounded bg-slate-900/60 p-2 border border-slate-700/50">
          <div className="font-semibold text-emerald-100">Bundle depth</div>
          <div>Score {(depth.experimentScore * 100).toFixed(0)}% · domains {depth.domainCount}</div>
          <div>Worst uncertainty: {depth.worstUncertainty}</div>
        </div>
        <div className="rounded bg-slate-900/60 p-2 border border-slate-700/50">
          <div className="font-semibold text-emerald-100">Horizon ladder</div>
          {(compact ? projection.steps.slice(0, 2) : projection.steps).map(step => (
            <div key={step.turns}>
              {step.turns}t · cash {step.projectedCash} · {step.uncertainty}
            </div>
          ))}
        </div>
      </div>
      <div className="text-[10px] opacity-80">{projection.overallUncertainty.playerFacing}</div>
    </div>
  );
};

// --- bundled from forecast-round2-console.tsx ---
/**
 * Agent 21 — scale wave round 2 lab console (sensitivity + domain matrix + audit).
 */


export const Ag21ForecastRound2Console: React.FC<{ seed?: number }> = ({ seed = 23 }) => {
  const ctx = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 10 }), [seed]);
  const sensitivity = useMemo(() => runAg21PolicySensitivitySweep(ctx), [ctx]);
  const matrix = useMemo(() => buildAg21DomainStressMatrix(2), []);

  const audit = useMemo(() => {
    const ledger = createAg21ForecastAuditLedger(8);
    appendAg21ForecastAuditEntry(ledger, {
      atTurn: ctx.turn,
      kind: 'sensitivity',
      summary: `dominant=${sensitivity.dominantLever}`,
      payload: sensitivity.rows.slice(0, 2)
    });
    appendAg21ForecastAuditEntry(ledger, {
      atTurn: ctx.turn,
      kind: 'domain_matrix',
      summary: matrix.headline,
      payload: { hotspots: matrix.hotspots }
    });
    return summarizeAg21ForecastAuditLedger(ledger);
  }, [ctx.turn, matrix.headline, matrix.hotspots, sensitivity.dominantLever, sensitivity.rows]);

  return (
    <div className="border border-sky-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round2-console">
      <div className="font-bold text-sky-200">
        📊 Forecast Lab Round 2 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round2-sensitivity">
        Sensitivity · dominant lever {sensitivity.dominantLever} · rows {sensitivity.rows.length}
      </div>
      <div data-testid="ag21-round2-matrix">
        Domain matrix · score {(matrix.matrixScore * 100).toFixed(0)}% · grade {matrix.evaluationGrade}
      </div>
      <div data-testid="ag21-round2-audit">
        Audit · entries {audit.count} · latest {audit.latestSummary}
      </div>
    </div>
  );
};

// --- bundled from forecast-round3-console.tsx ---
/**
 * Agent 21 — scale wave round 3 console (ensemble + drift + trajectory fusion).
 */


export const Ag21ForecastRound3Console: React.FC<{ seed?: number }> = ({ seed = 29 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 12 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.7), actorDebt: base.actorDebt + 200 }),
    [base]
  );

  const ensemble = useMemo(() => buildAg21EnsembleProjection(base), [base]);
  const drift = useMemo(() => measureAg21CalibrationDrift(base, stressed), [base, stressed]);
  const fusion = useMemo(
    () => fuseAg21ScenarioTrajectories(base, ['ag21_sc_003', 'ag21_sc_015', 'ag21_sc_027', 'ag21_sc_039']),
    [base]
  );

  return (
    <div className="border border-rose-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round3-console">
      <div className="font-bold text-rose-200">
        🛰️ Forecast Lab Round 3 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round3-ensemble">
        Ensemble · dispersion {(ensemble.dispersion * 100).toFixed(0)}% · p50 cash{' '}
        {ensemble.bands.find(b => b.label === 'p50')?.projectedCash ?? 0}
      </div>
      <div data-testid="ag21-round3-drift">
        Drift · severity {drift.severity} · score {(drift.driftScore * 100).toFixed(0)}%
      </div>
      <div data-testid="ag21-round3-fusion">{fusion.headline}</div>
    </div>
  );
};

// --- bundled from forecast-round4-console.tsx ---
/**
 * Agent 21 — scale wave round 4 console (backtest residuals + regret + reliability gates).
 */


export const Ag21ForecastRound4Console: React.FC<{ seed?: number }> = ({ seed = 37 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 14 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.75), actorDebt: base.actorDebt + 180 }),
    [base]
  );

  const backtest = useMemo(() => runAg21EnsembleResidualBacktest(base), [base]);
  const regret = useMemo(() => rankAg21PolicyRegret(base), [base]);
  const gates = useMemo(() => evaluateAg21ReliabilityGates(base, stressed), [base, stressed]);

  return (
    <div className="border border-amber-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round4-console">
      <div className="font-bold text-amber-200">
        🔬 Forecast Lab Round 4 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round4-backtest">
        Backtest · tone {backtest.calibrationTone} · mean residual {(backtest.meanAbsoluteResidualPct * 100).toFixed(0)}%
      </div>
      <div data-testid="ag21-round4-regret">
        Regret · lowest {regret.lowestRegretBranchId ?? 'none'} · branches {regret.rows.length}
      </div>
      <div data-testid="ag21-round4-gates">
        Gates · {gates.passCount}/3 · guidance {gates.playerGuidance}
      </div>
    </div>
  );
};

// --- bundled from forecast-round5-console.tsx ---
/**
 * Agent 21 — scale wave round 5 console (volatility + attribution + surfacing scorecard).
 */


export const Ag21ForecastRound5Console: React.FC<{ seed?: number }> = ({ seed = 41 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 15 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.78), actorDebt: base.actorDebt + 200 }),
    [base]
  );

  const volatility = useMemo(() => measureAg21HorizonVolatility(base), [base]);
  const attribution = useMemo(() => buildAg21LeverAttributionReport(base), [base]);
  const scorecard = useMemo(() => buildAg21SurfacingScorecard(base, stressed), [base, stressed]);

  return (
    <div className="border border-emerald-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round5-console">
      <div className="font-bold text-emerald-200">
        🔬 Forecast Lab Round 5 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round5-volatility">
        Volatility · {volatility.stabilityTone} · index {volatility.compositeVolatility.toFixed(2)}
      </div>
      <div data-testid="ag21-round5-attribution">
        Attribution · top {attribution.topLever ?? 'none'} · concentration {attribution.concentrationIndex.toFixed(2)}
      </div>
      <div data-testid="ag21-round5-scorecard">
        Scorecard · {scorecard.readinessScore}/100 · tier {scorecard.tier} · {scorecard.playerGuidance}
      </div>
    </div>
  );
};

// --- bundled from forecast-round6-console.tsx ---
/**
 * Agent 21 — scale wave round 6 console (convergence + brief + playbook).
 */


export const Ag21ForecastRound6Console: React.FC<{ seed?: number }> = ({ seed = 43 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 16 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.76), actorDebt: base.actorDebt + 210 }),
    [base]
  );

  const convergence = useMemo(() => measureAg21EnsembleConvergence(base), [base]);
  const brief = useMemo(() => assembleAg21PlayerForecastBrief(base, stressed), [base, stressed]);
  const playbook = useMemo(() => buildAg21LabPlaybook(base, stressed), [base, stressed]);

  return (
    <div className="border border-sky-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round6-console">
      <div className="font-bold text-sky-200">
        🔬 Forecast Lab Round 6 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round6-convergence">
        Convergence · {convergence.convergenceTone} · gap {convergence.convergenceGap.toFixed(2)}
      </div>
      <div data-testid="ag21-round6-brief">
        Brief · {brief.readinessScore}/100 · tier {brief.surfacingTier}
      </div>
      <div data-testid="ag21-round6-playbook">
        Playbook · mode {playbook.operatorMode} · hints {playbook.hints.length}
      </div>
    </div>
  );
};

// --- bundled from forecast-surface-decision.ts ---
/**
 * Agent 21 — surface / hold / suppress decision from brief + playbook (read-only round 7).
 */


export type Ag21SurfaceDecisionKind = 'surface' | 'hold' | 'suppress';

export interface Ag21SurfaceDecision {
  decision: Ag21SurfaceDecisionKind;
  rationale: string;
  readinessScore: number;
  operatorMode: ReturnType<typeof buildAg21LabPlaybook>['operatorMode'];
  highPriorityHints: number;
  surfacingTier: ReturnType<typeof assembleAg21PlayerForecastBrief>['surfacingTier'];
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21DecisionFromSignals(
  tier: ReturnType<typeof assembleAg21PlayerForecastBrief>['surfacingTier'],
  operatorMode: ReturnType<typeof buildAg21LabPlaybook>['operatorMode'],
  highPriorityHints: number,
  convergenceTone: ReturnType<typeof assembleAg21PlayerForecastBrief>['convergenceTone']
): Ag21SurfaceDecisionKind {
  if (tier === 'red' || operatorMode === 'investigate') return 'suppress';
  if (highPriorityHints >= 2 || convergenceTone === 'divergent') return 'hold';
  if (tier === 'green' && operatorMode === 'surface') return 'surface';
  if (tier === 'amber' && operatorMode !== 'investigate') return 'hold';
  return 'hold';
}

function ag21BandFromDecision(decision: Ag21SurfaceDecisionKind): Ag21UncertaintyBand {
  if (decision === 'surface') return 'low';
  if (decision === 'hold') return 'moderate';
  return 'high';
}

/** Resolve whether lab outputs may surface given round 6 brief + playbook signals. */
export function resolveAg21SurfaceDecision(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21SurfaceDecision {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.77),
      actorDebt: baseCtx.actorDebt + 180
    } satisfies Ag21ForecastContext);

  const brief = assembleAg21PlayerForecastBrief(baseCtx, candidate);
  const playbook = buildAg21LabPlaybook(baseCtx, candidate);
  const highPriorityHints = playbook.hints.filter(h => h.priority === 'high').length;

  const decision = ag21DecisionFromSignals(
    brief.surfacingTier,
    playbook.operatorMode,
    highPriorityHints,
    brief.convergenceTone
  );

  const rationale = `Tier ${brief.surfacingTier} · mode ${playbook.operatorMode} · ${highPriorityHints} high-priority hints · convergence ${brief.convergenceTone}.`;

  return {
    decision,
    rationale,
    readinessScore: brief.readinessScore,
    operatorMode: playbook.operatorMode,
    highPriorityHints,
    surfacingTier: brief.surfacingTier,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromDecision(decision), [
      ...brief.overallUncertainty.factors,
      `decision=${decision}`
    ]),
    authoritative: false
  };
}

export function runAg21SurfaceDecisionSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 12, seed: 44, actorCash: 920, actorDebt: 110, regionsControlled: 2 };
  const resolved = resolveAg21SurfaceDecision(ctx);

  push('surface_decision_kind', ['surface', 'hold', 'suppress'].includes(resolved.decision), resolved.decision);
  push('surface_readiness', resolved.readinessScore >= 0 && resolved.readinessScore <= 100, String(resolved.readinessScore));
  push('surface_hints', resolved.highPriorityHints >= 0, String(resolved.highPriorityHints));
  push('surface_non_auth', resolved.authoritative === false, resolved.rationale);

  return out;
}

// --- bundled from forecast-lab-telemetry.ts ---
/**
 * Agent 21 — lab telemetry rollup for operator dashboards (read-only round 7).
 */


export interface Ag21LabTelemetrySnapshot {
  convergenceGap: number;
  convergenceTone: ReturnType<typeof measureAg21EnsembleConvergence>['convergenceTone'];
  gatePassRatio: number;
  hintCount: number;
  surfaceDecision: ReturnType<typeof resolveAg21SurfaceDecision>['decision'];
  readinessScore: number;
  telemetryHealth: 'healthy' | 'degraded' | 'critical';
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21HealthFromSignals(
  gatePassRatio: number,
  convergenceTone: Ag21LabTelemetrySnapshot['convergenceTone'],
  decision: Ag21LabTelemetrySnapshot['surfaceDecision']
): Ag21LabTelemetrySnapshot['telemetryHealth'] {
  if (decision === 'suppress' || gatePassRatio < 0.25 || convergenceTone === 'divergent') return 'critical';
  if (decision === 'hold' || gatePassRatio < 0.55 || convergenceTone === 'drifting') return 'degraded';
  return 'healthy';
}

function ag21BandFromHealth(health: Ag21LabTelemetrySnapshot['telemetryHealth']): Ag21UncertaintyBand {
  if (health === 'healthy') return 'low';
  if (health === 'degraded') return 'moderate';
  return 'high';
}

/** Collect a single telemetry snapshot from round 4–7 lab modules. */
export function collectAg21LabTelemetry(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabTelemetrySnapshot {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.79),
      actorDebt: baseCtx.actorDebt + 150
    } satisfies Ag21ForecastContext);

  const convergence = measureAg21EnsembleConvergence(baseCtx);
  const gates = evaluateAg21ReliabilityGates(baseCtx, candidate);
  const playbook = buildAg21LabPlaybook(baseCtx, candidate);
  const decision = resolveAg21SurfaceDecision(baseCtx, candidate);

  const gatePassRatio = gates.passCount / Math.max(1, gates.gates.length);
  const telemetryHealth = ag21HealthFromSignals(gatePassRatio, convergence.convergenceTone, decision.decision);

  return {
    convergenceGap: convergence.convergenceGap,
    convergenceTone: convergence.convergenceTone,
    gatePassRatio,
    hintCount: playbook.hints.length,
    surfaceDecision: decision.decision,
    readinessScore: decision.readinessScore,
    telemetryHealth,
    overallUncertainty: ag21LabelUncertainty(ag21BandFromHealth(telemetryHealth), [
      `health=${telemetryHealth}`,
      `gap=${convergence.convergenceGap.toFixed(2)}`
    ]),
    authoritative: false
  };
}

export function runAg21LabTelemetrySelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 10, seed: 61, actorCash: 850, actorDebt: 130, regionsControlled: 2 };
  const snap = collectAg21LabTelemetry(ctx);

  push('telemetry_gap', snap.convergenceGap >= 0, String(snap.convergenceGap));
  push('telemetry_health', ['healthy', 'degraded', 'critical'].includes(snap.telemetryHealth), snap.telemetryHealth);
  push('telemetry_hints', snap.hintCount >= 1, String(snap.hintCount));
  push('telemetry_non_auth', snap.authoritative === false, snap.surfaceDecision);

  return out;
}

// --- bundled from forecast-crosslink-packet.ts ---
/**
 * Agent 21 — cross-agent dashboard handoff packet (Agent 22/23, read-only round 7).
 */


export interface Ag21CrosslinkPacket {
  packetId: string;
  headline: string;
  dashboardTags: string[];
  surfaceDecision: ReturnType<typeof resolveAg21SurfaceDecision>['decision'];
  telemetryHealth: ReturnType<typeof collectAg21LabTelemetry>['telemetryHealth'];
  readinessScore: number;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21PacketId(ctx: Ag21ForecastContext): string {
  return `ag21_xlink_${ctx.turn}_${ctx.seed}`;
}

/** Build a compact handoff packet for evolving UI / dashboard modules. */
export function buildAg21CrosslinkPacket(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21CrosslinkPacket {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.81),
      actorDebt: baseCtx.actorDebt + 100
    } satisfies Ag21ForecastContext);

  const brief = assembleAg21PlayerForecastBrief(baseCtx, candidate);
  const telemetry = collectAg21LabTelemetry(baseCtx, candidate);
  const decision = resolveAg21SurfaceDecision(baseCtx, candidate);

  const dashboardTags = [
    `tier:${brief.surfacingTier}`,
    `decision:${decision.decision}`,
    `health:${telemetry.telemetryHealth}`,
    `convergence:${brief.convergenceTone}`
  ];

  return {
    packetId: ag21PacketId(baseCtx),
    headline: brief.headline,
    dashboardTags,
    surfaceDecision: decision.decision,
    telemetryHealth: telemetry.telemetryHealth,
    readinessScore: brief.readinessScore,
    disclaimer: '(Non-authoritative forecast.) Crosslink packet for dashboard wiring only.',
    overallUncertainty: ag21LabelUncertainty(telemetry.overallUncertainty.band, [
      ...telemetry.overallUncertainty.factors,
      `packet=${ag21PacketId(baseCtx)}`
    ]),
    authoritative: false
  };
}

export function runAg21CrosslinkPacketSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 14, seed: 27, actorCash: 1010, actorDebt: 85, regionsControlled: 3 };
  const packet = buildAg21CrosslinkPacket(ctx);

  push('xlink_id', packet.packetId.startsWith('ag21_xlink_'), packet.packetId);
  push('xlink_tags', packet.dashboardTags.length === 4, String(packet.dashboardTags.length));
  push('xlink_disclaimer', packet.disclaimer.includes('Non-authoritative'), packet.disclaimer.slice(0, 40));
  push('xlink_non_auth', packet.authoritative === false, packet.headline.slice(0, 30));

  return out;
}

// --- bundled from forecast-round7-console.tsx ---
/**
 * Agent 21 — scale wave round 7 console (surface decision + telemetry + crosslink packet).
 */


export const Ag21ForecastRound7Console: React.FC<{ seed?: number }> = ({ seed = 47 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 17 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.74), actorDebt: base.actorDebt + 240 }),
    [base]
  );

  const decision = useMemo(() => resolveAg21SurfaceDecision(base, stressed), [base, stressed]);
  const telemetry = useMemo(() => collectAg21LabTelemetry(base, stressed), [base, stressed]);
  const packet = useMemo(() => buildAg21CrosslinkPacket(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round7-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 7 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round7-decision">
        Decision · {decision.decision} · readiness {decision.readinessScore}/100
      </div>
      <div data-testid="ag21-round7-telemetry">
        Telemetry · {telemetry.telemetryHealth} · gates {(telemetry.gatePassRatio * 100).toFixed(0)}%
      </div>
      <div data-testid="ag21-round7-packet">
        Crosslink · {packet.packetId} · tags {packet.dashboardTags.length}
      </div>
    </div>
  );
};

// --- bundled from forecast-packet-validation.ts ---
/**
 * Agent 21 — crosslink packet validation against telemetry (read-only round 8).
 */


export type Ag21PacketValidationStatus = 'aligned' | 'drift' | 'blocked';

export interface Ag21PacketValidationReport {
  status: Ag21PacketValidationStatus;
  mismatchCount: number;
  mismatches: string[];
  packetId: string;
  telemetryHealth: ReturnType<typeof collectAg21LabTelemetry>['telemetryHealth'];
  surfaceDecision: ReturnType<typeof collectAg21LabTelemetry>['surfaceDecision'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21TagValue(tags: string[], prefix: string): string | undefined {
  const hit = tags.find(t => t.startsWith(`${prefix}:`));
  return hit?.slice(prefix.length + 1);
}

/** Validate dashboard crosslink tags against live telemetry + surface decision. */
export function validateAg21CrosslinkHandoff(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21PacketValidationReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.83),
      actorDebt: baseCtx.actorDebt + 120
    } satisfies Ag21ForecastContext);

  const packet = buildAg21CrosslinkPacket(baseCtx, candidate);
  const telemetry = collectAg21LabTelemetry(baseCtx, candidate);

  const mismatches: string[] = [];
  const tagDecision = ag21TagValue(packet.dashboardTags, 'decision');
  const tagHealth = ag21TagValue(packet.dashboardTags, 'health');

  if (tagDecision !== telemetry.surfaceDecision) {
    mismatches.push(`decision tag ${tagDecision} vs telemetry ${telemetry.surfaceDecision}`);
  }
  if (tagHealth !== telemetry.telemetryHealth) {
    mismatches.push(`health tag ${tagHealth} vs telemetry ${telemetry.telemetryHealth}`);
  }
  if (packet.surfaceDecision !== telemetry.surfaceDecision) {
    mismatches.push(`packet decision ${packet.surfaceDecision} vs telemetry ${telemetry.surfaceDecision}`);
  }
  if (packet.telemetryHealth !== telemetry.telemetryHealth) {
    mismatches.push(`packet health ${packet.telemetryHealth} vs telemetry ${telemetry.telemetryHealth}`);
  }

  let status: Ag21PacketValidationStatus = 'aligned';
  if (telemetry.surfaceDecision === 'suppress' || telemetry.telemetryHealth === 'critical') {
    status = mismatches.length > 0 ? 'blocked' : 'aligned';
  } else if (mismatches.length > 0) {
    status = 'drift';
  }

  return {
    status,
    mismatchCount: mismatches.length,
    mismatches,
    packetId: packet.packetId,
    telemetryHealth: telemetry.telemetryHealth,
    surfaceDecision: telemetry.surfaceDecision,
    disclaimer: '(Non-authoritative forecast.) Packet validation for dashboard wiring only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'moderate' : 'high',
      [`validation=${status}`, `mismatches=${mismatches.length}`]
    ),
    authoritative: false
  };
}

export function runAg21PacketValidationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 16, seed: 33, actorCash: 990, actorDebt: 95, regionsControlled: 3 };
  const report = validateAg21CrosslinkHandoff(ctx);

  push('validation_status', ['aligned', 'drift', 'blocked'].includes(report.status), report.status);
  push('validation_id', report.packetId.startsWith('ag21_xlink_'), report.packetId);
  push('validation_mismatch_nonneg', report.mismatchCount >= 0, String(report.mismatchCount));
  push('validation_non_auth', report.authoritative === false, report.disclaimer.slice(0, 30));

  return out;
}

// --- bundled from forecast-operator-escalation.ts ---
/**
 * Agent 21 — operator escalation ladder from validation + telemetry (read-only round 8).
 */


export type Ag21OperatorEscalationTier = 'none' | 'watch' | 'review' | 'incident';

export interface Ag21OperatorEscalation {
  tier: Ag21OperatorEscalationTier;
  validationStatus: ReturnType<typeof validateAg21CrosslinkHandoff>['status'];
  operatorMode: ReturnType<typeof buildAg21LabPlaybook>['operatorMode'];
  actionHint: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21TierFromSignals(
  validationStatus: Ag21OperatorEscalation['validationStatus'],
  health: ReturnType<typeof collectAg21LabTelemetry>['telemetryHealth'],
  decision: ReturnType<typeof collectAg21LabTelemetry>['surfaceDecision'],
  highPriorityHints: number
): Ag21OperatorEscalationTier {
  if (validationStatus === 'blocked' || health === 'critical' || decision === 'suppress') return 'incident';
  if (validationStatus === 'drift' || health === 'degraded' || decision === 'hold' || highPriorityHints >= 2) {
    return 'review';
  }
  if (decision === 'hold' || highPriorityHints >= 1) return 'watch';
  return 'none';
}

/** Resolve operator escalation tier for lab dashboards (round 8). */
export function resolveAg21OperatorEscalation(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21OperatorEscalation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.8),
      actorDebt: baseCtx.actorDebt + 140
    } satisfies Ag21ForecastContext);

  const validation = validateAg21CrosslinkHandoff(baseCtx, candidate);
  const telemetry = collectAg21LabTelemetry(baseCtx, candidate);
  const playbook = buildAg21LabPlaybook(baseCtx, candidate);
  const highPriorityHints = playbook.hints.filter(h => h.priority === 'high').length;

  const tier = ag21TierFromSignals(
    validation.status,
    telemetry.telemetryHealth,
    telemetry.surfaceDecision,
    highPriorityHints
  );

  const actionHint =
    tier === 'incident'
      ? 'Pause surfacing; reconcile crosslink packet with telemetry before next turn.'
      : tier === 'review'
        ? 'Schedule operator review; confirm playbook hints against validation drift.'
        : tier === 'watch'
          ? 'Monitor gates and convergence; no dashboard promotion yet.'
          : 'No escalation; lab outputs may follow round 7 surface decision.';

  return {
    tier,
    validationStatus: validation.status,
    operatorMode: playbook.operatorMode,
    actionHint,
    overallUncertainty: ag21LabelUncertainty(
      tier === 'none' ? 'low' : tier === 'watch' ? 'moderate' : 'high',
      [`tier=${tier}`, `validation=${validation.status}`]
    ),
    authoritative: false
  };
}

export function runAg21OperatorEscalationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 11, seed: 52, actorCash: 880, actorDebt: 160, regionsControlled: 2 };
  const escalation = resolveAg21OperatorEscalation(ctx);

  push('escalation_tier', ['none', 'watch', 'review', 'incident'].includes(escalation.tier), escalation.tier);
  push('escalation_hint', escalation.actionHint.length > 10, escalation.actionHint.slice(0, 40));
  push('escalation_validation', ['aligned', 'drift', 'blocked'].includes(escalation.validationStatus), escalation.validationStatus);
  push('escalation_non_auth', escalation.authoritative === false, escalation.operatorMode);

  return out;
}

// --- bundled from forecast-lab-replay-seed.ts ---
/**
 * Agent 21 — deterministic replay seed bundle for history modules (read-only round 8).
 */


export interface Ag21LabReplaySeed {
  seedId: string;
  turn: number;
  labSeed: number;
  packetId: string;
  validationStatus: ReturnType<typeof validateAg21CrosslinkHandoff>['status'];
  escalationTier: ReturnType<typeof resolveAg21OperatorEscalation>['tier'];
  telemetryHealth: ReturnType<typeof collectAg21LabTelemetry>['telemetryHealth'];
  fingerprint: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21ReplayFingerprint(ctx: Ag21ForecastContext, packetId: string, tier: Ag21LabReplaySeed['escalationTier']): string {
  return `ag21_replay_${ctx.turn}_${ctx.seed}_${packetId.split('_').pop()}_${tier}`;
}

/** Build a compact replay seed for Agent 24 history wiring (non-authoritative). */
export function buildAg21LabReplaySeed(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabReplaySeed {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.82),
      actorDebt: baseCtx.actorDebt + 110
    } satisfies Ag21ForecastContext);

  const packet = buildAg21CrosslinkPacket(baseCtx, candidate);
  const validation = validateAg21CrosslinkHandoff(baseCtx, candidate);
  const escalation = resolveAg21OperatorEscalation(baseCtx, candidate);
  const telemetry = collectAg21LabTelemetry(baseCtx, candidate);

  const seedId = `ag21_lab_seed_${baseCtx.turn}_${baseCtx.seed}`;

  return {
    seedId,
    turn: baseCtx.turn,
    labSeed: baseCtx.seed,
    packetId: packet.packetId,
    validationStatus: validation.status,
    escalationTier: escalation.tier,
    telemetryHealth: telemetry.telemetryHealth,
    fingerprint: ag21ReplayFingerprint(baseCtx, packet.packetId, escalation.tier),
    disclaimer: '(Non-authoritative forecast.) Replay seed for history modules only.',
    overallUncertainty: ag21LabelUncertainty(
      escalation.tier === 'incident' ? 'high' : escalation.tier === 'none' ? 'low' : 'moderate',
      [`replay=${seedId}`, `health=${telemetry.telemetryHealth}`]
    ),
    authoritative: false
  };
}

export function runAg21LabReplaySeedSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 19, seed: 8, actorCash: 1120, actorDebt: 70, regionsControlled: 4 };
  const replay = buildAg21LabReplaySeed(ctx);

  push('replay_seed_id', replay.seedId.startsWith('ag21_lab_seed_'), replay.seedId);
  push('replay_fingerprint', replay.fingerprint.startsWith('ag21_replay_'), replay.fingerprint);
  push('replay_packet', replay.packetId.startsWith('ag21_xlink_'), replay.packetId);
  push('replay_non_auth', replay.authoritative === false, replay.disclaimer.slice(0, 30));

  return out;
}

// --- bundled from forecast-round8-console.tsx ---
/**
 * Agent 21 — scale wave round 8 console (validation + escalation + replay seed).
 */


export const Ag21ForecastRound8Console: React.FC<{ seed?: number }> = ({ seed = 51 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 18 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.72), actorDebt: base.actorDebt + 260 }),
    [base]
  );

  const validation = useMemo(() => validateAg21CrosslinkHandoff(base, stressed), [base, stressed]);
  const escalation = useMemo(() => resolveAg21OperatorEscalation(base, stressed), [base, stressed]);
  const replay = useMemo(() => buildAg21LabReplaySeed(base, stressed), [base, stressed]);

  return (
    <div className="border border-fuchsia-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round8-console">
      <div className="font-bold text-fuchsia-200">
        🔬 Forecast Lab Round 8 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round8-validation">
        Validation · {validation.status} · mismatches {validation.mismatchCount}
      </div>
      <div data-testid="ag21-round8-escalation">
        Escalation · {escalation.tier} · mode {escalation.operatorMode}
      </div>
      <div data-testid="ag21-round8-replay">
        Replay · {replay.seedId} · {replay.fingerprint.slice(0, 28)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-replay-coherence.ts ---
/**
 * Agent 21 — replay seed coherence vs validation + escalation (read-only round 9).
 */


export type Ag21ReplayCoherenceStatus = 'coherent' | 'partial' | 'broken';

export interface Ag21ReplayCoherenceReport {
  status: Ag21ReplayCoherenceStatus;
  driftSignals: string[];
  replaySeedId: string;
  validationStatus: ReturnType<typeof validateAg21CrosslinkHandoff>['status'];
  escalationTier: ReturnType<typeof resolveAg21OperatorEscalation>['tier'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Check replay seed fields against fresh validation + escalation (round 9). */
export function assessAg21ReplayCoherence(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ReplayCoherenceReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.81),
      actorDebt: baseCtx.actorDebt + 130
    } satisfies Ag21ForecastContext);

  const replay = buildAg21LabReplaySeed(baseCtx, candidate);
  const validation = validateAg21CrosslinkHandoff(baseCtx, candidate);
  const escalation = resolveAg21OperatorEscalation(baseCtx, candidate);

  const driftSignals: string[] = [];
  if (replay.validationStatus !== validation.status) {
    driftSignals.push(`validation ${replay.validationStatus} vs live ${validation.status}`);
  }
  if (replay.escalationTier !== escalation.tier) {
    driftSignals.push(`escalation ${replay.escalationTier} vs live ${escalation.tier}`);
  }
  if (!replay.fingerprint.includes(String(escalation.tier))) {
    driftSignals.push('fingerprint missing escalation tier token');
  }

  let status: Ag21ReplayCoherenceStatus = 'coherent';
  if (driftSignals.length >= 2) status = 'broken';
  else if (driftSignals.length === 1) status = 'partial';

  return {
    status,
    driftSignals,
    replaySeedId: replay.seedId,
    validationStatus: validation.status,
    escalationTier: escalation.tier,
    disclaimer: '(Non-authoritative forecast.) Replay coherence check for history wiring only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'coherent' ? 'low' : status === 'partial' ? 'moderate' : 'high',
      [`coherence=${status}`, `drift=${driftSignals.length}`]
    ),
    authoritative: false
  };
}

export function runAg21ReplayCoherenceSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 14, seed: 61, actorCash: 940, actorDebt: 120, regionsControlled: 3 };
  const report = assessAg21ReplayCoherence(ctx);

  push('coherence_status', ['coherent', 'partial', 'broken'].includes(report.status), report.status);
  push('coherence_seed', report.replaySeedId.startsWith('ag21_lab_seed_'), report.replaySeedId);
  push('coherence_validation', ['aligned', 'drift', 'blocked'].includes(report.validationStatus), report.validationStatus);
  push('coherence_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-escalation-runbook.ts ---
/**
 * Agent 21 — operator runbook steps from escalation tier (read-only round 9).
 */


export interface Ag21EscalationRunbookStep {
  order: number;
  action: string;
  rationale: string;
}

export interface Ag21EscalationRunbook {
  tier: ReturnType<typeof resolveAg21OperatorEscalation>['tier'];
  stepCount: number;
  steps: Ag21EscalationRunbookStep[];
  coherenceStatus: ReturnType<typeof assessAg21ReplayCoherence>['status'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21RunbookStepsForTier(
  tier: Ag21EscalationRunbook['tier'],
  coherence: Ag21EscalationRunbook['coherenceStatus']
): Ag21EscalationRunbookStep[] {
  const base: Ag21EscalationRunbookStep[] =
    tier === 'incident'
      ? [
          { order: 1, action: 'Suppress dashboard surfacing', rationale: 'Validation blocked or telemetry critical.' },
          { order: 2, action: 'Reconcile crosslink packet tags', rationale: 'Align decision/health tags with telemetry rollup.' },
          { order: 3, action: 'Capture replay seed snapshot', rationale: 'Hand off to history modules after coherence check.' }
        ]
      : tier === 'review'
        ? [
            { order: 1, action: 'Schedule operator review', rationale: 'Drift or degraded telemetry requires human sign-off.' },
            { order: 2, action: 'Cross-check playbook hints', rationale: 'Confirm high-priority hints against validation status.' }
          ]
        : tier === 'watch'
          ? [{ order: 1, action: 'Monitor gates and convergence', rationale: 'Hold surface decision until stability improves.' }]
          : [{ order: 1, action: 'Continue lab-only surfacing', rationale: 'No escalation; follow round 7 surface decision.' }];

  if (coherence !== 'coherent') {
    base.push({
      order: base.length + 1,
      action: 'Refresh replay coherence report',
      rationale: `Replay coherence is ${coherence}; rebuild seed before history export.`
    });
  }

  return base;
}

/** Build ordered operator runbook from escalation + replay coherence (round 9). */
export function buildAg21EscalationRunbook(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21EscalationRunbook {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.79),
      actorDebt: baseCtx.actorDebt + 150
    } satisfies Ag21ForecastContext);

  const escalation = resolveAg21OperatorEscalation(baseCtx, candidate);
  const coherence = assessAg21ReplayCoherence(baseCtx, candidate);
  const steps = ag21RunbookStepsForTier(escalation.tier, coherence.status);

  return {
    tier: escalation.tier,
    stepCount: steps.length,
    steps,
    coherenceStatus: coherence.status,
    disclaimer: '(Non-authoritative forecast.) Operator runbook for lab dashboards only.',
    overallUncertainty: ag21LabelUncertainty(
      escalation.tier === 'incident' || coherence.status === 'broken' ? 'high' : 'moderate',
      [`tier=${escalation.tier}`, `coherence=${coherence.status}`]
    ),
    authoritative: false
  };
}

export function runAg21EscalationRunbookSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 9, seed: 44, actorCash: 760, actorDebt: 190, regionsControlled: 2 };
  const runbook = buildAg21EscalationRunbook(ctx);

  push('runbook_steps', runbook.stepCount === runbook.steps.length && runbook.stepCount >= 1, String(runbook.stepCount));
  push('runbook_order', runbook.steps.every((s, i) => s.order === i + 1), runbook.steps.map(s => s.order).join(','));
  push('runbook_tier', ['none', 'watch', 'review', 'incident'].includes(runbook.tier), runbook.tier);
  push('runbook_non_auth', runbook.authoritative === false, runbook.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-lab-integration-handoff.ts ---
/**
 * Agent 21 — compact integration handoff for Agent 24/25 assembly (read-only round 9).
 */


export interface Ag21LabIntegrationHandoff {
  handoffId: string;
  moduleVersion: string;
  validationStatus: ReturnType<typeof validateAg21CrosslinkHandoff>['status'];
  replaySeedId: string;
  coherenceStatus: ReturnType<typeof assessAg21ReplayCoherence>['status'];
  runbookStepCount: number;
  integrationTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package round 8–9 lab outputs for modular assembly wiring. */
export function buildAg21LabIntegrationHandoff(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabIntegrationHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.84),
      actorDebt: baseCtx.actorDebt + 100
    } satisfies Ag21ForecastContext);

  const validation = validateAg21CrosslinkHandoff(baseCtx, candidate);
  const replay = buildAg21LabReplaySeed(baseCtx, candidate);
  const coherence = assessAg21ReplayCoherence(baseCtx, candidate);
  const runbook = buildAg21EscalationRunbook(baseCtx, candidate);

  const handoffId = `ag21_handoff_${baseCtx.turn}_${baseCtx.seed}_${validation.status}`;

  const integrationTags = [
    `validation:${validation.status}`,
    `coherence:${coherence.status}`,
    `tier:${runbook.tier}`,
    `replay:${replay.seedId}`,
    `steps:${runbook.stepCount}`
  ];

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    validationStatus: validation.status,
    replaySeedId: replay.seedId,
    coherenceStatus: coherence.status,
    runbookStepCount: runbook.stepCount,
    integrationTags,
    disclaimer: '(Non-authoritative forecast.) Integration handoff for Operation 10M assembly only.',
    overallUncertainty: ag21LabelUncertainty(
      validation.status === 'blocked' || coherence.status === 'broken' ? 'high' : 'moderate',
      [`handoff=${handoffId}`, `tags=${integrationTags.length}`]
    ),
    authoritative: false
  };
}

export function runAg21LabIntegrationHandoffSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 22, seed: 3, actorCash: 1300, actorDebt: 55, regionsControlled: 5 };
  const handoff = buildAg21LabIntegrationHandoff(ctx);

  push('handoff_id', handoff.handoffId.startsWith('ag21_handoff_'), handoff.handoffId);
  push('handoff_tags', handoff.integrationTags.length >= 5, String(handoff.integrationTags.length));
  push('handoff_version', handoff.moduleVersion === O10M_AGENT21_MODULE_VERSION, handoff.moduleVersion);
  push('handoff_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round9-console.tsx ---
/**
 * Agent 21 — scale wave round 9 console (coherence + runbook + integration handoff).
 */


export const Ag21ForecastRound9Console: React.FC<{ seed?: number }> = ({ seed = 63 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 20 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.7), actorDebt: base.actorDebt + 280 }),
    [base]
  );

  const coherence = useMemo(() => assessAg21ReplayCoherence(base, stressed), [base, stressed]);
  const runbook = useMemo(() => buildAg21EscalationRunbook(base, stressed), [base, stressed]);
  const handoff = useMemo(() => buildAg21LabIntegrationHandoff(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round9-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 9 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round9-coherence">
        Coherence · {coherence.status} · drift {coherence.driftSignals.length}
      </div>
      <div data-testid="ag21-round9-runbook">
        Runbook · {runbook.tier} · {runbook.stepCount} steps
      </div>
      <div data-testid="ag21-round9-handoff">
        Handoff · {handoff.handoffId.slice(0, 32)}… · tags {handoff.integrationTags.length}
      </div>
    </div>
  );
};

// --- bundled from forecast-handoff-readiness.ts ---
/**
 * Agent 21 — integration handoff readiness gate (read-only round 10).
 */


export type Ag21HandoffReadinessStatus = 'ready' | 'hold' | 'blocked';

export interface Ag21HandoffReadinessReport {
  status: Ag21HandoffReadinessStatus;
  blockers: string[];
  handoffId: string;
  escalationTier: ReturnType<typeof resolveAg21OperatorEscalation>['tier'];
  coherenceStatus: ReturnType<typeof buildAg21LabIntegrationHandoff>['coherenceStatus'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21ReadinessFromSignals(
  validationStatus: ReturnType<typeof buildAg21LabIntegrationHandoff>['validationStatus'],
  coherenceStatus: Ag21HandoffReadinessReport['coherenceStatus'],
  tier: Ag21HandoffReadinessReport['escalationTier']
): { status: Ag21HandoffReadinessStatus; blockers: string[] } {
  const blockers: string[] = [];
  if (validationStatus === 'blocked') blockers.push('crosslink validation blocked');
  if (coherenceStatus === 'broken') blockers.push('replay coherence broken');
  if (tier === 'incident') blockers.push('operator escalation incident');

  if (blockers.length > 0) return { status: 'blocked', blockers };
  if (validationStatus === 'drift' || coherenceStatus === 'partial' || tier === 'review') {
    blockers.push('await operator review before staging');
    return { status: 'hold', blockers };
  }
  if (tier === 'watch') {
    return { status: 'hold', blockers: ['escalation watch — defer staging promotion'] };
  }
  return { status: 'ready', blockers: [] };
}

/** Evaluate whether round 9 integration handoff may enter assembly staging (round 10). */
export function evaluateAg21HandoffReadiness(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21HandoffReadinessReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.78),
      actorDebt: baseCtx.actorDebt + 165
    } satisfies Ag21ForecastContext);

  const handoff = buildAg21LabIntegrationHandoff(baseCtx, candidate);
  const escalation = resolveAg21OperatorEscalation(baseCtx, candidate);
  const { status, blockers } = ag21ReadinessFromSignals(
    handoff.validationStatus,
    handoff.coherenceStatus,
    escalation.tier
  );

  return {
    status,
    blockers,
    handoffId: handoff.handoffId,
    escalationTier: escalation.tier,
    coherenceStatus: handoff.coherenceStatus,
    disclaimer: '(Non-authoritative forecast.) Handoff readiness for modular staging only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'hold' ? 'moderate' : 'high',
      [`readiness=${status}`, `blockers=${blockers.length}`]
    ),
    authoritative: false
  };
}

export function runAg21HandoffReadinessSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 16, seed: 71, actorCash: 1010, actorDebt: 90, regionsControlled: 3 };
  const report = evaluateAg21HandoffReadiness(ctx);

  push('readiness_status', ['ready', 'hold', 'blocked'].includes(report.status), report.status);
  push('readiness_handoff', report.handoffId.startsWith('ag21_handoff_'), report.handoffId);
  push('readiness_blockers', Array.isArray(report.blockers), String(report.blockers.length));
  push('readiness_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-operator-signoff.ts ---
/**
 * Agent 21 — operator signoff checklist from readiness + runbook (read-only round 10).
 */


export interface Ag21OperatorSignoffItem {
  id: string;
  label: string;
  satisfied: boolean;
}

export interface Ag21OperatorSignoffRecord {
  signoffId: string;
  readinessStatus: ReturnType<typeof evaluateAg21HandoffReadiness>['status'];
  items: Ag21OperatorSignoffItem[];
  satisfiedCount: number;
  mayStage: boolean;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Build operator signoff checklist before lab staging export (round 10). */
export function buildAg21OperatorSignoffRecord(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21OperatorSignoffRecord {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.77),
      actorDebt: baseCtx.actorDebt + 175
    } satisfies Ag21ForecastContext);

  const readiness = evaluateAg21HandoffReadiness(baseCtx, candidate);
  const runbook = buildAg21EscalationRunbook(baseCtx, candidate);

  const items: Ag21OperatorSignoffItem[] = [
    {
      id: 'readiness_clear',
      label: 'Handoff readiness not blocked',
      satisfied: readiness.status !== 'blocked'
    },
    {
      id: 'coherence_ok',
      label: 'Replay coherence not broken',
      satisfied: readiness.coherenceStatus !== 'broken'
    },
    {
      id: 'runbook_reviewed',
      label: 'Runbook steps acknowledged',
      satisfied: runbook.stepCount >= 1 && runbook.steps.every(s => s.action.length > 5)
    },
    {
      id: 'escalation_not_incident',
      label: 'No active incident tier',
      satisfied: readiness.escalationTier !== 'incident'
    }
  ];

  const satisfiedCount = items.filter(i => i.satisfied).length;
  const mayStage = readiness.status === 'ready' && satisfiedCount === items.length;
  const signoffId = `ag21_signoff_${baseCtx.turn}_${baseCtx.seed}_${readiness.status}`;

  return {
    signoffId,
    readinessStatus: readiness.status,
    items,
    satisfiedCount,
    mayStage,
    disclaimer: '(Non-authoritative forecast.) Operator signoff for lab staging only.',
    overallUncertainty: ag21LabelUncertainty(
      mayStage ? 'low' : readiness.status === 'blocked' ? 'high' : 'moderate',
      [`signoff=${signoffId}`, `satisfied=${satisfiedCount}`]
    ),
    authoritative: false
  };
}

export function runAg21OperatorSignoffSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 12, seed: 33, actorCash: 850, actorDebt: 140, regionsControlled: 2 };
  const signoff = buildAg21OperatorSignoffRecord(ctx);

  push('signoff_id', signoff.signoffId.startsWith('ag21_signoff_'), signoff.signoffId);
  push('signoff_items', signoff.items.length === 4, String(signoff.items.length));
  push('signoff_count', signoff.satisfiedCount <= signoff.items.length, String(signoff.satisfiedCount));
  push('signoff_non_auth', signoff.authoritative === false, signoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-lab-staging-packet.ts ---
/**
 * Agent 21 — pre-assembly staging packet for wave dry-runs (read-only round 10).
 */


export type Ag21LabStagingPhase = 'draft' | 'staged' | 'rejected';

export interface Ag21LabStagingPacket {
  packetId: string;
  phase: Ag21LabStagingPhase;
  moduleVersion: string;
  handoffId: string;
  signoffId: string;
  stagingTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21StagingPhase(
  readiness: ReturnType<typeof evaluateAg21HandoffReadiness>['status'],
  mayStage: boolean
): Ag21LabStagingPhase {
  if (readiness === 'blocked') return 'rejected';
  if (mayStage && readiness === 'ready') return 'staged';
  return 'draft';
}

/** Build staging packet wrapping handoff + signoff for Agent 25 dry-run wiring. */
export function buildAg21LabStagingPacket(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabStagingPacket {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.76),
      actorDebt: baseCtx.actorDebt + 185
    } satisfies Ag21ForecastContext);

  const handoff = buildAg21LabIntegrationHandoff(baseCtx, candidate);
  const readiness = evaluateAg21HandoffReadiness(baseCtx, candidate);
  const signoff = buildAg21OperatorSignoffRecord(baseCtx, candidate);
  const phase = ag21StagingPhase(readiness.status, signoff.mayStage);

  const packetId = `ag21_stage_${baseCtx.turn}_${baseCtx.seed}_${phase}`;

  const stagingTags = [
    `phase:${phase}`,
    `readiness:${readiness.status}`,
    `signoff:${signoff.signoffId}`,
    `handoff:${handoff.handoffId}`,
    `version:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    packetId,
    phase,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    handoffId: handoff.handoffId,
    signoffId: signoff.signoffId,
    stagingTags,
    disclaimer: '(Non-authoritative forecast.) Staging packet for Operation 10M dry-run only.',
    overallUncertainty: ag21LabelUncertainty(
      phase === 'staged' ? 'low' : phase === 'rejected' ? 'high' : 'moderate',
      [`packet=${packetId}`, `phase=${phase}`]
    ),
    authoritative: false
  };
}

export function runAg21LabStagingPacketSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 24, seed: 17, actorCash: 1180, actorDebt: 62, regionsControlled: 4 };
  const packet = buildAg21LabStagingPacket(ctx);

  push('staging_packet_id', packet.packetId.startsWith('ag21_stage_'), packet.packetId);
  push('staging_phase', ['draft', 'staged', 'rejected'].includes(packet.phase), packet.phase);
  push('staging_tags', packet.stagingTags.length >= 5, String(packet.stagingTags.length));
  push('staging_non_auth', packet.authoritative === false, packet.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round10-console.tsx ---
/**
 * Agent 21 — scale wave round 10 console (readiness + signoff + staging packet).
 */


export const Ag21ForecastRound10Console: React.FC<{ seed?: number }> = ({ seed = 74 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 21 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.68), actorDebt: base.actorDebt + 310 }),
    [base]
  );

  const readiness = useMemo(() => evaluateAg21HandoffReadiness(base, stressed), [base, stressed]);
  const signoff = useMemo(() => buildAg21OperatorSignoffRecord(base, stressed), [base, stressed]);
  const staging = useMemo(() => buildAg21LabStagingPacket(base, stressed), [base, stressed]);

  return (
    <div className="border border-sky-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round10-console">
      <div className="font-bold text-sky-200">
        🔬 Forecast Lab Round 10 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round10-readiness">
        Readiness · {readiness.status} · blockers {readiness.blockers.length}
      </div>
      <div data-testid="ag21-round10-signoff">
        Signoff · {signoff.satisfiedCount}/{signoff.items.length} · stage {signoff.mayStage ? 'yes' : 'no'}
      </div>
      <div data-testid="ag21-round10-staging">
        Staging · {staging.phase} · {staging.packetId.slice(0, 30)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-staging-verification.ts ---
/**
 * Agent 21 — staging packet integrity vs handoff + signoff (read-only round 11).
 */


export type Ag21StagingVerificationStatus = 'verified' | 'warning' | 'failed';

export interface Ag21StagingVerificationReport {
  status: Ag21StagingVerificationStatus;
  findings: string[];
  stagingPacketId: string;
  stagingPhase: ReturnType<typeof buildAg21LabStagingPacket>['phase'];
  signoffMayStage: boolean;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21TagValue(tags: string[], prefix: string): string | undefined {
  const hit = tags.find(t => t.startsWith(`${prefix}:`));
  return hit?.slice(prefix.length + 1);
}

/** Verify staging packet tags align with live handoff and signoff records (round 11). */
export function verifyAg21StagingIntegrity(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21StagingVerificationReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.75),
      actorDebt: baseCtx.actorDebt + 195
    } satisfies Ag21ForecastContext);

  const staging = buildAg21LabStagingPacket(baseCtx, candidate);
  const handoff = buildAg21LabIntegrationHandoff(baseCtx, candidate);
  const signoff = buildAg21OperatorSignoffRecord(baseCtx, candidate);

  const findings: string[] = [];
  const tagHandoff = ag21TagValue(staging.stagingTags, 'handoff');
  const tagSignoff = ag21TagValue(staging.stagingTags, 'signoff');

  if (tagHandoff !== handoff.handoffId) {
    findings.push(`handoff tag mismatch ${tagHandoff} vs ${handoff.handoffId}`);
  }
  if (tagSignoff !== signoff.signoffId) {
    findings.push(`signoff tag mismatch ${tagSignoff} vs ${signoff.signoffId}`);
  }
  if (staging.handoffId !== handoff.handoffId) {
    findings.push('staging handoffId diverges from integration handoff');
  }
  if (staging.signoffId !== signoff.signoffId) {
    findings.push('staging signoffId diverges from signoff record');
  }
  if (staging.phase === 'staged' && !signoff.mayStage) {
    findings.push('staged phase but signoff mayStage false');
  }

  let status: Ag21StagingVerificationStatus = 'verified';
  if (findings.length >= 2 || staging.phase === 'rejected') status = 'failed';
  else if (findings.length === 1 || staging.phase === 'draft') status = 'warning';

  return {
    status,
    findings,
    stagingPacketId: staging.packetId,
    stagingPhase: staging.phase,
    signoffMayStage: signoff.mayStage,
    disclaimer: '(Non-authoritative forecast.) Staging verification for modular dry-run only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'verified' ? 'low' : status === 'warning' ? 'moderate' : 'high',
      [`verify=${status}`, `findings=${findings.length}`]
    ),
    authoritative: false
  };
}

export function runAg21StagingVerificationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 18, seed: 55, actorCash: 990, actorDebt: 105, regionsControlled: 3 };
  const report = verifyAg21StagingIntegrity(ctx);

  push('verify_status', ['verified', 'warning', 'failed'].includes(report.status), report.status);
  push('verify_packet', report.stagingPacketId.startsWith('ag21_stage_'), report.stagingPacketId);
  push('verify_findings', Array.isArray(report.findings), String(report.findings.length));
  push('verify_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-export-clearance.ts ---
/**
 * Agent 21 — export clearance for history / replay modules (read-only round 11).
 */


export type Ag21ExportClearanceLevel = 'denied' | 'conditional' | 'cleared';

export interface Ag21ExportClearance {
  level: Ag21ExportClearanceLevel;
  replaySeedId: string;
  verificationStatus: ReturnType<typeof verifyAg21StagingIntegrity>['status'];
  readinessStatus: ReturnType<typeof evaluateAg21HandoffReadiness>['status'];
  clearanceNotes: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Resolve whether lab outputs may export to Agent 24 history wiring (round 11). */
export function buildAg21ExportClearance(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ExportClearance {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.74),
      actorDebt: baseCtx.actorDebt + 205
    } satisfies Ag21ForecastContext);

  const verification = verifyAg21StagingIntegrity(baseCtx, candidate);
  const readiness = evaluateAg21HandoffReadiness(baseCtx, candidate);
  const replay = buildAg21LabReplaySeed(baseCtx, candidate);

  const clearanceNotes: string[] = [];
  if (verification.status === 'failed') clearanceNotes.push('staging verification failed');
  if (readiness.status === 'blocked') clearanceNotes.push('handoff readiness blocked');
  if (verification.findings.length > 0) {
    clearanceNotes.push(`${verification.findings.length} staging finding(s)`);
  }

  let level: Ag21ExportClearanceLevel = 'cleared';
  if (readiness.status === 'blocked' || verification.status === 'failed') level = 'denied';
  else if (readiness.status === 'hold' || verification.status === 'warning') level = 'conditional';

  return {
    level,
    replaySeedId: replay.seedId,
    verificationStatus: verification.status,
    readinessStatus: readiness.status,
    clearanceNotes,
    disclaimer: '(Non-authoritative forecast.) Export clearance for history modules only.',
    overallUncertainty: ag21LabelUncertainty(
      level === 'cleared' ? 'low' : level === 'conditional' ? 'moderate' : 'high',
      [`clearance=${level}`, `notes=${clearanceNotes.length}`]
    ),
    authoritative: false
  };
}

export function runAg21ExportClearanceSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 10, seed: 28, actorCash: 720, actorDebt: 210, regionsControlled: 2 };
  const clearance = buildAg21ExportClearance(ctx);

  push('clearance_level', ['denied', 'conditional', 'cleared'].includes(clearance.level), clearance.level);
  push('clearance_replay', clearance.replaySeedId.startsWith('ag21_lab_seed_'), clearance.replaySeedId);
  push('clearance_notes', Array.isArray(clearance.clearanceNotes), String(clearance.clearanceNotes.length));
  push('clearance_non_auth', clearance.authoritative === false, clearance.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-lab-cycle-closeout.ts ---
/**
 * Agent 21 — lab cycle closeout rollup for scale-wave checkpoints (read-only round 11).
 */


export interface Ag21LabCycleCloseout {
  closeoutId: string;
  moduleVersion: string;
  exportLevel: ReturnType<typeof buildAg21ExportClearance>['level'];
  stagingPhase: ReturnType<typeof buildAg21LabStagingPacket>['phase'];
  verificationStatus: ReturnType<typeof verifyAg21StagingIntegrity>['status'];
  summaryBullets: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Summarize round 10–11 staging path for operator closeout logs (round 11). */
export function summarizeAg21LabCycleCloseout(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabCycleCloseout {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.73),
      actorDebt: baseCtx.actorDebt + 215
    } satisfies Ag21ForecastContext);

  const staging = buildAg21LabStagingPacket(baseCtx, candidate);
  const verification = verifyAg21StagingIntegrity(baseCtx, candidate);
  const clearance = buildAg21ExportClearance(baseCtx, candidate);

  const closeoutId = `ag21_closeout_${baseCtx.turn}_${baseCtx.seed}_${clearance.level}`;

  const summaryBullets = [
    `staging phase ${staging.phase}`,
    `verification ${verification.status} (${verification.findings.length} findings)`,
    `export clearance ${clearance.level}`,
    `replay seed ${clearance.replaySeedId}`
  ];

  return {
    closeoutId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    exportLevel: clearance.level,
    stagingPhase: staging.phase,
    verificationStatus: verification.status,
    summaryBullets,
    disclaimer: '(Non-authoritative forecast.) Lab cycle closeout for Operation 10M checkpoints only.',
    overallUncertainty: ag21LabelUncertainty(
      clearance.level === 'cleared' && verification.status === 'verified' ? 'low' : 'moderate',
      [`closeout=${closeoutId}`, `export=${clearance.level}`]
    ),
    authoritative: false
  };
}

export function runAg21LabCycleCloseoutSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 26, seed: 9, actorCash: 1420, actorDebt: 48, regionsControlled: 5 };
  const closeout = summarizeAg21LabCycleCloseout(ctx);

  push('closeout_id', closeout.closeoutId.startsWith('ag21_closeout_'), closeout.closeoutId);
  push('closeout_bullets', closeout.summaryBullets.length === 4, String(closeout.summaryBullets.length));
  push('closeout_version', closeout.moduleVersion === O10M_AGENT21_MODULE_VERSION, closeout.moduleVersion);
  push('closeout_non_auth', closeout.authoritative === false, closeout.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round11-console.tsx ---
/**
 * Agent 21 — scale wave round 11 console (verification + export clearance + closeout).
 */


export const Ag21ForecastRound11Console: React.FC<{ seed?: number }> = ({ seed = 81 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 23 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.65), actorDebt: base.actorDebt + 340 }),
    [base]
  );

  const verification = useMemo(() => verifyAg21StagingIntegrity(base, stressed), [base, stressed]);
  const clearance = useMemo(() => buildAg21ExportClearance(base, stressed), [base, stressed]);
  const closeout = useMemo(() => summarizeAg21LabCycleCloseout(base, stressed), [base, stressed]);

  return (
    <div className="border border-teal-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round11-console">
      <div className="font-bold text-teal-200">
        🔬 Forecast Lab Round 11 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round11-verification">
        Verify · {verification.status} · findings {verification.findings.length}
      </div>
      <div data-testid="ag21-round11-clearance">
        Export · {clearance.level} · {clearance.replaySeedId.slice(0, 24)}…
      </div>
      <div data-testid="ag21-round11-closeout">
        Closeout · {closeout.exportLevel} · {closeout.closeoutId.slice(0, 28)}…
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
  for (const row of runAg21ForecastLabDepthSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21PolicySensitivitySelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21DomainStressMatrixSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ForecastAuditSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21EnsembleProjectionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21CalibrationDriftSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21TrajectoryFusionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ResidualBacktestSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21PolicyRegretSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ReliabilityGatesSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21HorizonVolatilitySelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LeverAttributionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21SurfacingScorecardSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21EnsembleConvergenceSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21PlayerBriefSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabPlaybookSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21SurfaceDecisionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabTelemetrySelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21CrosslinkPacketSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21PacketValidationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21OperatorEscalationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabReplaySeedSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ReplayCoherenceSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21EscalationRunbookSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabIntegrationHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21HandoffReadinessSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21OperatorSignoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabStagingPacketSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21StagingVerificationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ExportClearanceSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabCycleCloseoutSelfChecks()) {
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
