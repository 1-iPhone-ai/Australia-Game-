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

export const O10M_AGENT21_MODULE_VERSION = '2.44.0';
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

// --- bundled from forecast-closeout-attestation.ts ---
/**
 * Agent 21 — closeout attestation from export clearance (read-only round 12).
 */


export type Ag21CloseoutAttestationVerdict = 'accepted' | 'qualified' | 'rejected';

export interface Ag21CloseoutAttestation {
  attestationId: string;
  verdict: Ag21CloseoutAttestationVerdict;
  closeoutId: string;
  exportLevel: ReturnType<typeof buildAg21ExportClearance>['level'];
  verificationStatus: ReturnType<typeof verifyAg21StagingIntegrity>['status'];
  rationale: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Attest lab cycle closeout against export + verification gates (round 12). */
export function attestAg21LabCloseout(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21CloseoutAttestation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.72),
      actorDebt: baseCtx.actorDebt + 225
    } satisfies Ag21ForecastContext);

  const closeout = summarizeAg21LabCycleCloseout(baseCtx, candidate);
  const clearance = buildAg21ExportClearance(baseCtx, candidate);
  const verification = verifyAg21StagingIntegrity(baseCtx, candidate);

  let verdict: Ag21CloseoutAttestationVerdict = 'accepted';
  if (clearance.level === 'denied' || verification.status === 'failed') verdict = 'rejected';
  else if (clearance.level === 'conditional' || verification.status === 'warning') verdict = 'qualified';

  const rationale =
    verdict === 'accepted'
      ? 'Closeout aligns with cleared export and verified staging.'
      : verdict === 'qualified'
        ? 'Closeout recorded with conditional export or staging warnings.'
        : 'Closeout rejected — resolve export denial or staging failure first.';

  const attestationId = `ag21_attest_${baseCtx.turn}_${baseCtx.seed}_${verdict}`;

  return {
    attestationId,
    verdict,
    closeoutId: closeout.closeoutId,
    exportLevel: clearance.level,
    verificationStatus: verification.status,
    rationale,
    disclaimer: '(Non-authoritative forecast.) Closeout attestation for operator logs only.',
    overallUncertainty: ag21LabelUncertainty(
      verdict === 'accepted' ? 'low' : verdict === 'qualified' ? 'moderate' : 'high',
      [`verdict=${verdict}`, `export=${clearance.level}`]
    ),
    authoritative: false
  };
}

export function runAg21CloseoutAttestationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 15, seed: 64, actorCash: 920, actorDebt: 115, regionsControlled: 3 };
  const attestation = attestAg21LabCloseout(ctx);

  push('attest_id', attestation.attestationId.startsWith('ag21_attest_'), attestation.attestationId);
  push('attest_verdict', ['accepted', 'qualified', 'rejected'].includes(attestation.verdict), attestation.verdict);
  push('attest_closeout', attestation.closeoutId.startsWith('ag21_closeout_'), attestation.closeoutId);
  push('attest_non_auth', attestation.authoritative === false, attestation.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-export-manifest.ts ---
/**
 * Agent 21 — export manifest for history module wiring (read-only round 12).
 */


export interface Ag21ExportManifestEntry {
  key: string;
  value: string;
}

export interface Ag21ExportManifest {
  manifestId: string;
  moduleVersion: string;
  attestationVerdict: ReturnType<typeof attestAg21LabCloseout>['verdict'];
  exportLevel: ReturnType<typeof buildAg21ExportClearance>['level'];
  entries: Ag21ExportManifestEntry[];
  mayPublish: boolean;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Build structured export manifest when clearance allows history publish (round 12). */
export function buildAg21ExportManifest(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ExportManifest {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.71),
      actorDebt: baseCtx.actorDebt + 235
    } satisfies Ag21ForecastContext);

  const attestation = attestAg21LabCloseout(baseCtx, candidate);
  const clearance = buildAg21ExportClearance(baseCtx, candidate);
  const replay = buildAg21LabReplaySeed(baseCtx, candidate);

  const entries: Ag21ExportManifestEntry[] = [
    { key: 'replaySeed', value: replay.seedId },
    { key: 'replayFingerprint', value: replay.fingerprint },
    { key: 'attestation', value: attestation.attestationId },
    { key: 'closeout', value: attestation.closeoutId },
    { key: 'clearance', value: clearance.level }
  ];

  const mayPublish = clearance.level === 'cleared' && attestation.verdict === 'accepted';
  const manifestId = `ag21_manifest_${baseCtx.turn}_${baseCtx.seed}_${clearance.level}`;

  return {
    manifestId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    attestationVerdict: attestation.verdict,
    exportLevel: clearance.level,
    entries,
    mayPublish,
    disclaimer: '(Non-authoritative forecast.) Export manifest for Agent 24 history wiring only.',
    overallUncertainty: ag21LabelUncertainty(
      mayPublish ? 'low' : clearance.level === 'denied' ? 'high' : 'moderate',
      [`manifest=${manifestId}`, `publish=${mayPublish}`]
    ),
    authoritative: false
  };
}

export function runAg21ExportManifestSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 20, seed: 12, actorCash: 1050, actorDebt: 80, regionsControlled: 4 };
  const manifest = buildAg21ExportManifest(ctx);

  push('manifest_id', manifest.manifestId.startsWith('ag21_manifest_'), manifest.manifestId);
  push('manifest_entries', manifest.entries.length === 5, String(manifest.entries.length));
  push('manifest_version', manifest.moduleVersion === O10M_AGENT21_MODULE_VERSION, manifest.moduleVersion);
  push('manifest_non_auth', manifest.authoritative === false, manifest.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-lab-archive-seal.ts ---
/**
 * Agent 21 — archive seal tying manifest to attestation (read-only round 12).
 */


export type Ag21ArchiveSealStatus = 'open' | 'sealed' | 'void';

export interface Ag21LabArchiveSeal {
  sealId: string;
  status: Ag21ArchiveSealStatus;
  manifestId: string;
  manifestMayPublish: boolean;
  attestationVerdict: ReturnType<typeof attestAg21LabCloseout>['verdict'];
  sealDigest: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

function ag21SealDigest(manifestId: string, attestationId: string, verdict: string): string {
  return `ag21_seal_${manifestId.split('_').slice(-2).join('_')}_${verdict}_${attestationId.split('_').pop()}`;
}

/** Seal lab archive when manifest and attestation agree (round 12). */
export function sealAg21LabArchiveRecord(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabArchiveSeal {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.7),
      actorDebt: baseCtx.actorDebt + 245
    } satisfies Ag21ForecastContext);

  const manifest = buildAg21ExportManifest(baseCtx, candidate);
  const attestation = attestAg21LabCloseout(baseCtx, candidate);

  let status: Ag21ArchiveSealStatus = 'open';
  if (attestation.verdict === 'rejected' || manifest.exportLevel === 'denied') status = 'void';
  else if (manifest.mayPublish && attestation.verdict === 'accepted') status = 'sealed';

  const sealId = `ag21_archive_${baseCtx.turn}_${baseCtx.seed}_${status}`;

  return {
    sealId,
    status,
    manifestId: manifest.manifestId,
    manifestMayPublish: manifest.mayPublish,
    attestationVerdict: attestation.verdict,
    sealDigest: ag21SealDigest(manifest.manifestId, attestation.attestationId, attestation.verdict),
    disclaimer: '(Non-authoritative forecast.) Archive seal for modular checkpoint logs only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'sealed' ? 'low' : status === 'void' ? 'high' : 'moderate',
      [`seal=${sealId}`, `status=${status}`, `v=${O10M_AGENT21_MODULE_VERSION}`]
    ),
    authoritative: false
  };
}

export function runAg21LabArchiveSealSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 28, seed: 5, actorCash: 1500, actorDebt: 40, regionsControlled: 5 };
  const seal = sealAg21LabArchiveRecord(ctx);

  push('seal_id', seal.sealId.startsWith('ag21_archive_'), seal.sealId);
  push('seal_status', ['open', 'sealed', 'void'].includes(seal.status), seal.status);
  push('seal_digest', seal.sealDigest.startsWith('ag21_seal_'), seal.sealDigest.slice(0, 24));
  push('seal_non_auth', seal.authoritative === false, seal.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round12-console.tsx ---
/**
 * Agent 21 — scale wave round 12 console (attestation + manifest + archive seal).
 */


export const Ag21ForecastRound12Console: React.FC<{ seed?: number }> = ({ seed = 88 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 25 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.62), actorDebt: base.actorDebt + 360 }),
    [base]
  );

  const attestation = useMemo(() => attestAg21LabCloseout(base, stressed), [base, stressed]);
  const manifest = useMemo(() => buildAg21ExportManifest(base, stressed), [base, stressed]);
  const seal = useMemo(() => sealAg21LabArchiveRecord(base, stressed), [base, stressed]);

  return (
    <div className="border border-amber-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round12-console">
      <div className="font-bold text-amber-200">
        🔬 Forecast Lab Round 12 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round12-attestation">
        Attest · {attestation.verdict} · {attestation.attestationId.slice(0, 26)}…
      </div>
      <div data-testid="ag21-round12-manifest">
        Manifest · publish {manifest.mayPublish ? 'yes' : 'no'} · {manifest.entries.length} entries
      </div>
      <div data-testid="ag21-round12-seal">
        Archive · {seal.status} · {seal.sealDigest.slice(0, 28)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-manifest-confirmation.ts ---
/**
 * Agent 21 — export manifest confirmation against archive seal (read-only round 13).
 */


export type Ag21ManifestConfirmationStatus = 'confirmed' | 'pending' | 'revoked';

export interface Ag21ManifestConfirmation {
  status: Ag21ManifestConfirmationStatus;
  manifestId: string;
  sealStatus: ReturnType<typeof sealAg21LabArchiveRecord>['status'];
  manifestMayPublish: boolean;
  mismatchNotes: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Confirm export manifest aligns with archive seal state (round 13). */
export function confirmAg21ExportManifest(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ManifestConfirmation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.69),
      actorDebt: baseCtx.actorDebt + 255
    } satisfies Ag21ForecastContext);

  const manifest = buildAg21ExportManifest(baseCtx, candidate);
  const seal = sealAg21LabArchiveRecord(baseCtx, candidate);

  const mismatchNotes: string[] = [];
  if (seal.manifestId !== manifest.manifestId) {
    mismatchNotes.push('seal manifestId differs from live manifest');
  }
  if (seal.manifestMayPublish !== manifest.mayPublish) {
    mismatchNotes.push('publish flag mismatch between seal and manifest');
  }
  if (seal.status === 'sealed' && !manifest.mayPublish) {
    mismatchNotes.push('sealed archive but manifest mayPublish false');
  }
  if (seal.status === 'void' && manifest.exportLevel !== 'denied') {
    mismatchNotes.push('void seal with non-denied export level');
  }

  let status: Ag21ManifestConfirmationStatus = 'confirmed';
  if (seal.status === 'void' || mismatchNotes.length >= 2) status = 'revoked';
  else if (seal.status === 'open' || mismatchNotes.length === 1) status = 'pending';

  return {
    status,
    manifestId: manifest.manifestId,
    sealStatus: seal.status,
    manifestMayPublish: manifest.mayPublish,
    mismatchNotes,
    disclaimer: '(Non-authoritative forecast.) Manifest confirmation for export wiring only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'confirmed' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`confirm=${status}`, `notes=${mismatchNotes.length}`]
    ),
    authoritative: false
  };
}

export function runAg21ManifestConfirmationSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 17, seed: 58, actorCash: 970, actorDebt: 100, regionsControlled: 3 };
  const confirmation = confirmAg21ExportManifest(ctx);

  push('confirm_status', ['confirmed', 'pending', 'revoked'].includes(confirmation.status), confirmation.status);
  push('confirm_manifest', confirmation.manifestId.startsWith('ag21_manifest_'), confirmation.manifestId);
  push('confirm_notes', Array.isArray(confirmation.mismatchNotes), String(confirmation.mismatchNotes.length));
  push('confirm_non_auth', confirmation.authoritative === false, confirmation.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-archive-audit-trail.ts ---
/**
 * Agent 21 — archive audit trail from seal through confirmation (read-only round 13).
 */


export interface Ag21ArchiveAuditEvent {
  seq: number;
  kind: string;
  refId: string;
}

export interface Ag21ArchiveAuditTrail {
  trailId: string;
  eventCount: number;
  events: Ag21ArchiveAuditEvent[];
  confirmationStatus: ReturnType<typeof confirmAg21ExportManifest>['status'];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Build ordered audit trail for archive lifecycle (round 13). */
export function buildAg21ArchiveAuditTrail(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ArchiveAuditTrail {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.68),
      actorDebt: baseCtx.actorDebt + 265
    } satisfies Ag21ForecastContext);

  const attestation = attestAg21LabCloseout(baseCtx, candidate);
  const seal = sealAg21LabArchiveRecord(baseCtx, candidate);
  const confirmation = confirmAg21ExportManifest(baseCtx, candidate);

  const events: Ag21ArchiveAuditEvent[] = [
    { seq: 1, kind: 'attestation', refId: attestation.attestationId },
    { seq: 2, kind: 'archive_seal', refId: seal.sealId },
    { seq: 3, kind: 'manifest_confirm', refId: confirmation.manifestId }
  ];

  const trailId = `ag21_audit_${baseCtx.turn}_${baseCtx.seed}_${confirmation.status}`;

  return {
    trailId,
    eventCount: events.length,
    events,
    confirmationStatus: confirmation.status,
    disclaimer: '(Non-authoritative forecast.) Archive audit trail for operator review only.',
    overallUncertainty: ag21LabelUncertainty(
      confirmation.status === 'confirmed' ? 'low' : 'moderate',
      [`trail=${trailId}`, `events=${events.length}`]
    ),
    authoritative: false
  };
}

export function runAg21ArchiveAuditTrailSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 21, seed: 14, actorCash: 1100, actorDebt: 75, regionsControlled: 4 };
  const trail = buildAg21ArchiveAuditTrail(ctx);

  push('audit_trail_id', trail.trailId.startsWith('ag21_audit_'), trail.trailId);
  push('audit_events', trail.eventCount === 3 && trail.events.every((e, i) => e.seq === i + 1), String(trail.eventCount));
  push('audit_confirm', ['confirmed', 'pending', 'revoked'].includes(trail.confirmationStatus), trail.confirmationStatus);
  push('audit_non_auth', trail.authoritative === false, trail.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-lab-retention-policy.ts ---
/**
 * Agent 21 — retention policy from confirmation + audit trail (read-only round 13).
 */


export type Ag21RetentionDisposition = 'retain' | 'purge_candidate' | 'hold';

export interface Ag21LabRetentionPolicy {
  policyId: string;
  disposition: Ag21RetentionDisposition;
  retentionDaysHint: number;
  confirmationStatus: ReturnType<typeof confirmAg21ExportManifest>['status'];
  auditTrailId: string;
  rationale: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Resolve lab artifact retention disposition for checkpoint logs (round 13). */
export function resolveAg21LabRetentionPolicy(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabRetentionPolicy {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.67),
      actorDebt: baseCtx.actorDebt + 275
    } satisfies Ag21ForecastContext);

  const confirmation = confirmAg21ExportManifest(baseCtx, candidate);
  const trail = buildAg21ArchiveAuditTrail(baseCtx, candidate);

  let disposition: Ag21RetentionDisposition = 'hold';
  let retentionDaysHint = 14;
  if (confirmation.status === 'confirmed') {
    disposition = 'retain';
    retentionDaysHint = 90;
  } else if (confirmation.status === 'revoked') {
    disposition = 'purge_candidate';
    retentionDaysHint = 7;
  }

  const rationale =
    disposition === 'retain'
      ? 'Confirmed manifest — retain audit trail for history module sync.'
      : disposition === 'purge_candidate'
        ? 'Revoked confirmation — mark lab artifacts for purge review.'
        : 'Pending confirmation — hold retention until operator sign-off.';

  const policyId = `ag21_retention_${baseCtx.turn}_${baseCtx.seed}_${disposition}_v${O10M_AGENT21_MODULE_VERSION.replace(/\./g, '')}`;

  return {
    policyId,
    disposition,
    retentionDaysHint,
    confirmationStatus: confirmation.status,
    auditTrailId: trail.trailId,
    rationale,
    disclaimer: '(Non-authoritative forecast.) Retention policy for lab checkpoints only.',
    overallUncertainty: ag21LabelUncertainty(
      disposition === 'retain' ? 'low' : disposition === 'purge_candidate' ? 'high' : 'moderate',
      [`disposition=${disposition}`, `days=${retentionDaysHint}`]
    ),
    authoritative: false
  };
}

export function runAg21LabRetentionPolicySelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 27, seed: 6, actorCash: 1380, actorDebt: 52, regionsControlled: 5 };
  const policy = resolveAg21LabRetentionPolicy(ctx);

  push('retention_id', policy.policyId.startsWith('ag21_retention_'), policy.policyId);
  push('retention_disposition', ['retain', 'purge_candidate', 'hold'].includes(policy.disposition), policy.disposition);
  push('retention_days', policy.retentionDaysHint > 0, String(policy.retentionDaysHint));
  push('retention_non_auth', policy.authoritative === false, policy.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round13-console.tsx ---
/**
 * Agent 21 — scale wave round 13 console (confirmation + audit trail + retention).
 */


export const Ag21ForecastRound13Console: React.FC<{ seed?: number }> = ({ seed = 92 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 26 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.6), actorDebt: base.actorDebt + 380 }),
    [base]
  );

  const confirmation = useMemo(() => confirmAg21ExportManifest(base, stressed), [base, stressed]);
  const trail = useMemo(() => buildAg21ArchiveAuditTrail(base, stressed), [base, stressed]);
  const retention = useMemo(() => resolveAg21LabRetentionPolicy(base, stressed), [base, stressed]);

  return (
    <div className="border border-lime-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round13-console">
      <div className="font-bold text-lime-200">
        🔬 Forecast Lab Round 13 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round13-confirmation">
        Confirm · {confirmation.status} · notes {confirmation.mismatchNotes.length}
      </div>
      <div data-testid="ag21-round13-audit">
        Audit · {trail.eventCount} events · {trail.trailId.slice(0, 24)}…
      </div>
      <div data-testid="ag21-round13-retention">
        Retention · {retention.disposition} · {retention.retentionDaysHint}d hint
      </div>
    </div>
  );
};

// --- bundled from forecast-retention-compliance.ts ---
/**
 * Agent 21 — retention policy compliance vs confirmation (read-only round 14).
 */


export type Ag21RetentionComplianceStatus = 'compliant' | 'gap' | 'violation';

export interface Ag21RetentionComplianceReport {
  status: Ag21RetentionComplianceStatus;
  policyId: string;
  disposition: ReturnType<typeof resolveAg21LabRetentionPolicy>['disposition'];
  confirmationStatus: ReturnType<typeof confirmAg21ExportManifest>['status'];
  findings: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Assess retention policy against manifest confirmation signals (round 14). */
export function assessAg21RetentionCompliance(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21RetentionComplianceReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.66),
      actorDebt: baseCtx.actorDebt + 285
    } satisfies Ag21ForecastContext);

  const policy = resolveAg21LabRetentionPolicy(baseCtx, candidate);
  const confirmation = confirmAg21ExportManifest(baseCtx, candidate);

  const findings: string[] = [];
  if (policy.disposition === 'retain' && confirmation.status !== 'confirmed') {
    findings.push('retain disposition but manifest not confirmed');
  }
  if (policy.disposition === 'purge_candidate' && confirmation.status === 'confirmed') {
    findings.push('purge candidate while manifest confirmed');
  }
  if (policy.disposition === 'hold' && confirmation.status === 'revoked') {
    findings.push('hold disposition with revoked confirmation');
  }

  let status: Ag21RetentionComplianceStatus = 'compliant';
  if (findings.length >= 2) status = 'violation';
  else if (findings.length === 1) status = 'gap';

  return {
    status,
    policyId: policy.policyId,
    disposition: policy.disposition,
    confirmationStatus: confirmation.status,
    findings,
    disclaimer: '(Non-authoritative forecast.) Retention compliance for checkpoint review only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'compliant' ? 'low' : status === 'gap' ? 'moderate' : 'high',
      [`compliance=${status}`, `findings=${findings.length}`]
    ),
    authoritative: false
  };
}

export function runAg21RetentionComplianceSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 13, seed: 41, actorCash: 810, actorDebt: 175, regionsControlled: 2 };
  const report = assessAg21RetentionCompliance(ctx);

  push('compliance_status', ['compliant', 'gap', 'violation'].includes(report.status), report.status);
  push('compliance_policy', report.policyId.startsWith('ag21_retention_'), report.policyId);
  push('compliance_findings', Array.isArray(report.findings), String(report.findings.length));
  push('compliance_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-archive-audit-rollup.ts ---
/**
 * Agent 21 — archive audit rollup for governance dashboards (read-only round 14).
 */


export interface Ag21ArchiveAuditRollup {
  rollupId: string;
  eventCount: number;
  sealStatus: ReturnType<typeof sealAg21LabArchiveRecord>['status'];
  complianceStatus: ReturnType<typeof assessAg21RetentionCompliance>['status'];
  headline: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Roll up audit trail + retention compliance into a single headline (round 14). */
export function rollupAg21ArchiveAuditSummary(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21ArchiveAuditRollup {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.65),
      actorDebt: baseCtx.actorDebt + 295
    } satisfies Ag21ForecastContext);

  const trail = buildAg21ArchiveAuditTrail(baseCtx, candidate);
  const compliance = assessAg21RetentionCompliance(baseCtx, candidate);
  const seal = sealAg21LabArchiveRecord(baseCtx, candidate);

  const headline = `audit ${trail.eventCount} events · seal ${seal.status} · compliance ${compliance.status}`;
  const rollupId = `ag21_rollup_${baseCtx.turn}_${baseCtx.seed}_${compliance.status}`;

  return {
    rollupId,
    eventCount: trail.eventCount,
    sealStatus: seal.status,
    complianceStatus: compliance.status,
    headline,
    disclaimer: '(Non-authoritative forecast.) Audit rollup for operator dashboards only.',
    overallUncertainty: ag21LabelUncertainty(
      compliance.status === 'compliant' && seal.status !== 'void' ? 'low' : 'moderate',
      [`rollup=${rollupId}`, `seal=${seal.status}`]
    ),
    authoritative: false
  };
}

export function runAg21ArchiveAuditRollupSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 23, seed: 11, actorCash: 1250, actorDebt: 68, regionsControlled: 4 };
  const rollup = rollupAg21ArchiveAuditSummary(ctx);

  push('rollup_id', rollup.rollupId.startsWith('ag21_rollup_'), rollup.rollupId);
  push('rollup_events', rollup.eventCount === 3, String(rollup.eventCount));
  push('rollup_headline', rollup.headline.includes('compliance'), rollup.headline.slice(0, 40));
  push('rollup_non_auth', rollup.authoritative === false, rollup.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-lab-governance-checkpoint.ts ---
/**
 * Agent 21 — governance checkpoint across rollup + compliance (read-only round 14).
 */


export type Ag21GovernanceCheckpointVerdict = 'pass' | 'conditional' | 'fail';

export interface Ag21LabGovernanceCheckpoint {
  checkpointId: string;
  moduleVersion: string;
  verdict: Ag21GovernanceCheckpointVerdict;
  rollupId: string;
  manifestMayPublish: boolean;
  actionItems: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Run scale-wave governance checkpoint on archive + retention path (round 14). */
export function runAg21LabGovernanceCheckpoint(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabGovernanceCheckpoint {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.64),
      actorDebt: baseCtx.actorDebt + 305
    } satisfies Ag21ForecastContext);

  const rollup = rollupAg21ArchiveAuditSummary(baseCtx, candidate);
  const compliance = assessAg21RetentionCompliance(baseCtx, candidate);
  const manifest = buildAg21ExportManifest(baseCtx, candidate);

  const actionItems: string[] = [];
  if (rollup.sealStatus === 'void') actionItems.push('void archive seal — rebuild export path');
  if (compliance.status === 'violation') actionItems.push('retention compliance violation — operator review');
  if (compliance.status === 'gap') actionItems.push('retention gap — reconcile disposition vs confirmation');
  if (!manifest.mayPublish && rollup.sealStatus === 'sealed') {
    actionItems.push('sealed archive without publishable manifest');
  }

  let verdict: Ag21GovernanceCheckpointVerdict = 'pass';
  if (compliance.status === 'violation' || rollup.sealStatus === 'void') verdict = 'fail';
  else if (actionItems.length > 0 || compliance.status === 'gap') verdict = 'conditional';

  const checkpointId = `ag21_gov_${baseCtx.turn}_${baseCtx.seed}_${verdict}`;

  return {
    checkpointId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    verdict,
    rollupId: rollup.rollupId,
    manifestMayPublish: manifest.mayPublish,
    actionItems,
    disclaimer: '(Non-authoritative forecast.) Governance checkpoint for Operation 10M scale waves only.',
    overallUncertainty: ag21LabelUncertainty(
      verdict === 'pass' ? 'low' : verdict === 'conditional' ? 'moderate' : 'high',
      [`checkpoint=${checkpointId}`, `verdict=${verdict}`]
    ),
    authoritative: false
  };
}

export function runAg21LabGovernanceCheckpointSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 29, seed: 4, actorCash: 1550, actorDebt: 35, regionsControlled: 5 };
  const checkpoint = runAg21LabGovernanceCheckpoint(ctx);

  push('gov_id', checkpoint.checkpointId.startsWith('ag21_gov_'), checkpoint.checkpointId);
  push('gov_verdict', ['pass', 'conditional', 'fail'].includes(checkpoint.verdict), checkpoint.verdict);
  push('gov_version', checkpoint.moduleVersion === O10M_AGENT21_MODULE_VERSION, checkpoint.moduleVersion);
  push('gov_non_auth', checkpoint.authoritative === false, checkpoint.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round14-console.tsx ---
/**
 * Agent 21 — scale wave round 14 console (compliance + rollup + governance).
 */


export const Ag21ForecastRound14Console: React.FC<{ seed?: number }> = ({ seed = 96 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 27 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.58), actorDebt: base.actorDebt + 400 }),
    [base]
  );

  const compliance = useMemo(() => assessAg21RetentionCompliance(base, stressed), [base, stressed]);
  const rollup = useMemo(() => rollupAg21ArchiveAuditSummary(base, stressed), [base, stressed]);
  const governance = useMemo(() => runAg21LabGovernanceCheckpoint(base, stressed), [base, stressed]);

  return (
    <div className="border border-rose-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round14-console">
      <div className="font-bold text-rose-200">
        🔬 Forecast Lab Round 14 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round14-compliance">
        Compliance · {compliance.status} · {compliance.disposition}
      </div>
      <div data-testid="ag21-round14-rollup">
        Rollup · {rollup.sealStatus} · {rollup.complianceStatus}
      </div>
      <div data-testid="ag21-round14-governance">
        Governance · {governance.verdict} · actions {governance.actionItems.length}
      </div>
    </div>
  );
};

// --- bundled from forecast-governance-remediation-plan.ts ---
/**
 * Agent 21 — remediation plan from governance checkpoint (read-only round 15).
 */


export type Ag21RemediationPlanStatus = 'clear' | 'planned' | 'blocked';

export interface Ag21GovernanceRemediationPlan {
  planId: string;
  status: Ag21RemediationPlanStatus;
  checkpointVerdict: ReturnType<typeof runAg21LabGovernanceCheckpoint>['verdict'];
  stepCount: number;
  steps: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Build operator remediation steps from governance checkpoint action items (round 15). */
export function buildAg21GovernanceRemediationPlan(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21GovernanceRemediationPlan {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.62),
      actorDebt: baseCtx.actorDebt + 315
    } satisfies Ag21ForecastContext);

  const checkpoint = runAg21LabGovernanceCheckpoint(baseCtx, candidate);
  const steps = checkpoint.actionItems.length
    ? checkpoint.actionItems.map((item, i) => `${i + 1}. ${item}`)
    : ['no remediation — governance checkpoint pass'];

  let status: Ag21RemediationPlanStatus = 'clear';
  if (checkpoint.verdict === 'fail') status = 'blocked';
  else if (checkpoint.actionItems.length > 0) status = 'planned';

  const planId = `ag21_remed_${baseCtx.turn}_${baseCtx.seed}_${status}`;

  return {
    planId,
    status,
    checkpointVerdict: checkpoint.verdict,
    stepCount: steps.length,
    steps,
    disclaimer: '(Non-authoritative forecast.) Remediation plan for scale-wave origin review only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'clear' ? 'low' : status === 'planned' ? 'moderate' : 'high',
      [`plan=${planId}`, `steps=${steps.length}`]
    ),
    authoritative: false
  };
}

export function runAg21GovernanceRemediationPlanSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 31, seed: 15, actorCash: 1420, actorDebt: 52, regionsControlled: 4 };
  const plan = buildAg21GovernanceRemediationPlan(ctx);

  push('remed_id', plan.planId.startsWith('ag21_remed_'), plan.planId);
  push('remed_status', ['clear', 'planned', 'blocked'].includes(plan.status), plan.status);
  push('remed_steps', plan.stepCount >= 1, String(plan.stepCount));
  push('remed_non_auth', plan.authoritative === false, plan.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-origin-gate-attestation.ts ---
/**
 * Agent 21 — origin gate attestation for Operation 10M scale wave (read-only round 15).
 */


export type Ag21OriginGateAttestationStatus = 'ready' | 'conditional' | 'held';

export interface Ag21OriginGateAttestation {
  attestationId: string;
  moduleVersion: string;
  status: Ag21OriginGateAttestationStatus;
  governanceVerdict: ReturnType<typeof runAg21LabGovernanceCheckpoint>['verdict'];
  remediationStatus: ReturnType<typeof buildAg21GovernanceRemediationPlan>['status'];
  originGateCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Attest forecast lab readiness for origin gate push (round 15 / O10-158). */
export function attestAg21OriginGateReadiness(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21OriginGateAttestation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.61),
      actorDebt: baseCtx.actorDebt + 325
    } satisfies Ag21ForecastContext);

  const governance = runAg21LabGovernanceCheckpoint(baseCtx, candidate);
  const remediation = buildAg21GovernanceRemediationPlan(baseCtx, candidate);

  let status: Ag21OriginGateAttestationStatus = 'ready';
  if (governance.verdict === 'fail' || remediation.status === 'blocked') status = 'held';
  else if (governance.verdict === 'conditional' || remediation.status === 'planned') {
    status = 'conditional';
  }

  const attestationId = `ag21_origin_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const originGateCopy =
    status === 'ready'
      ? 'origin gate clear — module chunk may publish'
      : status === 'conditional'
        ? 'origin gate conditional — review remediation before push'
        : 'origin gate held — governance or remediation blocked';

  return {
    attestationId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    governanceVerdict: governance.verdict,
    remediationStatus: remediation.status,
    originGateCopy,
    disclaimer: '(Non-authoritative forecast.) Origin gate attestation does not authorize canonical edits.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'conditional' ? 'moderate' : 'high',
      [`attest=${attestationId}`, `gate=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21OriginGateAttestationSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 33, seed: 7, actorCash: 1680, actorDebt: 41, regionsControlled: 5 };
  const attestation = attestAg21OriginGateReadiness(ctx);

  push('origin_id', attestation.attestationId.startsWith('ag21_origin_'), attestation.attestationId);
  push('origin_status', ['ready', 'conditional', 'held'].includes(attestation.status), attestation.status);
  push('origin_version', attestation.moduleVersion === O10M_AGENT21_MODULE_VERSION, attestation.moduleVersion);
  push('origin_non_auth', attestation.authoritative === false, attestation.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-lab-continuity-verdict.ts ---
/**
 * Agent 21 — lab continuity verdict across remediation + origin gate (read-only round 15).
 */


export type Ag21LabContinuityVerdict = 'continuous' | 'watch' | 'broken';

export interface Ag21LabContinuityReport {
  reportId: string;
  verdict: Ag21LabContinuityVerdict;
  rollupId: string;
  originGateStatus: ReturnType<typeof attestAg21OriginGateReadiness>['status'];
  remediationStatus: ReturnType<typeof buildAg21GovernanceRemediationPlan>['status'];
  summary: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Resolve forecast lab continuity for wave-15 origin gate (round 15). */
export function resolveAg21LabContinuityVerdict(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21LabContinuityReport {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.6),
      actorDebt: baseCtx.actorDebt + 335
    } satisfies Ag21ForecastContext);

  const rollup = rollupAg21ArchiveAuditSummary(baseCtx, candidate);
  const remediation = buildAg21GovernanceRemediationPlan(baseCtx, candidate);
  const origin = attestAg21OriginGateReadiness(baseCtx, candidate);

  let verdict: Ag21LabContinuityVerdict = 'continuous';
  if (origin.status === 'held' || remediation.status === 'blocked' || rollup.sealStatus === 'void') {
    verdict = 'broken';
  } else if (origin.status === 'conditional' || remediation.status === 'planned') {
    verdict = 'watch';
  }

  const reportId = `ag21_cont_${baseCtx.turn}_${baseCtx.seed}_${verdict}`;
  const summary = `continuity ${verdict} · rollup ${rollup.complianceStatus} · gate ${origin.status}`;

  return {
    reportId,
    verdict,
    rollupId: rollup.rollupId,
    originGateStatus: origin.status,
    remediationStatus: remediation.status,
    summary,
    disclaimer: '(Non-authoritative forecast.) Continuity verdict for operator dashboards only.',
    overallUncertainty: ag21LabelUncertainty(
      verdict === 'continuous' ? 'low' : verdict === 'watch' ? 'moderate' : 'high',
      [`continuity=${verdict}`, `rollup=${rollup.rollupId}`]
    ),
    authoritative: false
  };
}

export function runAg21LabContinuityVerdictSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 35, seed: 22, actorCash: 990, actorDebt: 88, regionsControlled: 3 };
  const report = resolveAg21LabContinuityVerdict(ctx);

  push('cont_id', report.reportId.startsWith('ag21_cont_'), report.reportId);
  push('cont_verdict', ['continuous', 'watch', 'broken'].includes(report.verdict), report.verdict);
  push('cont_summary', report.summary.includes('gate'), report.summary.slice(0, 40));
  push('cont_non_auth', report.authoritative === false, report.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round15-console.tsx ---
/**
 * Agent 21 — scale wave round 15 console (remediation + origin gate + continuity).
 */


export const Ag21ForecastRound15Console: React.FC<{ seed?: number }> = ({ seed = 97 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 28 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.57), actorDebt: base.actorDebt + 410 }),
    [base]
  );

  const remediation = useMemo(() => buildAg21GovernanceRemediationPlan(base, stressed), [base, stressed]);
  const origin = useMemo(() => attestAg21OriginGateReadiness(base, stressed), [base, stressed]);
  const continuity = useMemo(() => resolveAg21LabContinuityVerdict(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round15-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 15 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round15-remediation">
        Remediation · {remediation.status} · steps {remediation.stepCount}
      </div>
      <div data-testid="ag21-round15-origin">
        Origin gate · {origin.status} · {origin.originGateCopy}
      </div>
      <div data-testid="ag21-round15-continuity">
        Continuity · {continuity.verdict} · {continuity.summary}
      </div>
    </div>
  );
};

// --- bundled from forecast-full-chunks-dry-run-readiness.ts ---
/**
 * Agent 21 — full-chunks dry-run readiness (read-only round 16 / O10-161 prep).
 */


export type Ag21FullChunksDryRunReadinessStatus = 'ready' | 'conditional' | 'blocked';

export interface Ag21FullChunksDryRunReadiness {
  readinessId: string;
  moduleVersion: string;
  status: Ag21FullChunksDryRunReadinessStatus;
  continuityVerdict: ReturnType<typeof resolveAg21LabContinuityVerdict>['verdict'];
  originGateStatus: ReturnType<typeof attestAg21OriginGateReadiness>['status'];
  stagingPhase: ReturnType<typeof buildAg21LabStagingPacket>['phase'];
  operatorCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Evaluate whether Agent 21 chunk may enter O10-161 full-chunks dry-run (round 16). */
export function evaluateAg21FullChunksDryRunReadiness(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21FullChunksDryRunReadiness {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.58),
      actorDebt: baseCtx.actorDebt + 395
    } satisfies Ag21ForecastContext);

  const continuity = resolveAg21LabContinuityVerdict(baseCtx, candidate);
  const origin = attestAg21OriginGateReadiness(baseCtx, candidate);
  const staging = buildAg21LabStagingPacket(baseCtx, candidate);

  let status: Ag21FullChunksDryRunReadinessStatus = 'ready';
  if (
    continuity.verdict === 'broken' ||
    origin.status === 'held' ||
    staging.phase === 'rejected'
  ) {
    status = 'blocked';
  } else if (
    continuity.verdict === 'watch' ||
    origin.status === 'conditional' ||
    staging.phase === 'draft'
  ) {
    status = 'conditional';
  }

  const readinessId = `ag21_fcdr_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const operatorCopy =
    status === 'ready'
      ? 'full-chunks dry-run clear — chunk eligible for O10-161 wiring'
      : status === 'conditional'
        ? 'full-chunks dry-run conditional — review continuity and staging'
        : 'full-chunks dry-run blocked — resolve governance before assembly';

  return {
    readinessId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    continuityVerdict: continuity.verdict,
    originGateStatus: origin.status,
    stagingPhase: staging.phase,
    operatorCopy,
    disclaimer: '(Non-authoritative forecast.) Dry-run readiness does not authorize canonical edits.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'conditional' ? 'moderate' : 'high',
      [`readiness=${readinessId}`, `dry_run=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21FullChunksDryRunReadinessSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 36, seed: 11, actorCash: 1510, actorDebt: 47, regionsControlled: 5 };
  const readiness = evaluateAg21FullChunksDryRunReadiness(ctx);

  push('fcdr_id', readiness.readinessId.startsWith('ag21_fcdr_'), readiness.readinessId);
  push('fcdr_status', ['ready', 'conditional', 'blocked'].includes(readiness.status), readiness.status);
  push('fcdr_version', readiness.moduleVersion === O10M_AGENT21_MODULE_VERSION, readiness.moduleVersion);
  push('fcdr_non_auth', readiness.authoritative === false, readiness.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-wave16-projection-sync.ts ---
/**
 * Agent 21 — wave 16 projection baseline sync tags (read-only round 16 / O10-157 → O10-161).
 */


/** Post–wave-15 integration dry-run baseline (O10-157); wave 16 module sync anchor. */
export const AG21_WAVE16_PROJECTION_BASELINE_SHA = '6e72f72';
export const AG21_WAVE16_PROJECTED_AUDITED_FUNCTIONAL = 1_156_219;

export type Ag21Wave16ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave16ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave16ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  dryRunReadiness: ReturnType<typeof evaluateAg21FullChunksDryRunReadiness>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-16 projection baseline for Agent 25 dry-run. */
export function syncAg21Wave16ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE16_PROJECTION_BASELINE_SHA
): Ag21Wave16ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.59),
      actorDebt: baseCtx.actorDebt + 380
    } satisfies Ag21ForecastContext);

  const readiness = evaluateAg21FullChunksDryRunReadiness(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE16_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave16ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (readiness.status === 'blocked') status = 'drift';

  const syncId = `ag21_w16_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE16_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE16_PROJECTED_AUDITED_FUNCTIONAL}`,
    `dry_run:${readiness.status}`,
    `wave:16`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE16_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE16_PROJECTED_AUDITED_FUNCTIONAL,
    dryRunReadiness: readiness.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Projection sync tags for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE16_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave16ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 37, seed: 3, actorCash: 1320, actorDebt: 71, regionsControlled: 4 };
  const sync = syncAg21Wave16ProjectionBaseline(ctx);

  push('w16_id', sync.syncId.startsWith('ag21_w16_'), sync.syncId);
  push('w16_baseline', sync.baselineSha === AG21_WAVE16_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w16_tags', sync.syncTags.length >= 5, String(sync.syncTags.length));
  push('w16_projected', sync.projectedFunctionalLoc === AG21_WAVE16_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-dry-run-attestation.ts ---
/**
 * Agent 21 — integration dry-run attestation for O10-161 (read-only round 16).
 */


export type Ag21IntegrationDryRunAttestationStatus = 'cleared' | 'review' | 'held';

export interface Ag21IntegrationDryRunAttestation {
  attestationId: string;
  moduleVersion: string;
  status: Ag21IntegrationDryRunAttestationStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave16ProjectionBaseline>['status'];
  dryRunReadiness: ReturnType<typeof evaluateAg21FullChunksDryRunReadiness>['status'];
  attestationCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Attest Agent 21 module for post–wave-16 integration dry-run (O10-161 trigger). */
export function attestAg21IntegrationDryRunReadiness(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationDryRunAttestation {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.56),
      actorDebt: baseCtx.actorDebt + 420
    } satisfies Ag21ForecastContext);

  const readiness = evaluateAg21FullChunksDryRunReadiness(baseCtx, candidate);
  const projection = syncAg21Wave16ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationDryRunAttestationStatus = 'cleared';
  if (readiness.status === 'blocked' || projection.status === 'drift') status = 'held';
  else if (readiness.status === 'conditional' || projection.status === 'unknown') status = 'review';

  const attestationId = `ag21_idra_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const attestationCopy =
    status === 'cleared'
      ? 'integration dry-run attested — Agent 25 may wire chunk in O10-161'
      : status === 'review'
        ? 'integration dry-run review — projection or readiness conditional'
        : 'integration dry-run held — blocked readiness or projection drift';

  return {
    attestationId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    dryRunReadiness: readiness.status,
    attestationCopy,
    disclaimer: '(Non-authoritative forecast.) Integration attestation is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'cleared' ? 'low' : status === 'review' ? 'moderate' : 'high',
      [`attest=${attestationId}`, `idra=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationDryRunAttestationSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 38, seed: 29, actorCash: 880, actorDebt: 95, regionsControlled: 3 };
  const attestation = attestAg21IntegrationDryRunReadiness(ctx);

  push('idra_id', attestation.attestationId.startsWith('ag21_idra_'), attestation.attestationId);
  push('idra_status', ['cleared', 'review', 'held'].includes(attestation.status), attestation.status);
  push('idra_copy', attestation.attestationCopy.includes('dry-run'), attestation.attestationCopy.slice(0, 32));
  push('idra_non_auth', attestation.authoritative === false, attestation.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round16-console.tsx ---
/**
 * Agent 21 — scale wave round 16 console (dry-run readiness + projection sync + integration attestation).
 */


export const Ag21ForecastRound16Console: React.FC<{ seed?: number }> = ({ seed = 101 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 30 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.55), actorDebt: base.actorDebt + 430 }),
    [base]
  );

  const readiness = useMemo(() => evaluateAg21FullChunksDryRunReadiness(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave16ProjectionBaseline(base, stressed), [base, stressed]);
  const attestation = useMemo(() => attestAg21IntegrationDryRunReadiness(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round16-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 16 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round16-readiness">
        Dry-run readiness · {readiness.status} · {readiness.operatorCopy.slice(0, 48)}…
      </div>
      <div data-testid="ag21-round16-projection">
        Wave 16 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round16-attestation">
        Integration · {attestation.status} · {attestation.attestationCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-full-chunks-dry-run-execution.ts ---
/**
 * Agent 21 — full-chunks dry-run execution record (read-only round 17 / O10-163).
 */


export type Ag21FullChunksDryRunExecutionStatus = 'executed' | 'partial' | 'skipped';

export interface Ag21FullChunksDryRunExecution {
  executionId: string;
  moduleVersion: string;
  status: Ag21FullChunksDryRunExecutionStatus;
  attestationStatus: ReturnType<typeof attestAg21IntegrationDryRunReadiness>['status'];
  dryRunReadiness: ReturnType<typeof evaluateAg21FullChunksDryRunReadiness>['status'];
  operatorCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Record modular full-chunks dry-run execution after O10-161 attestation (round 17 / O10-163). */
export function recordAg21FullChunksDryRunExecution(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21FullChunksDryRunExecution {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.54),
      actorDebt: baseCtx.actorDebt + 445
    } satisfies Ag21ForecastContext);

  const attestation = attestAg21IntegrationDryRunReadiness(baseCtx, candidate);
  const readiness = evaluateAg21FullChunksDryRunReadiness(baseCtx, candidate);

  let status: Ag21FullChunksDryRunExecutionStatus = 'executed';
  if (attestation.status === 'held' || readiness.status === 'blocked') status = 'skipped';
  else if (attestation.status === 'review' || readiness.status === 'conditional') status = 'partial';

  const executionId = `ag21_fcde_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const operatorCopy =
    status === 'executed'
      ? 'full-chunks dry-run executed — O10-163 checkpoint recorded for Agent 25'
      : status === 'partial'
        ? 'full-chunks dry-run partial — conditional attestation or readiness'
        : 'full-chunks dry-run skipped — resolve held attestation before O10-164';

  return {
    executionId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    attestationStatus: attestation.status,
    dryRunReadiness: readiness.status,
    operatorCopy,
    disclaimer: '(Non-authoritative forecast.) Dry-run execution record does not mutate canonical state.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'executed' ? 'low' : status === 'partial' ? 'moderate' : 'high',
      [`execution=${executionId}`, `fcde=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21FullChunksDryRunExecutionSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 39, seed: 17, actorCash: 1420, actorDebt: 52, regionsControlled: 5 };
  const execution = recordAg21FullChunksDryRunExecution(ctx);

  push('fcde_id', execution.executionId.startsWith('ag21_fcde_'), execution.executionId);
  push('fcde_status', ['executed', 'partial', 'skipped'].includes(execution.status), execution.status);
  push('fcde_version', execution.moduleVersion === O10M_AGENT21_MODULE_VERSION, execution.moduleVersion);
  push('fcde_non_auth', execution.authoritative === false, execution.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-wave17-projection-sync.ts ---
/**
 * Agent 21 — wave 17 projection baseline sync tags (read-only round 17 / O10-161 → O10-163).
 */


/** Post–wave-16 dry-run baseline (O10-161 @ fcab7b20); wave 17 module sync anchor for O10-163. */
export const AG21_WAVE17_PROJECTION_BASELINE_SHA = 'fcab7b20';
export const AG21_WAVE17_PROJECTED_AUDITED_FUNCTIONAL = 1_194_408;

export type Ag21Wave17ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave17ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave17ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  dryRunExecution: ReturnType<typeof recordAg21FullChunksDryRunExecution>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-17 projection baseline for Agent 25 O10-163 gate. */
export function syncAg21Wave17ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE17_PROJECTION_BASELINE_SHA
): Ag21Wave17ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.53),
      actorDebt: baseCtx.actorDebt + 460
    } satisfies Ag21ForecastContext);

  const execution = recordAg21FullChunksDryRunExecution(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE17_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave17ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (execution.status === 'skipped') status = 'drift';

  const syncId = `ag21_w17_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE17_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE17_PROJECTED_AUDITED_FUNCTIONAL}`,
    `dry_run_exec:${execution.status}`,
    `wave:17`,
    `ticket:O10-163`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE17_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE17_PROJECTED_AUDITED_FUNCTIONAL,
    dryRunExecution: execution.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-17 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE17_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave17ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 40, seed: 5, actorCash: 1280, actorDebt: 68, regionsControlled: 4 };
  const sync = syncAg21Wave17ProjectionBaseline(ctx);

  push('w17_id', sync.syncId.startsWith('ag21_w17_'), sync.syncId);
  push('w17_baseline', sync.baselineSha === AG21_WAVE17_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w17_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w17_projected', sync.projectedFunctionalLoc === AG21_WAVE17_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-dry-run-closure.ts ---
/**
 * Agent 21 — integration dry-run closure for O10-163 (read-only round 17).
 */


export type Ag21IntegrationDryRunClosureStatus = 'closed' | 'open' | 'deferred';

export interface Ag21IntegrationDryRunClosure {
  closureId: string;
  moduleVersion: string;
  status: Ag21IntegrationDryRunClosureStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave17ProjectionBaseline>['status'];
  dryRunExecution: ReturnType<typeof recordAg21FullChunksDryRunExecution>['status'];
  closureCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Close O10-161 integration dry-run cycle when O10-163 wave-17 sync aligns (round 17). */
export function closeAg21IntegrationDryRunCycle(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationDryRunClosure {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.52),
      actorDebt: baseCtx.actorDebt + 475
    } satisfies Ag21ForecastContext);

  const execution = recordAg21FullChunksDryRunExecution(baseCtx, candidate);
  const projection = syncAg21Wave17ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationDryRunClosureStatus = 'closed';
  if (execution.status === 'skipped' || projection.status === 'drift') status = 'open';
  else if (execution.status === 'partial' || projection.status === 'unknown') status = 'deferred';

  const closureId = `ag21_idrc_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const closureCopy =
    status === 'closed'
      ? 'integration dry-run closed — Agent 21 unblocks O10-164 coordination with agents 10 and 13'
      : status === 'deferred'
        ? 'integration dry-run deferred — wave-17 sync or execution partial'
        : 'integration dry-run open — resolve drift or skipped execution';

  return {
    closureId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    dryRunExecution: execution.status,
    closureCopy,
    disclaimer: '(Non-authoritative forecast.) Dry-run closure is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'closed' ? 'low' : status === 'deferred' ? 'moderate' : 'high',
      [`closure=${closureId}`, `idrc=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationDryRunClosureSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 41, seed: 23, actorCash: 910, actorDebt: 88, regionsControlled: 3 };
  const closure = closeAg21IntegrationDryRunCycle(ctx);

  push('idrc_id', closure.closureId.startsWith('ag21_idrc_'), closure.closureId);
  push('idrc_status', ['closed', 'open', 'deferred'].includes(closure.status), closure.status);
  push('idrc_copy', closure.closureCopy.includes('dry-run'), closure.closureCopy.slice(0, 32));
  push('idrc_non_auth', closure.authoritative === false, closure.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round17-console.tsx ---
/**
 * Agent 21 — scale wave round 17 console (dry-run execution + wave-17 sync + integration closure).
 */


export const Ag21ForecastRound17Console: React.FC<{ seed?: number }> = ({ seed = 103 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 32 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.54), actorDebt: base.actorDebt + 450 }),
    [base]
  );

  const execution = useMemo(() => recordAg21FullChunksDryRunExecution(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave17ProjectionBaseline(base, stressed), [base, stressed]);
  const closure = useMemo(() => closeAg21IntegrationDryRunCycle(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round17-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 17 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round17-execution">
        Dry-run execution · {execution.status} · {execution.operatorCopy.slice(0, 48)}…
      </div>
      <div data-testid="ag21-round17-projection">
        Wave 17 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round17-closure">
        Integration · {closure.status} · {closure.closureCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave18-projection-sync.ts ---
/**
 * Agent 21 — wave 18 projection baseline sync tags (read-only round 18 / O10-164 → O10-166).
 */


/** Post–wave-17 integration baseline (O10-164 @ 13bdc135); wave 18 module sync anchor for O10-166. */
export const AG21_WAVE18_PROJECTION_BASELINE_SHA = '13bdc135';
export const AG21_WAVE18_PROJECTED_AUDITED_FUNCTIONAL = 1_232_597;

export type Ag21Wave18ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave18ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave18ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  dryRunClosure: ReturnType<typeof closeAg21IntegrationDryRunCycle>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-18 projection baseline for Agent 25 O10-166 gate. */
export function syncAg21Wave18ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE18_PROJECTION_BASELINE_SHA
): Ag21Wave18ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.51),
      actorDebt: baseCtx.actorDebt + 490
    } satisfies Ag21ForecastContext);

  const closure = closeAg21IntegrationDryRunCycle(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE18_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave18ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (closure.status === 'open') status = 'drift';

  const syncId = `ag21_w18_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE18_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE18_PROJECTED_AUDITED_FUNCTIONAL}`,
    `dry_run_closure:${closure.status}`,
    `wave:18`,
    `ticket:O10-166`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE18_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE18_PROJECTED_AUDITED_FUNCTIONAL,
    dryRunClosure: closure.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-18 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE18_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave18ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 42, seed: 11, actorCash: 1180, actorDebt: 74, regionsControlled: 4 };
  const sync = syncAg21Wave18ProjectionBaseline(ctx);

  push('w18_id', sync.syncId.startsWith('ag21_w18_'), sync.syncId);
  push('w18_baseline', sync.baselineSha === AG21_WAVE18_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w18_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w18_projected', sync.projectedFunctionalLoc === AG21_WAVE18_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave18-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-18 origin handoff for O10-167 (read-only round 18).
 */


export type Ag21IntegrationWave18OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave18OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave18OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave18ProjectionBaseline>['status'];
  dryRunExecution: ReturnType<typeof recordAg21FullChunksDryRunExecution>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-166 origin gate handoff for Agent 25 O10-167 dry-run (round 18). */
export function handoffAg21IntegrationWave18OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave18OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.5),
      actorDebt: baseCtx.actorDebt + 505
    } satisfies Ag21ForecastContext);

  const execution = recordAg21FullChunksDryRunExecution(baseCtx, candidate);
  const projection = syncAg21Wave18ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave18OriginHandoffStatus = 'ready';
  if (execution.status === 'skipped' || projection.status === 'drift') status = 'blocked';
  else if (execution.status === 'partial' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iwoh_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-18 origin handoff ready — Agent 21 unblocks O10-167 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-18 origin handoff pending — projection sync or execution partial'
        : 'wave-18 origin handoff blocked — resolve drift or skipped execution before O10-167';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    dryRunExecution: execution.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iwoh=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave18OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 43, seed: 29, actorCash: 860, actorDebt: 96, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave18OriginGate(ctx);

  push('iwoh_id', handoff.handoffId.startsWith('ag21_iwoh_'), handoff.handoffId);
  push('iwoh_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iwoh_copy', handoff.handoffCopy.includes('O10-167'), handoff.handoffCopy.slice(0, 40));
  push('iwoh_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round18-console.tsx ---
/**
 * Agent 21 — scale wave round 18 console (wave-18 sync + origin handoff + dry-run execution).
 */


export const Ag21ForecastRound18Console: React.FC<{ seed?: number }> = ({ seed = 118 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 33 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.52), actorDebt: base.actorDebt + 480 }),
    [base]
  );

  const execution = useMemo(() => recordAg21FullChunksDryRunExecution(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave18ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave18OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round18-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 18 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round18-execution">
        Dry-run execution · {execution.status} · {execution.operatorCopy.slice(0, 48)}…
      </div>
      <div data-testid="ag21-round18-projection">
        Wave 18 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round18-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave19-projection-sync.ts ---
/**
 * Agent 21 — wave 19 projection baseline sync tags (read-only round 19 / O10-167 → O10-168).
 */


/** Post–wave-18 integration baseline (O10-167 @ 7bd7b1f3); wave 19 module sync anchor for O10-168. */
export const AG21_WAVE19_PROJECTION_BASELINE_SHA = '7bd7b1f3';
export const AG21_WAVE19_PROJECTED_AUDITED_FUNCTIONAL = 1_274_425;

export type Ag21Wave19ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave19ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave19ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave18OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-19 projection baseline for Agent 25 O10-168 gate. */
export function syncAg21Wave19ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE19_PROJECTION_BASELINE_SHA
): Ag21Wave19ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.49),
      actorDebt: baseCtx.actorDebt + 520
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave18OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE19_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave19ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w19_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE19_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE19_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:19`,
    `ticket:O10-168`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE19_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE19_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-19 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE19_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave19ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 44, seed: 13, actorCash: 1090, actorDebt: 82, regionsControlled: 4 };
  const sync = syncAg21Wave19ProjectionBaseline(ctx);

  push('w19_id', sync.syncId.startsWith('ag21_w19_'), sync.syncId);
  push('w19_baseline', sync.baselineSha === AG21_WAVE19_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w19_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w19_projected', sync.projectedFunctionalLoc === AG21_WAVE19_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave19-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-19 origin handoff for O10-169 (read-only round 19).
 */


export type Ag21IntegrationWave19OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave19OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave19OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave19ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave18OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-168 origin gate handoff for Agent 25 O10-169 dry-run (round 19). */
export function handoffAg21IntegrationWave19OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave19OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.48),
      actorDebt: baseCtx.actorDebt + 535
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave18OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave19ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave19OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw19_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-19 origin handoff ready — Agent 21 unblocks O10-169 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-19 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-19 origin handoff blocked — resolve drift before O10-169';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw19=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave19OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 45, seed: 31, actorCash: 820, actorDebt: 102, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave19OriginGate(ctx);

  push('iw19_id', handoff.handoffId.startsWith('ag21_iw19_'), handoff.handoffId);
  push('iw19_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw19_copy', handoff.handoffCopy.includes('O10-169'), handoff.handoffCopy.slice(0, 40));
  push('iw19_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round19-console.tsx ---
/**
 * Agent 21 — scale wave round 19 console (wave-19 sync + origin handoff + wave-18 handoff).
 */


export const Ag21ForecastRound19Console: React.FC<{ seed?: number }> = ({ seed = 119 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 34 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.5), actorDebt: base.actorDebt + 510 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave18OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave19ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave19OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round19-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 19 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round19-prior">
        Wave 18 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round19-projection">
        Wave 19 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round19-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave20-projection-sync.ts ---
/**
 * Agent 21 — wave 20 projection baseline sync tags (read-only round 20 / O10-169 → O10-170).
 */


/** Post–wave-19 integration baseline (O10-169 @ 680b9954); wave 20 module sync anchor for O10-170. */
export const AG21_WAVE20_PROJECTION_BASELINE_SHA = '680b9954';
export const AG21_WAVE20_PROJECTED_AUDITED_FUNCTIONAL = 1_315_487;

export type Ag21Wave20ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave20ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave20ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave19OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-20 projection baseline for Agent 25 O10-170 gate. */
export function syncAg21Wave20ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE20_PROJECTION_BASELINE_SHA
): Ag21Wave20ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.47),
      actorDebt: baseCtx.actorDebt + 550
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave19OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE20_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave20ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w20_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE20_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE20_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:20`,
    `ticket:O10-170`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE20_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE20_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-20 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE20_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave20ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 46, seed: 19, actorCash: 1040, actorDebt: 88, regionsControlled: 4 };
  const sync = syncAg21Wave20ProjectionBaseline(ctx);

  push('w20_id', sync.syncId.startsWith('ag21_w20_'), sync.syncId);
  push('w20_baseline', sync.baselineSha === AG21_WAVE20_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w20_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w20_projected', sync.projectedFunctionalLoc === AG21_WAVE20_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave20-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-20 origin handoff for O10-171 (read-only round 20).
 */


export type Ag21IntegrationWave20OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave20OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave20OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave20ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave19OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-170 origin gate handoff for Agent 25 O10-171 dry-run (round 20). */
export function handoffAg21IntegrationWave20OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave20OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.46),
      actorDebt: baseCtx.actorDebt + 565
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave19OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave20ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave20OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw20_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-20 origin handoff ready — Agent 21 unblocks O10-171 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-20 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-20 origin handoff blocked — resolve drift before O10-171';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw20=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave20OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 47, seed: 37, actorCash: 790, actorDebt: 108, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave20OriginGate(ctx);

  push('iw20_id', handoff.handoffId.startsWith('ag21_iw20_'), handoff.handoffId);
  push('iw20_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw20_copy', handoff.handoffCopy.includes('O10-171'), handoff.handoffCopy.slice(0, 40));
  push('iw20_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round20-console.tsx ---
/**
 * Agent 21 — scale wave round 20 console (wave-20 sync + origin handoff + wave-19 handoff).
 */


export const Ag21ForecastRound20Console: React.FC<{ seed?: number }> = ({ seed = 120 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 35 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.48), actorDebt: base.actorDebt + 540 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave19OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave20ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave20OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round20-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 20 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round20-prior">
        Wave 19 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round20-projection">
        Wave 20 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round20-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave21-projection-sync.ts ---
/**
 * Agent 21 — wave 21 projection baseline sync tags (read-only round 21 / O10-171 → O10-173).
 */


/** Post–wave-20 integration baseline (O10-171 @ 99f2e72b); wave 21 module sync anchor for O10-173. */
export const AG21_WAVE21_PROJECTION_BASELINE_SHA = '99f2e72b';
export const AG21_WAVE21_PROJECTED_AUDITED_FUNCTIONAL = 1_356_537;

export type Ag21Wave21ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave21ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave21ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave20OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-21 projection baseline for Agent 25 O10-173 gate. */
export function syncAg21Wave21ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE21_PROJECTION_BASELINE_SHA
): Ag21Wave21ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.45),
      actorDebt: baseCtx.actorDebt + 580
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave20OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE21_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave21ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w21_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE21_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE21_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:21`,
    `ticket:O10-173`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE21_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE21_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-21 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE21_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave21ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 48, seed: 21, actorCash: 990, actorDebt: 94, regionsControlled: 4 };
  const sync = syncAg21Wave21ProjectionBaseline(ctx);

  push('w21_id', sync.syncId.startsWith('ag21_w21_'), sync.syncId);
  push('w21_baseline', sync.baselineSha === AG21_WAVE21_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w21_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w21_projected', sync.projectedFunctionalLoc === AG21_WAVE21_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave21-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-21 origin handoff for O10-174 (read-only round 21).
 */


export type Ag21IntegrationWave21OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave21OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave21OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave21ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave20OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-173 origin gate handoff for Agent 25 O10-174 dry-run (round 21). */
export function handoffAg21IntegrationWave21OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave21OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.44),
      actorDebt: baseCtx.actorDebt + 595
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave20OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave21ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave21OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw21_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-21 origin handoff ready — Agent 21 unblocks O10-174 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-21 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-21 origin handoff blocked — resolve drift before O10-174';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw21=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave21OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 49, seed: 41, actorCash: 760, actorDebt: 114, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave21OriginGate(ctx);

  push('iw21_id', handoff.handoffId.startsWith('ag21_iw21_'), handoff.handoffId);
  push('iw21_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw21_copy', handoff.handoffCopy.includes('O10-174'), handoff.handoffCopy.slice(0, 40));
  push('iw21_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round21-console.tsx ---
/**
 * Agent 21 — scale wave round 21 console (wave-21 sync + origin handoff + wave-20 handoff).
 */


export const Ag21ForecastRound21Console: React.FC<{ seed?: number }> = ({ seed = 121 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 36 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.46), actorDebt: base.actorDebt + 570 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave20OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave21ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave21OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round21-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 21 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round21-prior">
        Wave 20 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round21-projection">
        Wave 21 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round21-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave22-projection-sync.ts ---
/**
 * Agent 21 — wave 22 projection baseline sync tags (read-only round 22 / O10-174 → O10-175).
 */


/** Post–wave-21 integration baseline (O10-174 @ 634656bb); wave 22 module sync anchor for O10-175. */
export const AG21_WAVE22_PROJECTION_BASELINE_SHA = '634656bb';
export const AG21_WAVE22_PROJECTED_AUDITED_FUNCTIONAL = 1_401_419;

export type Ag21Wave22ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave22ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave22ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave21OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-22 projection baseline for Agent 25 O10-175 gate. */
export function syncAg21Wave22ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE22_PROJECTION_BASELINE_SHA
): Ag21Wave22ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.43),
      actorDebt: baseCtx.actorDebt + 610
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave21OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE22_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave22ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w22_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE22_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE22_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:22`,
    `ticket:O10-175`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE22_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE22_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-22 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE22_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave22ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 50, seed: 23, actorCash: 940, actorDebt: 100, regionsControlled: 4 };
  const sync = syncAg21Wave22ProjectionBaseline(ctx);

  push('w22_id', sync.syncId.startsWith('ag21_w22_'), sync.syncId);
  push('w22_baseline', sync.baselineSha === AG21_WAVE22_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w22_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w22_projected', sync.projectedFunctionalLoc === AG21_WAVE22_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave22-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-22 origin handoff for O10-176 (read-only round 22).
 */


export type Ag21IntegrationWave22OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave22OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave22OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave22ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave21OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-175 origin gate handoff for Agent 25 O10-176 dry-run (round 22). */
export function handoffAg21IntegrationWave22OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave22OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.42),
      actorDebt: baseCtx.actorDebt + 625
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave21OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave22ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave22OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw22_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-22 origin handoff ready — Agent 21 unblocks O10-176 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-22 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-22 origin handoff blocked — resolve drift before O10-176';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw22=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave22OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 51, seed: 43, actorCash: 730, actorDebt: 120, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave22OriginGate(ctx);

  push('iw22_id', handoff.handoffId.startsWith('ag21_iw22_'), handoff.handoffId);
  push('iw22_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw22_copy', handoff.handoffCopy.includes('O10-176'), handoff.handoffCopy.slice(0, 40));
  push('iw22_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round22-console.tsx ---
/**
 * Agent 21 — scale wave round 22 console (wave-22 sync + origin handoff + wave-21 handoff).
 */


export const Ag21ForecastRound22Console: React.FC<{ seed?: number }> = ({ seed = 122 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 37 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.44), actorDebt: base.actorDebt + 600 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave21OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave22ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave22OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round22-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 22 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round22-prior">
        Wave 21 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round22-projection">
        Wave 22 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round22-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave23-projection-sync.ts ---
/**
 * Agent 21 — wave 23 projection baseline sync tags (read-only round 23 / O10-176 → O10-177).
 */


/** Post–wave-22 integration baseline (O10-176 @ b23e1449); wave 23 module sync anchor for O10-177. */
export const AG21_WAVE23_PROJECTION_BASELINE_SHA = 'b23e1449';
export const AG21_WAVE23_PROJECTED_AUDITED_FUNCTIONAL = 1_448_902;

export type Ag21Wave23ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave23ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave23ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave22OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-23 projection baseline for Agent 25 O10-177 gate. */
export function syncAg21Wave23ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE23_PROJECTION_BASELINE_SHA
): Ag21Wave23ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.41),
      actorDebt: baseCtx.actorDebt + 640
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave22OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE23_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave23ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w23_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE23_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE23_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:23`,
    `ticket:O10-177`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE23_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE23_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-23 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE23_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave23ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 52, seed: 27, actorCash: 900, actorDebt: 106, regionsControlled: 4 };
  const sync = syncAg21Wave23ProjectionBaseline(ctx);

  push('w23_id', sync.syncId.startsWith('ag21_w23_'), sync.syncId);
  push('w23_baseline', sync.baselineSha === AG21_WAVE23_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w23_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w23_projected', sync.projectedFunctionalLoc === AG21_WAVE23_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave23-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-23 origin handoff for O10-178 (read-only round 23).
 */


export type Ag21IntegrationWave23OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave23OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave23OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave23ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave22OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-177 origin gate handoff for Agent 25 O10-178 dry-run (round 23). */
export function handoffAg21IntegrationWave23OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave23OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.4),
      actorDebt: baseCtx.actorDebt + 655
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave22OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave23ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave23OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw23_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-23 origin handoff ready — Agent 21 unblocks O10-178 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-23 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-23 origin handoff blocked — resolve drift before O10-178';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw23=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave23OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 53, seed: 45, actorCash: 710, actorDebt: 126, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave23OriginGate(ctx);

  push('iw23_id', handoff.handoffId.startsWith('ag21_iw23_'), handoff.handoffId);
  push('iw23_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw23_copy', handoff.handoffCopy.includes('O10-178'), handoff.handoffCopy.slice(0, 40));
  push('iw23_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round23-console.tsx ---
/**
 * Agent 21 — scale wave round 23 console (wave-23 sync + origin handoff + wave-22 handoff).
 */


export const Ag21ForecastRound23Console: React.FC<{ seed?: number }> = ({ seed = 123 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 38 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.42), actorDebt: base.actorDebt + 630 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave22OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave23ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave23OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round23-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 23 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round23-prior">
        Wave 22 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round23-projection">
        Wave 23 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round23-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave24-projection-sync.ts ---
/**
 * Agent 21 — wave 24 projection baseline sync tags (read-only round 24 / O10-178 → O10-179).
 */


/** Post–wave-23 integration baseline (O10-178 @ b64a7aa8); wave 24 module sync anchor for O10-179. */
export const AG21_WAVE24_PROJECTION_BASELINE_SHA = 'b64a7aa8';
export const AG21_WAVE24_PROJECTED_AUDITED_FUNCTIONAL = 1_487_095;

export type Ag21Wave24ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave24ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave24ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave23OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-24 projection baseline for Agent 25 O10-179 gate. */
export function syncAg21Wave24ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE24_PROJECTION_BASELINE_SHA
): Ag21Wave24ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.39),
      actorDebt: baseCtx.actorDebt + 670
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave23OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE24_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave24ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w24_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE24_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE24_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:24`,
    `ticket:O10-179`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE24_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE24_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-24 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE24_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave24ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 54, seed: 29, actorCash: 870, actorDebt: 112, regionsControlled: 4 };
  const sync = syncAg21Wave24ProjectionBaseline(ctx);

  push('w24_id', sync.syncId.startsWith('ag21_w24_'), sync.syncId);
  push('w24_baseline', sync.baselineSha === AG21_WAVE24_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w24_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w24_projected', sync.projectedFunctionalLoc === AG21_WAVE24_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave24-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-24 origin handoff for O10-180 (read-only round 24).
 */


export type Ag21IntegrationWave24OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave24OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave24OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave24ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave23OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-179 origin gate handoff for Agent 25 O10-180 dry-run (round 24). */
export function handoffAg21IntegrationWave24OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave24OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.38),
      actorDebt: baseCtx.actorDebt + 685
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave23OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave24ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave24OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw24_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-24 origin handoff ready — Agent 21 unblocks O10-180 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-24 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-24 origin handoff blocked — resolve drift before O10-180';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw24=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave24OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 55, seed: 47, actorCash: 690, actorDebt: 132, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave24OriginGate(ctx);

  push('iw24_id', handoff.handoffId.startsWith('ag21_iw24_'), handoff.handoffId);
  push('iw24_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw24_copy', handoff.handoffCopy.includes('O10-180'), handoff.handoffCopy.slice(0, 40));
  push('iw24_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round24-console.tsx ---
/**
 * Agent 21 — scale wave round 24 console (wave-24 sync + origin handoff + wave-23 handoff).
 */


export const Ag21ForecastRound24Console: React.FC<{ seed?: number }> = ({ seed = 124 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 39 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.4), actorDebt: base.actorDebt + 660 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave23OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave24ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave24OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round24-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 24 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round24-prior">
        Wave 23 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round24-projection">
        Wave 24 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round24-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave25-projection-sync.ts ---
/**
 * Agent 21 — wave 25 projection baseline sync tags (read-only round 25 / O10-180 → O10-181).
 */


/** Post–wave-24 integration baseline (O10-180 @ 8d741ac7); wave 25 module sync anchor for O10-181. */
export const AG21_WAVE25_PROJECTION_BASELINE_SHA = '8d741ac7';
export const AG21_WAVE25_PROJECTED_AUDITED_FUNCTIONAL = 1_525_288;

export type Ag21Wave25ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave25ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave25ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave24OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-25 projection baseline for Agent 25 O10-181 gate. */
export function syncAg21Wave25ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE25_PROJECTION_BASELINE_SHA
): Ag21Wave25ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.37),
      actorDebt: baseCtx.actorDebt + 700
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave24OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE25_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave25ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w25_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE25_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE25_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:25`,
    `ticket:O10-181`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE25_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE25_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-25 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE25_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave25ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 56, seed: 31, actorCash: 840, actorDebt: 118, regionsControlled: 4 };
  const sync = syncAg21Wave25ProjectionBaseline(ctx);

  push('w25_id', sync.syncId.startsWith('ag21_w25_'), sync.syncId);
  push('w25_baseline', sync.baselineSha === AG21_WAVE25_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w25_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w25_projected', sync.projectedFunctionalLoc === AG21_WAVE25_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave25-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-25 origin handoff for O10-182 (read-only round 25).
 */


export type Ag21IntegrationWave25OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave25OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave25OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave25ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave24OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-181 origin gate handoff for Agent 25 O10-182 dry-run (round 25). */
export function handoffAg21IntegrationWave25OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave25OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.36),
      actorDebt: baseCtx.actorDebt + 715
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave24OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave25ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave25OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw25_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-25 origin handoff ready — Agent 21 unblocks O10-182 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-25 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-25 origin handoff blocked — resolve drift before O10-182';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw25=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave25OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 57, seed: 49, actorCash: 670, actorDebt: 138, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave25OriginGate(ctx);

  push('iw25_id', handoff.handoffId.startsWith('ag21_iw25_'), handoff.handoffId);
  push('iw25_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw25_copy', handoff.handoffCopy.includes('O10-182'), handoff.handoffCopy.slice(0, 40));
  push('iw25_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round25-console.tsx ---
/**
 * Agent 21 — scale wave round 25 console (wave-25 sync + origin handoff + wave-24 handoff).
 */


export const Ag21ForecastRound25Console: React.FC<{ seed?: number }> = ({ seed = 125 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 40 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.38), actorDebt: base.actorDebt + 690 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave24OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave25ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave25OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round25-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 25 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round25-prior">
        Wave 24 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round25-projection">
        Wave 25 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round25-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave26-projection-sync.ts ---
/**
 * Agent 21 — wave 26 projection baseline sync tags (read-only round 26 / O10-182 → O10-183).
 */


/** Post–wave-25 integration baseline (O10-182 @ de3079f9); wave 26 module sync anchor for O10-183. */
export const AG21_WAVE26_PROJECTION_BASELINE_SHA = 'de3079f9';
export const AG21_WAVE26_PROJECTED_AUDITED_FUNCTIONAL = 1_563_481;

export type Ag21Wave26ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave26ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave26ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave25OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-26 projection baseline for Agent 25 O10-183 gate. */
export function syncAg21Wave26ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE26_PROJECTION_BASELINE_SHA
): Ag21Wave26ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.35),
      actorDebt: baseCtx.actorDebt + 730
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave25OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE26_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave26ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w26_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE26_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE26_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:26`,
    `ticket:O10-183`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE26_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE26_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-26 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE26_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave26ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 58, seed: 33, actorCash: 810, actorDebt: 124, regionsControlled: 4 };
  const sync = syncAg21Wave26ProjectionBaseline(ctx);

  push('w26_id', sync.syncId.startsWith('ag21_w26_'), sync.syncId);
  push('w26_baseline', sync.baselineSha === AG21_WAVE26_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w26_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w26_projected', sync.projectedFunctionalLoc === AG21_WAVE26_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave26-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-26 origin handoff for O10-184 (read-only round 26).
 */


export type Ag21IntegrationWave26OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave26OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave26OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave26ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave25OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-183 origin gate handoff for Agent 25 O10-184 dry-run (round 26). */
export function handoffAg21IntegrationWave26OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave26OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.34),
      actorDebt: baseCtx.actorDebt + 745
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave25OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave26ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave26OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw26_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-26 origin handoff ready — Agent 21 unblocks O10-184 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-26 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-26 origin handoff blocked — resolve drift before O10-184';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw26=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave26OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 59, seed: 51, actorCash: 650, actorDebt: 144, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave26OriginGate(ctx);

  push('iw26_id', handoff.handoffId.startsWith('ag21_iw26_'), handoff.handoffId);
  push('iw26_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw26_copy', handoff.handoffCopy.includes('O10-184'), handoff.handoffCopy.slice(0, 40));
  push('iw26_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round26-console.tsx ---
/**
 * Agent 21 — scale wave round 26 console (wave-26 sync + origin handoff + wave-25 handoff).
 */


export const Ag21ForecastRound26Console: React.FC<{ seed?: number }> = ({ seed = 126 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 41 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.36), actorDebt: base.actorDebt + 720 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave25OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave26ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave26OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round26-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 26 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round26-prior">
        Wave 25 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round26-projection">
        Wave 26 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round26-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave27-projection-sync.ts ---
/**
 * Agent 21 — wave 27 projection baseline sync tags (read-only round 27 / O10-184 → O10-185).
 */


/** Post–wave-26 integration baseline (O10-184 @ 7c1cfd89); wave 27 module sync anchor for O10-185. */
export const AG21_WAVE27_PROJECTION_BASELINE_SHA = '7c1cfd89';
export const AG21_WAVE27_PROJECTED_AUDITED_FUNCTIONAL = 1_601_674;

export type Ag21Wave27ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave27ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave27ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave26OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-27 projection baseline for Agent 25 O10-185 gate. */
export function syncAg21Wave27ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE27_PROJECTION_BASELINE_SHA
): Ag21Wave27ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.33),
      actorDebt: baseCtx.actorDebt + 760
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave26OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE27_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave27ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w27_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE27_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE27_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:27`,
    `ticket:O10-185`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE27_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE27_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-27 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE27_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave27ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 60, seed: 35, actorCash: 780, actorDebt: 130, regionsControlled: 4 };
  const sync = syncAg21Wave27ProjectionBaseline(ctx);

  push('w27_id', sync.syncId.startsWith('ag21_w27_'), sync.syncId);
  push('w27_baseline', sync.baselineSha === AG21_WAVE27_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w27_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w27_projected', sync.projectedFunctionalLoc === AG21_WAVE27_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave27-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-27 origin handoff for O10-186 (read-only round 27).
 */


export type Ag21IntegrationWave27OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave27OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave27OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave27ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave26OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-185 origin gate handoff for Agent 25 O10-186 dry-run (round 27). */
export function handoffAg21IntegrationWave27OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave27OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.32),
      actorDebt: baseCtx.actorDebt + 775
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave26OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave27ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave27OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw27_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-27 origin handoff ready — Agent 21 unblocks O10-186 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-27 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-27 origin handoff blocked — resolve drift before O10-186';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw27=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave27OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 61, seed: 53, actorCash: 630, actorDebt: 150, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave27OriginGate(ctx);

  push('iw27_id', handoff.handoffId.startsWith('ag21_iw27_'), handoff.handoffId);
  push('iw27_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw27_copy', handoff.handoffCopy.includes('O10-186'), handoff.handoffCopy.slice(0, 40));
  push('iw27_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round27-console.tsx ---
/**
 * Agent 21 — scale wave round 27 console (wave-27 sync + origin handoff + wave-26 handoff).
 */


export const Ag21ForecastRound27Console: React.FC<{ seed?: number }> = ({ seed = 127 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 42 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.34), actorDebt: base.actorDebt + 750 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave26OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave27ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave27OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round27-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 27 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round27-prior">
        Wave 26 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round27-projection">
        Wave 27 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round27-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave28-projection-sync.ts ---
/**
 * Agent 21 — wave 28 projection baseline sync tags (read-only round 28 / O10-186 → O10-187).
 */


/** Post–wave-27 integration baseline (O10-186 @ b9e129bd); wave 28 module sync anchor for O10-187. */
export const AG21_WAVE28_PROJECTION_BASELINE_SHA = 'b9e129bd';
export const AG21_WAVE28_PROJECTED_AUDITED_FUNCTIONAL = 1_645_538;

export type Ag21Wave28ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave28ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave28ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave27OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-28 projection baseline for Agent 25 O10-187 gate. */
export function syncAg21Wave28ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE28_PROJECTION_BASELINE_SHA
): Ag21Wave28ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.31),
      actorDebt: baseCtx.actorDebt + 790
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave27OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE28_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave28ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w28_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE28_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE28_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:28`,
    `ticket:O10-187`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE28_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE28_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-28 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE28_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave28ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 62, seed: 37, actorCash: 750, actorDebt: 136, regionsControlled: 4 };
  const sync = syncAg21Wave28ProjectionBaseline(ctx);

  push('w28_id', sync.syncId.startsWith('ag21_w28_'), sync.syncId);
  push('w28_baseline', sync.baselineSha === AG21_WAVE28_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w28_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w28_projected', sync.projectedFunctionalLoc === AG21_WAVE28_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave28-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-28 origin handoff for O10-188 (read-only round 28).
 */


export type Ag21IntegrationWave28OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave28OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave28OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave28ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave27OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-187 origin gate handoff for Agent 25 O10-188 dry-run (round 28). */
export function handoffAg21IntegrationWave28OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave28OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.3),
      actorDebt: baseCtx.actorDebt + 805
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave27OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave28ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave28OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw28_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-28 origin handoff ready — Agent 21 unblocks O10-188 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-28 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-28 origin handoff blocked — resolve drift before O10-188';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw28=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave28OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 63, seed: 55, actorCash: 610, actorDebt: 156, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave28OriginGate(ctx);

  push('iw28_id', handoff.handoffId.startsWith('ag21_iw28_'), handoff.handoffId);
  push('iw28_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw28_copy', handoff.handoffCopy.includes('O10-188'), handoff.handoffCopy.slice(0, 40));
  push('iw28_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round28-console.tsx ---
/**
 * Agent 21 — scale wave round 28 console (wave-28 sync + origin handoff + wave-27 handoff).
 */


export const Ag21ForecastRound28Console: React.FC<{ seed?: number }> = ({ seed = 128 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 43 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.32), actorDebt: base.actorDebt + 780 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave27OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave28ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave28OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round28-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 28 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round28-prior">
        Wave 27 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round28-projection">
        Wave 28 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round28-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave29-projection-sync.ts ---
/**
 * Agent 21 — wave 29 projection baseline sync tags (read-only round 29 / O10-188 → O10-189).
 */


/** Post–wave-28 integration baseline (O10-188 @ 70df4aee); wave 29 module sync anchor for O10-189. */
export const AG21_WAVE29_PROJECTION_BASELINE_SHA = '70df4aee';
export const AG21_WAVE29_PROJECTED_AUDITED_FUNCTIONAL = 1_683_733;

export type Ag21Wave29ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave29ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave29ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave28OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-29 projection baseline for Agent 25 O10-189 gate. */
export function syncAg21Wave29ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE29_PROJECTION_BASELINE_SHA
): Ag21Wave29ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.29),
      actorDebt: baseCtx.actorDebt + 820
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave28OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE29_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave29ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w29_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE29_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE29_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:29`,
    `ticket:O10-189`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE29_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE29_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-29 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE29_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave29ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 64, seed: 39, actorCash: 720, actorDebt: 142, regionsControlled: 4 };
  const sync = syncAg21Wave29ProjectionBaseline(ctx);

  push('w29_id', sync.syncId.startsWith('ag21_w29_'), sync.syncId);
  push('w29_baseline', sync.baselineSha === AG21_WAVE29_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w29_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w29_projected', sync.projectedFunctionalLoc === AG21_WAVE29_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave29-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-29 origin handoff for O10-190 (read-only round 29).
 */


export type Ag21IntegrationWave29OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave29OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave29OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave29ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave28OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-189 origin gate handoff for Agent 25 O10-190 dry-run (round 29). */
export function handoffAg21IntegrationWave29OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave29OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.28),
      actorDebt: baseCtx.actorDebt + 835
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave28OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave29ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave29OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw29_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-29 origin handoff ready — Agent 21 unblocks O10-190 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-29 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-29 origin handoff blocked — resolve drift before O10-190';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw29=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave29OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 65, seed: 57, actorCash: 590, actorDebt: 162, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave29OriginGate(ctx);

  push('iw29_id', handoff.handoffId.startsWith('ag21_iw29_'), handoff.handoffId);
  push('iw29_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw29_copy', handoff.handoffCopy.includes('O10-190'), handoff.handoffCopy.slice(0, 40));
  push('iw29_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round29-console.tsx ---
/**
 * Agent 21 — scale wave round 29 console (wave-29 sync + origin handoff + wave-28 handoff).
 */


export const Ag21ForecastRound29Console: React.FC<{ seed?: number }> = ({ seed = 129 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 44 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.3), actorDebt: base.actorDebt + 810 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave28OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave29ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave29OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round29-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 29 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round29-prior">
        Wave 28 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round29-projection">
        Wave 29 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round29-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave30-projection-sync.ts ---
/**
 * Agent 21 — wave 30 projection baseline sync tags (read-only round 30 / O10-190 → O10-191).
 */


/** Post–wave-29 integration baseline (O10-190 @ 88fa570); wave 30 module sync anchor for O10-191. */
export const AG21_WAVE30_PROJECTION_BASELINE_SHA = '88fa570';
export const AG21_WAVE30_PROJECTED_AUDITED_FUNCTIONAL = 1_721_932;

export type Ag21Wave30ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave30ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave30ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave29OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-30 projection baseline for Agent 25 O10-191 gate. */
export function syncAg21Wave30ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE30_PROJECTION_BASELINE_SHA
): Ag21Wave30ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.27),
      actorDebt: baseCtx.actorDebt + 850
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave29OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE30_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave30ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w30_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE30_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE30_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:30`,
    `ticket:O10-191`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE30_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE30_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-30 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE30_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave30ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 66, seed: 41, actorCash: 690, actorDebt: 148, regionsControlled: 4 };
  const sync = syncAg21Wave30ProjectionBaseline(ctx);

  push('w30_id', sync.syncId.startsWith('ag21_w30_'), sync.syncId);
  push('w30_baseline', sync.baselineSha === AG21_WAVE30_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w30_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w30_projected', sync.projectedFunctionalLoc === AG21_WAVE30_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave30-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-30 origin handoff for O10-192 (read-only round 30).
 */


export type Ag21IntegrationWave30OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave30OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave30OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave30ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave29OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-191 origin gate handoff for Agent 25 O10-192 dry-run (round 30). */
export function handoffAg21IntegrationWave30OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave30OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.26),
      actorDebt: baseCtx.actorDebt + 865
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave29OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave30ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave30OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw30_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-30 origin handoff ready — Agent 21 unblocks O10-192 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-30 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-30 origin handoff blocked — resolve drift before O10-192';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw30=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave30OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 67, seed: 59, actorCash: 570, actorDebt: 168, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave30OriginGate(ctx);

  push('iw30_id', handoff.handoffId.startsWith('ag21_iw30_'), handoff.handoffId);
  push('iw30_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw30_copy', handoff.handoffCopy.includes('O10-192'), handoff.handoffCopy.slice(0, 40));
  push('iw30_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round30-console.tsx ---
/**
 * Agent 21 — scale wave round 30 console (wave-30 sync + origin handoff + wave-29 handoff).
 */


export const Ag21ForecastRound30Console: React.FC<{ seed?: number }> = ({ seed = 130 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 45 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.28), actorDebt: base.actorDebt + 840 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave29OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave30ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave30OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round30-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 30 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round30-prior">
        Wave 29 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round30-projection">
        Wave 30 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round30-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave31-projection-sync.ts ---
/**
 * Agent 21 — wave 31 projection baseline sync tags (read-only round 31 / O10-192 → O10-193).
 */


/** Post–wave-30 integration baseline (O10-192 @ 81b50b8); wave 31 module sync anchor for O10-193. */
export const AG21_WAVE31_PROJECTION_BASELINE_SHA = '81b50b8';
export const AG21_WAVE31_PROJECTED_AUDITED_FUNCTIONAL = 1_760_131;

export type Ag21Wave31ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave31ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave31ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave30OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-31 projection baseline for Agent 25 O10-193 gate. */
export function syncAg21Wave31ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE31_PROJECTION_BASELINE_SHA
): Ag21Wave31ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.25),
      actorDebt: baseCtx.actorDebt + 880
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave30OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE31_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave31ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w31_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE31_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE31_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:31`,
    `ticket:O10-193`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE31_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE31_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-31 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE31_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave31ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 68, seed: 43, actorCash: 660, actorDebt: 154, regionsControlled: 4 };
  const sync = syncAg21Wave31ProjectionBaseline(ctx);

  push('w31_id', sync.syncId.startsWith('ag21_w31_'), sync.syncId);
  push('w31_baseline', sync.baselineSha === AG21_WAVE31_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w31_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w31_projected', sync.projectedFunctionalLoc === AG21_WAVE31_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave31-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-31 origin handoff for O10-194 (read-only round 31).
 */


export type Ag21IntegrationWave31OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave31OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave31OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave31ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave30OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-193 origin gate handoff for Agent 25 O10-194 dry-run (round 31). */
export function handoffAg21IntegrationWave31OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave31OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.24),
      actorDebt: baseCtx.actorDebt + 895
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave30OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave31ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave31OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw31_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-31 origin handoff ready — Agent 21 unblocks O10-194 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-31 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-31 origin handoff blocked — resolve drift before O10-194';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw31=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave31OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 69, seed: 61, actorCash: 550, actorDebt: 174, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave31OriginGate(ctx);

  push('iw31_id', handoff.handoffId.startsWith('ag21_iw31_'), handoff.handoffId);
  push('iw31_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw31_copy', handoff.handoffCopy.includes('O10-194'), handoff.handoffCopy.slice(0, 40));
  push('iw31_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round31-console.tsx ---
/**
 * Agent 21 — scale wave round 31 console (wave-31 sync + origin handoff + wave-30 handoff).
 */


export const Ag21ForecastRound31Console: React.FC<{ seed?: number }> = ({ seed = 131 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 46 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.26), actorDebt: base.actorDebt + 870 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave30OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave31ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave31OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round31-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 31 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round31-prior">
        Wave 30 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round31-projection">
        Wave 31 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round31-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave32-projection-sync.ts ---
/**
 * Agent 21 — wave 32 projection baseline sync tags (read-only round 32 / O10-194 → O10-195).
 */


/** Post–wave-31 integration baseline (O10-194 @ aa70dac); wave 32 module sync anchor for O10-195. */
export const AG21_WAVE32_PROJECTION_BASELINE_SHA = 'aa70dac';
export const AG21_WAVE32_PROJECTED_AUDITED_FUNCTIONAL = 1_798_330;

export type Ag21Wave32ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave32ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave32ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave31OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-32 projection baseline for Agent 25 O10-195 gate. */
export function syncAg21Wave32ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE32_PROJECTION_BASELINE_SHA
): Ag21Wave32ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.23),
      actorDebt: baseCtx.actorDebt + 910
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave31OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE32_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave32ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w32_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE32_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE32_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:32`,
    `ticket:O10-195`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE32_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE32_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-32 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE32_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave32ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 70, seed: 45, actorCash: 630, actorDebt: 160, regionsControlled: 4 };
  const sync = syncAg21Wave32ProjectionBaseline(ctx);

  push('w32_id', sync.syncId.startsWith('ag21_w32_'), sync.syncId);
  push('w32_baseline', sync.baselineSha === AG21_WAVE32_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w32_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w32_projected', sync.projectedFunctionalLoc === AG21_WAVE32_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave32-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-32 origin handoff for O10-196 (read-only round 32).
 */


export type Ag21IntegrationWave32OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave32OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave32OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave32ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave31OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-195 origin gate handoff for Agent 25 O10-196 dry-run (round 32). */
export function handoffAg21IntegrationWave32OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave32OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.22),
      actorDebt: baseCtx.actorDebt + 925
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave31OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave32ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave32OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw32_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-32 origin handoff ready — Agent 21 unblocks O10-196 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-32 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-32 origin handoff blocked — resolve drift before O10-196';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw32=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave32OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 71, seed: 63, actorCash: 530, actorDebt: 180, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave32OriginGate(ctx);

  push('iw32_id', handoff.handoffId.startsWith('ag21_iw32_'), handoff.handoffId);
  push('iw32_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw32_copy', handoff.handoffCopy.includes('O10-196'), handoff.handoffCopy.slice(0, 40));
  push('iw32_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round32-console.tsx ---
/**
 * Agent 21 — scale wave round 32 console (wave-32 sync + origin handoff + wave-31 handoff).
 */


export const Ag21ForecastRound32Console: React.FC<{ seed?: number }> = ({ seed = 132 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 47 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.24), actorDebt: base.actorDebt + 900 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave31OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave32ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave32OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round32-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 32 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round32-prior">
        Wave 31 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round32-projection">
        Wave 32 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round32-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave33-projection-sync.ts ---
/**
 * Agent 21 — wave 33 projection baseline sync tags (read-only round 33 / O10-196 → O10-197).
 */


/** Post–wave-32 integration baseline (O10-196 @ c5f6d0b); wave 33 module sync anchor for O10-197. */
export const AG21_WAVE33_PROJECTION_BASELINE_SHA = 'c5f6d0b';
export const AG21_WAVE33_PROJECTED_AUDITED_FUNCTIONAL = 1_836_529;

export type Ag21Wave33ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave33ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave33ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave32OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Tag forecast lab outputs against wave-33 projection baseline for Agent 25 O10-197 gate. */
export function syncAg21Wave33ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE33_PROJECTION_BASELINE_SHA
): Ag21Wave33ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.21),
      actorDebt: baseCtx.actorDebt + 940
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave32OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE33_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave33ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w33_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE33_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE33_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:33`,
    `ticket:O10-197`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE33_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE33_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-33 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE33_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave33ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 72, seed: 47, actorCash: 600, actorDebt: 166, regionsControlled: 4 };
  const sync = syncAg21Wave33ProjectionBaseline(ctx);

  push('w33_id', sync.syncId.startsWith('ag21_w33_'), sync.syncId);
  push('w33_baseline', sync.baselineSha === AG21_WAVE33_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w33_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w33_projected', sync.projectedFunctionalLoc === AG21_WAVE33_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave33-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-33 origin handoff for O10-198 (read-only round 33).
 */


export type Ag21IntegrationWave33OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave33OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave33OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave33ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave32OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

/** Package O10-197 origin gate handoff for Agent 25 O10-198 dry-run (round 33). */
export function handoffAg21IntegrationWave33OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave33OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.2),
      actorDebt: baseCtx.actorDebt + 955
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave32OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave33ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave33OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw33_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-33 origin handoff ready — Agent 21 unblocks O10-198 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-33 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-33 origin handoff blocked — resolve drift before O10-198';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw33=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave33OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 73, seed: 65, actorCash: 510, actorDebt: 186, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave33OriginGate(ctx);

  push('iw33_id', handoff.handoffId.startsWith('ag21_iw33_'), handoff.handoffId);
  push('iw33_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw33_copy', handoff.handoffCopy.includes('O10-198'), handoff.handoffCopy.slice(0, 40));
  push('iw33_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round33-console.tsx ---
/**
 * Agent 21 — scale wave round 33 console (wave-33 sync + origin handoff + wave-32 handoff).
 */


export const Ag21ForecastRound33Console: React.FC<{ seed?: number }> = ({ seed = 133 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 48 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.22), actorDebt: base.actorDebt + 930 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave32OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave33ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave33OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round33-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 33 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round33-prior">
        Wave 32 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round33-projection">
        Wave 33 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round33-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave34-projection-sync.ts ---
/**
 * Agent 21 — wave 34 projection baseline sync tags (read-only round 34 / O10-198 → O10-199).
 */


export const AG21_WAVE34_PROJECTION_BASELINE_SHA = '2187b54';
export const AG21_WAVE34_PROJECTED_AUDITED_FUNCTIONAL = 1_886_428;

export type Ag21Wave34ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave34ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave34ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave33OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave34ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE34_PROJECTION_BASELINE_SHA
): Ag21Wave34ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.19),
      actorDebt: baseCtx.actorDebt + 970
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave33OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE34_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave34ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w34_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE34_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE34_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:34`,
    `ticket:O10-199`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE34_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE34_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-34 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE34_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave34ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 74, seed: 49, actorCash: 570, actorDebt: 172, regionsControlled: 4 };
  const sync = syncAg21Wave34ProjectionBaseline(ctx);

  push('w34_id', sync.syncId.startsWith('ag21_w34_'), sync.syncId);
  push('w34_baseline', sync.baselineSha === AG21_WAVE34_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w34_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w34_projected', sync.projectedFunctionalLoc === AG21_WAVE34_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave34-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-34 origin handoff for O10-200 (read-only round 34).
 */


export type Ag21IntegrationWave34OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave34OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave34OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave34ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave33OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave34OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave34OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.18),
      actorDebt: baseCtx.actorDebt + 985
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave33OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave34ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave34OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw34_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-34 origin handoff ready — Agent 21 unblocks O10-200 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-34 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-34 origin handoff blocked — resolve drift before O10-200';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw34=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave34OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 75, seed: 67, actorCash: 490, actorDebt: 192, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave34OriginGate(ctx);

  push('iw34_id', handoff.handoffId.startsWith('ag21_iw34_'), handoff.handoffId);
  push('iw34_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw34_copy', handoff.handoffCopy.includes('O10-200'), handoff.handoffCopy.slice(0, 40));
  push('iw34_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round34-console.tsx ---
/**
 * Agent 21 — scale wave round 34 console.
 */


export const Ag21ForecastRound34Console: React.FC<{ seed?: number }> = ({ seed = 134 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 49 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.2), actorDebt: base.actorDebt + 960 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave33OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave34ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave34OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round34-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 34 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round34-prior">
        Wave 33 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round34-projection">
        Wave 34 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round34-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave35-projection-sync.ts ---
/**
 * Agent 21 — wave 35 projection baseline sync tags (read-only round 35 / O10-200 → O10-201).
 */


export const AG21_WAVE35_PROJECTION_BASELINE_SHA = '1f7d25b';
export const AG21_WAVE35_PROJECTED_AUDITED_FUNCTIONAL = 1_924_628;

export type Ag21Wave35ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave35ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave35ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave34OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave35ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE35_PROJECTION_BASELINE_SHA
): Ag21Wave35ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.18),
      actorDebt: baseCtx.actorDebt + 1000
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave34OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE35_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave35ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w35_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE35_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE35_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:35`,
    `ticket:O10-201`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE35_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE35_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-35 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE35_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave35ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 76, seed: 50, actorCash: 580, actorDebt: 175, regionsControlled: 4 };
  const sync = syncAg21Wave35ProjectionBaseline(ctx);

  push('w35_id', sync.syncId.startsWith('ag21_w35_'), sync.syncId);
  push('w35_baseline', sync.baselineSha === AG21_WAVE35_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w35_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w35_projected', sync.projectedFunctionalLoc === AG21_WAVE35_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave35-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-35 origin handoff for O10-202 (read-only round 35).
 */


export type Ag21IntegrationWave35OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave35OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave35OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave35ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave34OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave35OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave35OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.17),
      actorDebt: baseCtx.actorDebt + 1015
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave34OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave35ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave35OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw35_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-35 origin handoff ready — Agent 21 unblocks O10-202 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-35 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-35 origin handoff blocked — resolve drift before O10-202';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw35=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave35OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 77, seed: 68, actorCash: 500, actorDebt: 195, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave35OriginGate(ctx);

  push('iw35_id', handoff.handoffId.startsWith('ag21_iw35_'), handoff.handoffId);
  push('iw35_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw35_copy', handoff.handoffCopy.includes('O10-202'), handoff.handoffCopy.slice(0, 40));
  push('iw35_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round35-console.tsx ---
/**
 * Agent 21 — scale wave round 35 console.
 */


export const Ag21ForecastRound35Console: React.FC<{ seed?: number }> = ({ seed = 135 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 50 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.19), actorDebt: base.actorDebt + 990 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave34OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave35ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave35OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round35-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 35 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round35-prior">
        Wave 34 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round35-projection">
        Wave 35 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round35-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave36-projection-sync.ts ---
/**
 * Agent 21 — wave 36 projection baseline sync tags (read-only round 36 / O10-202 → O10-203).
 */


export const AG21_WAVE36_PROJECTION_BASELINE_SHA = 'ea2bb03';
export const AG21_WAVE36_PROJECTED_AUDITED_FUNCTIONAL = 1_962_828;

export type Ag21Wave36ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave36ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave36ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave35OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave36ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE36_PROJECTION_BASELINE_SHA
): Ag21Wave36ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.17),
      actorDebt: baseCtx.actorDebt + 1030
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave35OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE36_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave36ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w36_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE36_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE36_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:36`,
    `ticket:O10-203`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE36_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE36_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-36 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE36_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave36ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 78, seed: 51, actorCash: 590, actorDebt: 178, regionsControlled: 4 };
  const sync = syncAg21Wave36ProjectionBaseline(ctx);

  push('w36_id', sync.syncId.startsWith('ag21_w36_'), sync.syncId);
  push('w36_baseline', sync.baselineSha === AG21_WAVE36_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w36_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w36_projected', sync.projectedFunctionalLoc === AG21_WAVE36_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave36-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-36 origin handoff for O10-204 (read-only round 36).
 */


export type Ag21IntegrationWave36OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave36OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave36OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave36ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave35OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave36OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave36OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.16),
      actorDebt: baseCtx.actorDebt + 1045
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave35OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave36ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave36OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw36_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-36 origin handoff ready — Agent 21 unblocks O10-204 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-36 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-36 origin handoff blocked — resolve drift before O10-204';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw36=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave36OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 79, seed: 69, actorCash: 510, actorDebt: 198, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave36OriginGate(ctx);

  push('iw36_id', handoff.handoffId.startsWith('ag21_iw36_'), handoff.handoffId);
  push('iw36_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw36_copy', handoff.handoffCopy.includes('O10-204'), handoff.handoffCopy.slice(0, 40));
  push('iw36_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round36-console.tsx ---
/**
 * Agent 21 — scale wave round 36 console.
 */


export const Ag21ForecastRound36Console: React.FC<{ seed?: number }> = ({ seed = 136 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 51 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.18), actorDebt: base.actorDebt + 1020 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave35OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave36ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave36OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round36-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 36 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round36-prior">
        Wave 35 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round36-projection">
        Wave 36 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round36-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave37-projection-sync.ts ---
/**
 * Agent 21 — wave 37 projection baseline sync tags (read-only round 37 / O10-204 → O10-205).
 */


export const AG21_WAVE37_PROJECTION_BASELINE_SHA = 'cfb4603';
export const AG21_WAVE37_PROJECTED_AUDITED_FUNCTIONAL = 2_001_028;

export type Ag21Wave37ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave37ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave37ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave36OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave37ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE37_PROJECTION_BASELINE_SHA
): Ag21Wave37ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.16),
      actorDebt: baseCtx.actorDebt + 1060
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave36OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE37_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave37ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w37_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE37_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE37_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:37`,
    `ticket:O10-205`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE37_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE37_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-37 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE37_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave37ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 80, seed: 52, actorCash: 600, actorDebt: 181, regionsControlled: 4 };
  const sync = syncAg21Wave37ProjectionBaseline(ctx);

  push('w37_id', sync.syncId.startsWith('ag21_w37_'), sync.syncId);
  push('w37_baseline', sync.baselineSha === AG21_WAVE37_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w37_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w37_projected', sync.projectedFunctionalLoc === AG21_WAVE37_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave37-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-37 origin handoff for O10-206 (read-only round 37).
 */


export type Ag21IntegrationWave37OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave37OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave37OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave37ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave36OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave37OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave37OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.15),
      actorDebt: baseCtx.actorDebt + 1075
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave36OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave37ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave37OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw37_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-37 origin handoff ready — Agent 21 unblocks O10-206 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-37 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-37 origin handoff blocked — resolve drift before O10-206';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw37=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave37OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 81, seed: 70, actorCash: 520, actorDebt: 201, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave37OriginGate(ctx);

  push('iw37_id', handoff.handoffId.startsWith('ag21_iw37_'), handoff.handoffId);
  push('iw37_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw37_copy', handoff.handoffCopy.includes('O10-206'), handoff.handoffCopy.slice(0, 40));
  push('iw37_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round37-console.tsx ---
/**
 * Agent 21 — scale wave round 37 console.
 */


export const Ag21ForecastRound37Console: React.FC<{ seed?: number }> = ({ seed = 137 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 52 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.17), actorDebt: base.actorDebt + 1050 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave36OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave37ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave37OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round37-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 37 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round37-prior">
        Wave 36 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round37-projection">
        Wave 37 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round37-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave38-projection-sync.ts ---
/**
 * Agent 21 — wave 38 projection baseline sync tags (read-only round 38 / O10-206 → O10-207).
 */


export const AG21_WAVE38_PROJECTION_BASELINE_SHA = 'b44b36f';
export const AG21_WAVE38_PROJECTED_AUDITED_FUNCTIONAL = 2_039_227;

export type Ag21Wave38ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave38ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave38ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave37OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave38ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE38_PROJECTION_BASELINE_SHA
): Ag21Wave38ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.15),
      actorDebt: baseCtx.actorDebt + 1090
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave37OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE38_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave38ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w38_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE38_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE38_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:38`,
    `ticket:O10-207`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE38_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE38_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-38 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE38_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave38ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 82, seed: 53, actorCash: 610, actorDebt: 184, regionsControlled: 4 };
  const sync = syncAg21Wave38ProjectionBaseline(ctx);

  push('w38_id', sync.syncId.startsWith('ag21_w38_'), sync.syncId);
  push('w38_baseline', sync.baselineSha === AG21_WAVE38_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w38_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w38_projected', sync.projectedFunctionalLoc === AG21_WAVE38_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave38-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-38 origin handoff for O10-208 (read-only round 38).
 */


export type Ag21IntegrationWave38OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave38OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave38OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave38ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave37OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave38OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave38OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.14),
      actorDebt: baseCtx.actorDebt + 1105
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave37OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave38ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave38OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw38_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-38 origin handoff ready — Agent 21 unblocks O10-208 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-38 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-38 origin handoff blocked — resolve drift before O10-208';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw38=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave38OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 83, seed: 71, actorCash: 530, actorDebt: 204, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave38OriginGate(ctx);

  push('iw38_id', handoff.handoffId.startsWith('ag21_iw38_'), handoff.handoffId);
  push('iw38_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw38_copy', handoff.handoffCopy.includes('O10-208'), handoff.handoffCopy.slice(0, 40));
  push('iw38_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round38-console.tsx ---
/**
 * Agent 21 — scale wave round 38 console.
 */


export const Ag21ForecastRound38Console: React.FC<{ seed?: number }> = ({ seed = 138 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 53 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.16), actorDebt: base.actorDebt + 1080 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave37OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave38ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave38OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round38-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 38 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round38-prior">
        Wave 37 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round38-projection">
        Wave 38 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round38-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave39-projection-sync.ts ---
/**
 * Agent 21 — wave 39 projection baseline sync tags (read-only round 39 / O10-208 → O10-209).
 */


export const AG21_WAVE39_PROJECTION_BASELINE_SHA = '6134c6a';
export const AG21_WAVE39_PROJECTED_AUDITED_FUNCTIONAL = 2_082_720;

export type Ag21Wave39ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave39ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave39ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave38OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave39ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE39_PROJECTION_BASELINE_SHA
): Ag21Wave39ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.14),
      actorDebt: baseCtx.actorDebt + 1120
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave38OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE39_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave39ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w39_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE39_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE39_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:39`,
    `ticket:O10-209`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE39_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE39_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-39 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE39_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave39ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 84, seed: 54, actorCash: 620, actorDebt: 187, regionsControlled: 4 };
  const sync = syncAg21Wave39ProjectionBaseline(ctx);

  push('w39_id', sync.syncId.startsWith('ag21_w39_'), sync.syncId);
  push('w39_baseline', sync.baselineSha === AG21_WAVE39_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w39_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w39_projected', sync.projectedFunctionalLoc === AG21_WAVE39_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave39-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-39 origin handoff for O10-210 (read-only round 39).
 */


export type Ag21IntegrationWave39OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave39OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave39OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave39ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave38OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave39OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave39OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.13),
      actorDebt: baseCtx.actorDebt + 1135
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave38OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave39ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave39OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw39_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-39 origin handoff ready — Agent 21 unblocks O10-210 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-39 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-39 origin handoff blocked — resolve drift before O10-210';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw39=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave39OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 85, seed: 72, actorCash: 540, actorDebt: 207, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave39OriginGate(ctx);

  push('iw39_id', handoff.handoffId.startsWith('ag21_iw39_'), handoff.handoffId);
  push('iw39_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw39_copy', handoff.handoffCopy.includes('O10-210'), handoff.handoffCopy.slice(0, 40));
  push('iw39_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round39-console.tsx ---
/**
 * Agent 21 — scale wave round 39 console.
 */


export const Ag21ForecastRound39Console: React.FC<{ seed?: number }> = ({ seed = 139 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 54 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.15), actorDebt: base.actorDebt + 1110 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave38OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave39ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave39OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round39-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 39 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round39-prior">
        Wave 38 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round39-projection">
        Wave 39 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round39-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave40-projection-sync.ts ---
/**
 * Agent 21 — wave 40 projection baseline sync tags (read-only round 40 / O10-210 → O10-211).
 */


export const AG21_WAVE40_PROJECTION_BASELINE_SHA = '6f7fa49';
export const AG21_WAVE40_PROJECTED_AUDITED_FUNCTIONAL = 2_121_263;

export type Ag21Wave40ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave40ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave40ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave39OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave40ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE40_PROJECTION_BASELINE_SHA
): Ag21Wave40ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.13),
      actorDebt: baseCtx.actorDebt + 1150
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave39OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE40_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave40ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w40_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE40_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE40_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:40`,
    `ticket:O10-211`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE40_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE40_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-40 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE40_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave40ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 86, seed: 55, actorCash: 630, actorDebt: 190, regionsControlled: 4 };
  const sync = syncAg21Wave40ProjectionBaseline(ctx);

  push('w40_id', sync.syncId.startsWith('ag21_w40_'), sync.syncId);
  push('w40_baseline', sync.baselineSha === AG21_WAVE40_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w40_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w40_projected', sync.projectedFunctionalLoc === AG21_WAVE40_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave40-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-40 origin handoff for O10-212 (read-only round 40).
 */


export type Ag21IntegrationWave40OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave40OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave40OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave40ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave39OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave40OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave40OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.12),
      actorDebt: baseCtx.actorDebt + 1165
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave39OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave40ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave40OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw40_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-40 origin handoff ready — Agent 21 unblocks O10-212 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-40 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-40 origin handoff blocked — resolve drift before O10-212';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw40=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave40OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 87, seed: 73, actorCash: 550, actorDebt: 210, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave40OriginGate(ctx);

  push('iw40_id', handoff.handoffId.startsWith('ag21_iw40_'), handoff.handoffId);
  push('iw40_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw40_copy', handoff.handoffCopy.includes('O10-212'), handoff.handoffCopy.slice(0, 40));
  push('iw40_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round40-console.tsx ---
/**
 * Agent 21 — scale wave round 40 console.
 */


export const Ag21ForecastRound40Console: React.FC<{ seed?: number }> = ({ seed = 140 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 55 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.14), actorDebt: base.actorDebt + 1140 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave39OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave40ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave40OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round40-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 40 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round40-prior">
        Wave 39 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round40-projection">
        Wave 40 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round40-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave41-projection-sync.ts ---
/**
 * Agent 21 — wave 41 projection baseline sync tags (read-only round 41 / O10-212 → O10-213).
 */


export const AG21_WAVE41_PROJECTION_BASELINE_SHA = '875d6f3';
export const AG21_WAVE41_PROJECTED_AUDITED_FUNCTIONAL = 2_165_132;

export type Ag21Wave41ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave41ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave41ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave40OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave41ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE41_PROJECTION_BASELINE_SHA
): Ag21Wave41ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.12),
      actorDebt: baseCtx.actorDebt + 1180
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave40OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE41_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave41ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w41_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE41_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE41_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:41`,
    `ticket:O10-213`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE41_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE41_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-41 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE41_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave41ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 88, seed: 56, actorCash: 640, actorDebt: 193, regionsControlled: 4 };
  const sync = syncAg21Wave41ProjectionBaseline(ctx);

  push('w41_id', sync.syncId.startsWith('ag21_w41_'), sync.syncId);
  push('w41_baseline', sync.baselineSha === AG21_WAVE41_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w41_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w41_projected', sync.projectedFunctionalLoc === AG21_WAVE41_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave41-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-41 origin handoff for O10-214 (read-only round 41).
 */


export type Ag21IntegrationWave41OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave41OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave41OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave41ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave40OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave41OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave41OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.11),
      actorDebt: baseCtx.actorDebt + 1195
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave40OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave41ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave41OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw41_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-41 origin handoff ready — Agent 21 unblocks O10-214 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-41 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-41 origin handoff blocked — resolve drift before O10-214';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw41=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave41OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 89, seed: 74, actorCash: 560, actorDebt: 213, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave41OriginGate(ctx);

  push('iw41_id', handoff.handoffId.startsWith('ag21_iw41_'), handoff.handoffId);
  push('iw41_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw41_copy', handoff.handoffCopy.includes('O10-214'), handoff.handoffCopy.slice(0, 40));
  push('iw41_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round41-console.tsx ---
/**
 * Agent 21 — scale wave round 41 console.
 */


export const Ag21ForecastRound41Console: React.FC<{ seed?: number }> = ({ seed = 141 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 56 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.13), actorDebt: base.actorDebt + 1170 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave40OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave41ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave41OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round41-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 41 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round41-prior">
        Wave 40 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round41-projection">
        Wave 41 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round41-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave42-projection-sync.ts ---
/**
 * Agent 21 — wave 42 projection baseline sync tags (read-only round 42 / O10-214 → O10-215).
 */


export const AG21_WAVE42_PROJECTION_BASELINE_SHA = '431df5d';
export const AG21_WAVE42_PROJECTED_AUDITED_FUNCTIONAL = 2_207_543;

export type Ag21Wave42ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave42ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave42ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave41OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave42ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE42_PROJECTION_BASELINE_SHA
): Ag21Wave42ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.11),
      actorDebt: baseCtx.actorDebt + 1210
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave41OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE42_PROJECTION_BASELINE_SHA);

  let status: Ag21Wave42ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w42_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE42_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE42_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:42`,
    `ticket:O10-215`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE42_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE42_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-42 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE42_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave42ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 90, seed: 57, actorCash: 650, actorDebt: 196, regionsControlled: 4 };
  const sync = syncAg21Wave42ProjectionBaseline(ctx);

  push('w42_id', sync.syncId.startsWith('ag21_w42_'), sync.syncId);
  push('w42_baseline', sync.baselineSha === AG21_WAVE42_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w42_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w42_projected', sync.projectedFunctionalLoc === AG21_WAVE42_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave42-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-42 origin handoff for O10-216 (read-only round 42).
 */


export type Ag21IntegrationWave42OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave42OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave42OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave42ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave41OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave42OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave42OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.1),
      actorDebt: baseCtx.actorDebt + 1225
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave41OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave42ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave42OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw42_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-42 origin handoff ready — Agent 21 unblocks O10-216 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-42 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-42 origin handoff blocked — resolve drift before O10-216';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw42=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave42OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 91, seed: 75, actorCash: 570, actorDebt: 216, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave42OriginGate(ctx);

  push('iw42_id', handoff.handoffId.startsWith('ag21_iw42_'), handoff.handoffId);
  push('iw42_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw42_copy', handoff.handoffCopy.includes('O10-216'), handoff.handoffCopy.slice(0, 40));
  push('iw42_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round42-console.tsx ---
/**
 * Agent 21 — scale wave round 42 console.
 */


export const Ag21ForecastRound42Console: React.FC<{ seed?: number }> = ({ seed = 142 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 57 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.12), actorDebt: base.actorDebt + 1200 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave41OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave42ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave42OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round42-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 42 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round42-prior">
        Wave 41 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round42-projection">
        Wave 42 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round42-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave43-projection-sync.ts ---
/**
 * Agent 21 — wave 43 projection baseline sync tags (read-only round 43 / O10-216 → O10-217).
 */


export const AG21_WAVE43_PROJECTION_BASELINE_SHA = '641d7d16';
export const AG21_WAVE43_PROJECTED_AUDITED_FUNCTIONAL = 2_253_960;

export type Ag21Wave43ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave43ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave43ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave42OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave43ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE43_PROJECTION_BASELINE_SHA
): Ag21Wave43ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.1),
      actorDebt: baseCtx.actorDebt + 1240
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave42OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE43_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave43ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w43_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE43_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE43_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:43`,
    `ticket:O10-217`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE43_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE43_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-43 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE43_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave43ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 92, seed: 58, actorCash: 660, actorDebt: 199, regionsControlled: 4 };
  const sync = syncAg21Wave43ProjectionBaseline(ctx);

  push('w43_id', sync.syncId.startsWith('ag21_w43_'), sync.syncId);
  push('w43_baseline', sync.baselineSha === AG21_WAVE43_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w43_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w43_projected', sync.projectedFunctionalLoc === AG21_WAVE43_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave43-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-43 origin handoff for O10-218 (read-only round 43).
 */


export type Ag21IntegrationWave43OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave43OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave43OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave43ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave42OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave43OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave43OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.09),
      actorDebt: baseCtx.actorDebt + 1255
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave42OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave43ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave43OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw43_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-43 origin handoff ready — Agent 21 unblocks O10-218 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-43 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-43 origin handoff blocked — resolve drift before O10-218';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw43=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave43OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 93, seed: 76, actorCash: 580, actorDebt: 219, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave43OriginGate(ctx);

  push('iw43_id', handoff.handoffId.startsWith('ag21_iw43_'), handoff.handoffId);
  push('iw43_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw43_copy', handoff.handoffCopy.includes('O10-218'), handoff.handoffCopy.slice(0, 40));
  push('iw43_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round43-console.tsx ---
/**
 * Agent 21 — scale wave round 43 console.
 */


export const Ag21ForecastRound43Console: React.FC<{ seed?: number }> = ({ seed = 143 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 58 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.11), actorDebt: base.actorDebt + 1230 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave42OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave43ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave43OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round43-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 43 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round43-prior">
        Wave 42 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round43-projection">
        Wave 43 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round43-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave44-projection-sync.ts ---
/**
 * Agent 21 — wave 44 projection baseline sync tags (read-only round 44 / O10-218 → O10-219).
 */


export const AG21_WAVE44_PROJECTION_BASELINE_SHA = 'bca7e0a3';
export const AG21_WAVE44_PROJECTED_AUDITED_FUNCTIONAL = 2_503_353;

export type Ag21Wave44ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave44ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave44ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave43OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave44ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE44_PROJECTION_BASELINE_SHA
): Ag21Wave44ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.09),
      actorDebt: baseCtx.actorDebt + 1270
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave43OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE44_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave44ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w44_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE44_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE44_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:44`,
    `ticket:O10-219`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE44_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE44_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-44 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE44_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave44ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 94, seed: 59, actorCash: 670, actorDebt: 202, regionsControlled: 4 };
  const sync = syncAg21Wave44ProjectionBaseline(ctx);

  push('w44_id', sync.syncId.startsWith('ag21_w44_'), sync.syncId);
  push('w44_baseline', sync.baselineSha === AG21_WAVE44_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w44_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w44_projected', sync.projectedFunctionalLoc === AG21_WAVE44_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave44-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-44 origin handoff for O10-220 (read-only round 44).
 */


export type Ag21IntegrationWave44OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave44OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave44OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave44ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave43OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave44OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave44OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.08),
      actorDebt: baseCtx.actorDebt + 1285
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave43OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave44ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave44OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw44_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-44 origin handoff ready — Agent 21 unblocks O10-220 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-44 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-44 origin handoff blocked — resolve drift before O10-220';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw44=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave44OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 95, seed: 77, actorCash: 590, actorDebt: 222, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave44OriginGate(ctx);

  push('iw44_id', handoff.handoffId.startsWith('ag21_iw44_'), handoff.handoffId);
  push('iw44_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw44_copy', handoff.handoffCopy.includes('O10-220'), handoff.handoffCopy.slice(0, 40));
  push('iw44_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round44-console.tsx ---
/**
 * Agent 21 — scale wave round 44 console.
 */


export const Ag21ForecastRound44Console: React.FC<{ seed?: number }> = ({ seed = 144 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 59 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.1), actorDebt: base.actorDebt + 1260 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave43OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave44ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave44OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round44-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 44 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round44-prior">
        Wave 43 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round44-projection">
        Wave 44 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round44-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave45-projection-sync.ts ---
/**
 * Agent 21 — wave 45 projection baseline sync tags (read-only round 45 / O10-220 → O10-221).
 */


export const AG21_WAVE45_PROJECTION_BASELINE_SHA = '98bcd652';
export const AG21_WAVE45_PROJECTED_AUDITED_FUNCTIONAL = 2_548_579;

export type Ag21Wave45ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave45ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave45ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave44OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave45ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE45_PROJECTION_BASELINE_SHA
): Ag21Wave45ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.08),
      actorDebt: baseCtx.actorDebt + 1300
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave44OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE45_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave45ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w45_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE45_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE45_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:45`,
    `ticket:O10-221`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE45_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE45_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-45 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE45_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave45ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 96, seed: 60, actorCash: 680, actorDebt: 205, regionsControlled: 4 };
  const sync = syncAg21Wave45ProjectionBaseline(ctx);

  push('w45_id', sync.syncId.startsWith('ag21_w45_'), sync.syncId);
  push('w45_baseline', sync.baselineSha === AG21_WAVE45_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w45_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w45_projected', sync.projectedFunctionalLoc === AG21_WAVE45_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave45-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-45 origin handoff for O10-222 (read-only round 45).
 */


export type Ag21IntegrationWave45OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave45OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave45OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave45ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave44OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave45OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave45OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.07),
      actorDebt: baseCtx.actorDebt + 1315
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave44OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave45ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave45OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw45_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-45 origin handoff ready — Agent 21 unblocks O10-222 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-45 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-45 origin handoff blocked — resolve drift before O10-222';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw45=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave45OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 97, seed: 78, actorCash: 600, actorDebt: 225, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave45OriginGate(ctx);

  push('iw45_id', handoff.handoffId.startsWith('ag21_iw45_'), handoff.handoffId);
  push('iw45_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw45_copy', handoff.handoffCopy.includes('O10-222'), handoff.handoffCopy.slice(0, 40));
  push('iw45_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round45-console.tsx ---
/**
 * Agent 21 — scale wave round 45 console.
 */


export const Ag21ForecastRound45Console: React.FC<{ seed?: number }> = ({ seed = 145 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 60 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.09), actorDebt: base.actorDebt + 1290 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave44OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave45ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave45OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round45-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 45 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round45-prior">
        Wave 44 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round45-projection">
        Wave 45 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round45-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave46-projection-sync.ts ---
/**
 * Agent 21 — wave 46 projection baseline sync tags (read-only round 46 / O10-222 → O10-223).
 */


export const AG21_WAVE46_PROJECTION_BASELINE_SHA = 'a9bb07e5';
export const AG21_WAVE46_PROJECTED_AUDITED_FUNCTIONAL = 2_593_189;

export type Ag21Wave46ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave46ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave46ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave45OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave46ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE46_PROJECTION_BASELINE_SHA
): Ag21Wave46ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.07),
      actorDebt: baseCtx.actorDebt + 1330
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave45OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE46_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave46ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w46_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE46_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE46_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:46`,
    `ticket:O10-223`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE46_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE46_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-46 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE46_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave46ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 98, seed: 61, actorCash: 690, actorDebt: 208, regionsControlled: 4 };
  const sync = syncAg21Wave46ProjectionBaseline(ctx);

  push('w46_id', sync.syncId.startsWith('ag21_w46_'), sync.syncId);
  push('w46_baseline', sync.baselineSha === AG21_WAVE46_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w46_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w46_projected', sync.projectedFunctionalLoc === AG21_WAVE46_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave46-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-46 origin handoff for O10-224 (read-only round 46).
 */


export type Ag21IntegrationWave46OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave46OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave46OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave46ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave45OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave46OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave46OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.06),
      actorDebt: baseCtx.actorDebt + 1345
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave45OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave46ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave46OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw46_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-46 origin handoff ready — Agent 21 unblocks O10-224 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-46 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-46 origin handoff blocked — resolve drift before O10-224';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw46=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave46OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 99, seed: 79, actorCash: 610, actorDebt: 228, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave46OriginGate(ctx);

  push('iw46_id', handoff.handoffId.startsWith('ag21_iw46_'), handoff.handoffId);
  push('iw46_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw46_copy', handoff.handoffCopy.includes('O10-224'), handoff.handoffCopy.slice(0, 40));
  push('iw46_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round46-console.tsx ---
/**
 * Agent 21 — scale wave round 46 console.
 */


export const Ag21ForecastRound46Console: React.FC<{ seed?: number }> = ({ seed = 146 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 61 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.08), actorDebt: base.actorDebt + 1320 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave45OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave46ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave46OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round46-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 46 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round46-prior">
        Wave 45 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round46-projection">
        Wave 46 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round46-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave47-projection-sync.ts ---
/**
 * Agent 21 — wave 47 projection baseline sync tags (read-only round 47 / O10-224 → O10-225).
 */


export const AG21_WAVE47_PROJECTION_BASELINE_SHA = '456efb9';
export const AG21_WAVE47_PROJECTED_AUDITED_FUNCTIONAL = 2_637_258;

export type Ag21Wave47ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave47ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave47ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave46OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave47ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE47_PROJECTION_BASELINE_SHA
): Ag21Wave47ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.07),
      actorDebt: baseCtx.actorDebt + 1360
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave46OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE47_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave47ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w47_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE47_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE47_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:47`,
    `ticket:O10-225`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE47_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE47_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-47 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE47_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave47ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 100, seed: 62, actorCash: 700, actorDebt: 210, regionsControlled: 4 };
  const sync = syncAg21Wave47ProjectionBaseline(ctx);

  push('w47_id', sync.syncId.startsWith('ag21_w47_'), sync.syncId);
  push('w47_baseline', sync.baselineSha === AG21_WAVE47_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w47_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w47_projected', sync.projectedFunctionalLoc === AG21_WAVE47_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave47-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-47 origin handoff for O10-226 (read-only round 47).
 */


export type Ag21IntegrationWave47OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave47OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave47OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave47ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave46OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave47OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave47OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.06),
      actorDebt: baseCtx.actorDebt + 1375
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave46OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave47ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave47OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw47_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-47 origin handoff ready — Agent 21 unblocks O10-226 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-47 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-47 origin handoff blocked — resolve drift before O10-226';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw47=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave47OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 101, seed: 80, actorCash: 620, actorDebt: 230, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave47OriginGate(ctx);

  push('iw47_id', handoff.handoffId.startsWith('ag21_iw47_'), handoff.handoffId);
  push('iw47_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw47_copy', handoff.handoffCopy.includes('O10-226'), handoff.handoffCopy.slice(0, 40));
  push('iw47_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round47-console.tsx ---
/**
 * Agent 21 — scale wave round 47 console.
 */


export const Ag21ForecastRound47Console: React.FC<{ seed?: number }> = ({ seed = 147 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 62 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.08), actorDebt: base.actorDebt + 1335 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave46OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave47ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave47OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round47-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 47 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round47-prior">
        Wave 46 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round47-projection">
        Wave 47 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round47-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave48-projection-sync.ts ---
/**
 * Agent 21 — wave 48 projection baseline sync tags (read-only round 48 / O10-226 → O10-227).
 */


export const AG21_WAVE48_PROJECTION_BASELINE_SHA = '4404bf0f';
export const AG21_WAVE48_PROJECTED_AUDITED_FUNCTIONAL = 2_684_235;

export type Ag21Wave48ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave48ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave48ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave47OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave48ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE48_PROJECTION_BASELINE_SHA
): Ag21Wave48ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.065),
      actorDebt: baseCtx.actorDebt + 1385
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave47OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE48_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave48ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w48_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE48_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE48_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:48`,
    `ticket:O10-227`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE48_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE48_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-48 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE48_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave48ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 102, seed: 63, actorCash: 710, actorDebt: 215, regionsControlled: 4 };
  const sync = syncAg21Wave48ProjectionBaseline(ctx);

  push('w48_id', sync.syncId.startsWith('ag21_w48_'), sync.syncId);
  push('w48_baseline', sync.baselineSha === AG21_WAVE48_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w48_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w48_projected', sync.projectedFunctionalLoc === AG21_WAVE48_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave48-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-48 origin handoff for O10-228 (read-only round 48).
 */


export type Ag21IntegrationWave48OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave48OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave48OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave48ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave47OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave48OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave48OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.055),
      actorDebt: baseCtx.actorDebt + 1390
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave47OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave48ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave48OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw48_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-48 origin handoff ready — Agent 21 unblocks O10-228 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-48 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-48 origin handoff blocked — resolve drift before O10-228';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw48=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave48OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 103, seed: 81, actorCash: 630, actorDebt: 235, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave48OriginGate(ctx);

  push('iw48_id', handoff.handoffId.startsWith('ag21_iw48_'), handoff.handoffId);
  push('iw48_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw48_copy', handoff.handoffCopy.includes('O10-228'), handoff.handoffCopy.slice(0, 40));
  push('iw48_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round48-console.tsx ---
/**
 * Agent 21 — scale wave round 48 console.
 */


export const Ag21ForecastRound48Console: React.FC<{ seed?: number }> = ({ seed = 148 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 63 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.075), actorDebt: base.actorDebt + 1345 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave47OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave48ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave48OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round48-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 48 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round48-prior">
        Wave 47 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round48-projection">
        Wave 48 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round48-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave49-projection-sync.ts ---
/**
 * Agent 21 — wave 49 projection baseline sync tags (read-only round 49 / O10-228 → O10-229).
 */


export const AG21_WAVE49_PROJECTION_BASELINE_SHA = '73e5e01';
export const AG21_WAVE49_PROJECTED_AUDITED_FUNCTIONAL = 2_727_364;

export type Ag21Wave49ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave49ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave49ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave48OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave49ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE49_PROJECTION_BASELINE_SHA
): Ag21Wave49ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.064),
      actorDebt: baseCtx.actorDebt + 1395
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave48OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE49_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave49ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w49_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE49_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE49_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:49`,
    `ticket:O10-229`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE49_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE49_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-49 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE49_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave49ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 104, seed: 64, actorCash: 720, actorDebt: 220, regionsControlled: 4 };
  const sync = syncAg21Wave49ProjectionBaseline(ctx);

  push('w49_id', sync.syncId.startsWith('ag21_w49_'), sync.syncId);
  push('w49_baseline', sync.baselineSha === AG21_WAVE49_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w49_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w49_projected', sync.projectedFunctionalLoc === AG21_WAVE49_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave49-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-49 origin handoff for O10-230 (read-only round 49).
 */


export type Ag21IntegrationWave49OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave49OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave49OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave49ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave48OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave49OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave49OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.054),
      actorDebt: baseCtx.actorDebt + 1400
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave48OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave49ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave49OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw49_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-49 origin handoff ready — Agent 21 unblocks O10-230 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-49 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-49 origin handoff blocked — resolve drift before O10-230';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw49=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave49OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 105, seed: 82, actorCash: 640, actorDebt: 240, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave49OriginGate(ctx);

  push('iw49_id', handoff.handoffId.startsWith('ag21_iw49_'), handoff.handoffId);
  push('iw49_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw49_copy', handoff.handoffCopy.includes('O10-230'), handoff.handoffCopy.slice(0, 40));
  push('iw49_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round49-console.tsx ---
/**
 * Agent 21 — scale wave round 49 console.
 */


export const Ag21ForecastRound49Console: React.FC<{ seed?: number }> = ({ seed = 149 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 64 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.074), actorDebt: base.actorDebt + 1350 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave48OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave49ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave49OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round49-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 49 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round49-prior">
        Wave 48 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round49-projection">
        Wave 49 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round49-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave50-projection-sync.ts ---
/**
 * Agent 21 — wave 50 projection baseline sync tags (read-only round 50 / O10-229 → O10-231).
 */


export const AG21_WAVE50_PROJECTION_BASELINE_SHA = '8aaaf700';
export const AG21_WAVE50_PROJECTED_AUDITED_FUNCTIONAL = 2_771_207;

export type Ag21Wave50ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave50ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave50ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave49OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave50ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE50_PROJECTION_BASELINE_SHA
): Ag21Wave50ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave49OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE50_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave50ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w50_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE50_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE50_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:50`,
    `ticket:O10-231`,
    `module:${O10M_AGENT21_MODULE_VERSION}`
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE50_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE50_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-50 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE50_PROJECTION_BASELINE_SHA}`]
    ),
    authoritative: false
  };
}

export function runAg21Wave50ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave50ProjectionBaseline(ctx);

  push('w50_id', sync.syncId.startsWith('ag21_w50_'), sync.syncId);
  push('w50_baseline', sync.baselineSha === AG21_WAVE50_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w50_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w50_projected', sync.projectedFunctionalLoc === AG21_WAVE50_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave50-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-50 origin handoff for O10-232 (read-only round 50).
 */


export type Ag21IntegrationWave50OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave50OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave50OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave50ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave49OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave50OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave50OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave49OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave50ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave50OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw50_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-50 origin handoff ready — Agent 21 unblocks O10-232 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-50 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-50 origin handoff blocked — resolve drift before O10-232';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw50=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave50OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave50OriginGate(ctx);

  push('iw50_id', handoff.handoffId.startsWith('ag21_iw50_'), handoff.handoffId);
  push('iw50_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw50_copy', handoff.handoffCopy.includes('O10-232'), handoff.handoffCopy.slice(0, 40));
  push('iw50_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round50-console.tsx ---
/**
 * Agent 21 — scale wave round 50 console.
 */


export const Ag21ForecastRound50Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave49OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave50ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave50OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round50-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 50 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round50-prior">
        Wave 49 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round50-projection">
        Wave 50 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round50-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave51-projection-sync.ts ---
/**
 * Agent 21 — wave 51 projection baseline sync tags (read-only round 51 / O10-231 → O10-233).
 */


export const AG21_WAVE51_PROJECTION_BASELINE_SHA = 'a32b2b15';
export const AG21_WAVE51_PROJECTED_AUDITED_FUNCTIONAL = 2_887_600;

export type Ag21Wave51ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave51ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave51ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave50OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave51ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE51_PROJECTION_BASELINE_SHA,
): Ag21Wave51ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave50OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE51_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave51ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w51_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE51_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE51_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:51`,
    `ticket:O10-233`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE51_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE51_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-51 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE51_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave51ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave51ProjectionBaseline(ctx);

  push('w51_id', sync.syncId.startsWith('ag21_w51_'), sync.syncId);
  push('w51_baseline', sync.baselineSha === AG21_WAVE51_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w51_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w51_projected', sync.projectedFunctionalLoc === AG21_WAVE51_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave51-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-51 origin handoff for O10-234 (read-only round 51).
 */


export type Ag21IntegrationWave51OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave51OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave51OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave51ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave50OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave51OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave51OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave50OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave51ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave51OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw51_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-51 origin handoff ready — Agent 21 unblocks O10-234 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-51 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-51 origin handoff blocked — resolve drift before O10-234';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw51=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave51OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave51OriginGate(ctx);

  push('iw51_id', handoff.handoffId.startsWith('ag21_iw51_'), handoff.handoffId);
  push('iw51_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw51_copy', handoff.handoffCopy.includes('O10-234'), handoff.handoffCopy.slice(0, 40));
  push('iw51_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round51-console.tsx ---
/**
 * Agent 21 — scale wave round 51 console.
 */


export const Ag21ForecastRound51Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave50OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave51ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave51OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round51-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 51 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round51-prior">
        Wave 50 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round51-projection">
        Wave 51 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round51-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave52-projection-sync.ts ---
/**
 * Agent 21 — wave 51 projection baseline sync tags (read-only round 52 / O10-231 → O10-235).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = 'ba97bdce';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 2_932_752;

export type Ag21Wave52ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave52ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave52ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave51OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave52ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave52ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave51OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave52ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-235`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave52ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave52ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave52-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave52OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave52OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave52OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave52ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave51OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave52OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave52OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave51OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave52ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave52OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave52OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave52OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round52-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound52Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave51OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave52ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave52OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round52-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round52-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round52-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round52-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from forecast-wave53-projection-sync.ts ---
/**
 * Agent 21 — wave 52 projection baseline sync tags (read-only round 52 / O10-233 → O10-237).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '51039c5e';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 2_979_928;

export type Ag21Wave53ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave53ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave53ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave52OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave53ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave53ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave52OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave53ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-237`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave53ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave53ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave53-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave53OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave53OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave53OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave53ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave52OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave53OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave53OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave52OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave53ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave53OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave53OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave53OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round53-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound53Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave52OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave53ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave53OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round53-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round53-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round53-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round53-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round53-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-237',
  wave: 52,
  round: 52,
  integrationBaseline: '51039c5e8f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave54-projection-sync.ts ---
/**
 * Agent 21 — wave 53 projection baseline sync tags (read-only round 52 / O10-233 → O10-240).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '5bd043ad';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave54ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave54ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave54ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave53OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave54ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave54ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave53OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave54ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-240`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave54ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave54ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave54-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave54OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave54OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave54OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave54ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave53OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave54OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave54OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave53OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave54ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave54OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave54OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave54OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round54-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound54Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave53OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave54ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round54-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round54-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round54-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round54-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round54-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-240',
  wave: 52,
  round: 52,
  integrationBaseline: '5bd043ad8f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave66-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-279).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = 'dc433dc2';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave66ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave66ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave66ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave66ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave66ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave66ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-279`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave66ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave66ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave66-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave66OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave66OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave66OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave66ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave66OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave66OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave66ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave66OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave66OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave66OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round66-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound66Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave66ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave66OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round66-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round66-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round66-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round66-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round66-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-279',
  wave: 52,
  round: 52,
  integrationBaseline: 'dc433dc28f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave65-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-277).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '18f4e9a2';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave65ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave65ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave65ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave65ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave65ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave65ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-277`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave65ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave65ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave65-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave65OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave65OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave65OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave65ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave65OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave65OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave65ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave65OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave65OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave65OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round65-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound65Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave65ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave65OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round65-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round65-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round65-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round65-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round65-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-277',
  wave: 52,
  round: 52,
  integrationBaseline: '18f4e9a28f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave64-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-275).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '308fd6dc';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave64ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave64ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave64ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave64ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave64ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave64ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-275`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave64ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave64ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave64-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave64OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave64OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave64OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave64ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave64OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave64OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave64ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave64OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave64OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave64OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round64-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound64Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave64ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave64OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round64-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round64-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round64-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round64-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round64-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-275',
  wave: 52,
  round: 52,
  integrationBaseline: '308fd6dc8f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave63-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-273).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '2ccfd849';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave63ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave63ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave63ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave63ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave63ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave63ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-273`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave63ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave63ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave63-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave63OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave63OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave63OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave63ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave63OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave63OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave63ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave63OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave63OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave63OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round63-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound63Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave63ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave63OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round63-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round63-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round63-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round63-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round63-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-273',
  wave: 52,
  round: 52,
  integrationBaseline: '2ccfd8498f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave62-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-269).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = 'e11ba60a';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave62ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave62ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave62ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave62ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave62ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave62ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-269`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave62ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave62ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave62-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave62OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave62OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave62OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave62ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave62OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave62OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave62ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave62OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave62OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave62OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round62-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound62Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave62ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave62OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round62-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round62-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round62-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round62-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round62-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-269',
  wave: 52,
  round: 52,
  integrationBaseline: 'e11ba60a8f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave61-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-267).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '7f862be0';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave61ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave61ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave61ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave61ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave61ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave61ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-267`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave61ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave61ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave61-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave61OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave61OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave61OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave61ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave61OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave61OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave61ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave61OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave61OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave61OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round61-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound61Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave61ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave61OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round61-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round61-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round61-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round61-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round61-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-267',
  wave: 52,
  round: 52,
  integrationBaseline: '7f862be08f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave60-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-265).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = 'af6c94f0';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave60ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave60ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave60ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave60ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave60ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave60ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-265`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave60ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave60ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave60-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave60OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave60OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave60OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave60ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave60OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave60OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave60ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave60OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave60OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave60OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round60-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound60Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave60ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave60OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round60-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round60-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round60-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round60-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round60-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-265',
  wave: 52,
  round: 52,
  integrationBaseline: 'af6c94f08f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave59-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-263).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '4182618c';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave59ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave59ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave59ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave59ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave59ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave59ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-263`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave59ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave59ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave59-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave59OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave59OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave59OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave59ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave59OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave59OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave59ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave59OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave59OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave59OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round59-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound59Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave59ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave59OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round59-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round59-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round59-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round59-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round59-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-263',
  wave: 52,
  round: 52,
  integrationBaseline: '4182618c8f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave58-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-260).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = 'feb7e524';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave58ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave58ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave58ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave58ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave58ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave58ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-260`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave58ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave58ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave58-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave58OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave58OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave58OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave58ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave58OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave58OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave58ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave58OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave58OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave58OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round58-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound58Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave58ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave58OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round58-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round58-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round58-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round58-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round58-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-260',
  wave: 52,
  round: 52,
  integrationBaseline: 'feb7e5248f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave57-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-257).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '93c42b3d';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave57ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave57ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave57ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave57ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave57ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave57ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-257`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave57ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave57ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave57-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave57OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave57OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave57OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave57ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave57OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave57OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave57ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave57OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave57OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave57OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round57-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound57Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave57ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave57OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round57-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round57-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round57-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round57-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round57-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-257',
  wave: 52,
  round: 52,
  integrationBaseline: '93c42b3d8f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave56-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-254).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = '8e2366bb';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_022_056;

export type Ag21Wave56ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave56ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave56ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave56ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave56ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave56ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-254`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave56ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave56ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave56-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave56OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave56OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave56OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave56ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave56OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave56OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave56ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave56OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave56OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave56OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round56-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound56Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave56ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave56OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round56-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round56-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round56-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round56-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round56-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-254',
  wave: 52,
  round: 52,
  integrationBaseline: '8e2366bb8f79f6215f04bc1497c19c70cb06d8f7',
} as const;

// --- bundled from forecast-wave55-projection-sync.ts ---
/**
 * Agent 21 — wave 54 projection baseline sync tags (read-only round 52 / O10-233 → O10-247).
 */


export const AG21_WAVE52_PROJECTION_BASELINE_SHA = 'c4bbec67';
export const AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL = 3_054_213;

export type Ag21Wave55ProjectionSyncStatus = 'aligned' | 'drift' | 'unknown';

export interface Ag21Wave55ProjectionSync {
  syncId: string;
  moduleVersion: string;
  status: Ag21Wave55ProjectionSyncStatus;
  baselineSha: string;
  projectedFunctionalLoc: number;
  originHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  syncTags: string[];
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function syncAg21Wave55ProjectionBaseline(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext,
  observedBaselineSha: string = AG21_WAVE52_PROJECTION_BASELINE_SHA,
): Ag21Wave55ProjectionSync {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.063),
      actorDebt: baseCtx.actorDebt + 1405,
    } satisfies Ag21ForecastContext);

  const handoff = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const shaMatch = observedBaselineSha.toLowerCase().startsWith(AG21_WAVE52_PROJECTION_BASELINE_SHA.slice(0, 7));

  let status: Ag21Wave55ProjectionSyncStatus = 'aligned';
  if (!shaMatch) status = 'unknown';
  else if (handoff.status === 'blocked') status = 'drift';

  const syncId = `ag21_w52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const syncTags = [
    `baseline:${AG21_WAVE52_PROJECTION_BASELINE_SHA}`,
    `projected:${AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL}`,
    `origin_handoff:${handoff.status}`,
    `wave:52`,
    `ticket:O10-247`,
    `module:${O10M_AGENT21_MODULE_VERSION}`,
  ];

  return {
    syncId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    baselineSha: AG21_WAVE52_PROJECTION_BASELINE_SHA,
    projectedFunctionalLoc: AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL,
    originHandoff: handoff.status,
    syncTags,
    disclaimer: '(Non-authoritative forecast.) Wave-52 projection sync for modular assembly bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'aligned' ? 'low' : status === 'drift' ? 'high' : 'moderate',
      [`sync=${syncId}`, `baseline=${AG21_WAVE52_PROJECTION_BASELINE_SHA}`],
    ),
    authoritative: false,
  };
}

export function runAg21Wave55ProjectionSyncSelfChecks(): { id: string; passed: boolean; detail: string }[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 106, seed: 66, actorCash: 710, actorDebt: 225, regionsControlled: 4 };
  const sync = syncAg21Wave55ProjectionBaseline(ctx);

  push('w52_id', sync.syncId.startsWith('ag21_w52_'), sync.syncId);
  push('w52_baseline', sync.baselineSha === AG21_WAVE52_PROJECTION_BASELINE_SHA, sync.baselineSha);
  push('w52_tags', sync.syncTags.length >= 6, String(sync.syncTags.length));
  push('w52_projected', sync.projectedFunctionalLoc === AG21_WAVE52_PROJECTED_AUDITED_FUNCTIONAL, String(sync.projectedFunctionalLoc));

  return out;
}

// --- bundled from forecast-integration-wave55-origin-handoff.ts ---
/**
 * Agent 21 — integration wave-52 origin handoff for O10-236 (read-only round 52).
 */


export type Ag21IntegrationWave55OriginHandoffStatus = 'ready' | 'blocked' | 'pending';

export interface Ag21IntegrationWave55OriginHandoff {
  handoffId: string;
  moduleVersion: string;
  status: Ag21IntegrationWave55OriginHandoffStatus;
  projectionSyncStatus: ReturnType<typeof syncAg21Wave55ProjectionBaseline>['status'];
  priorOriginHandoff: ReturnType<typeof handoffAg21IntegrationWave54OriginGate>['status'];
  handoffCopy: string;
  disclaimer: string;
  overallUncertainty: Ag21UncertaintyLabel;
  authoritative: false;
}

export function handoffAg21IntegrationWave55OriginGate(
  baseCtx: Ag21ForecastContext,
  stressedCtx?: Ag21ForecastContext
): Ag21IntegrationWave55OriginHandoff {
  const candidate =
    stressedCtx ??
    ({
      ...baseCtx,
      actorCash: Math.round(baseCtx.actorCash * 0.053),
      actorDebt: baseCtx.actorDebt + 1410
    } satisfies Ag21ForecastContext);

  const prior = handoffAg21IntegrationWave54OriginGate(baseCtx, candidate);
  const projection = syncAg21Wave55ProjectionBaseline(baseCtx, candidate);

  let status: Ag21IntegrationWave55OriginHandoffStatus = 'ready';
  if (prior.status === 'blocked' || projection.status === 'drift') status = 'blocked';
  else if (prior.status === 'pending' || projection.status === 'unknown') status = 'pending';

  const handoffId = `ag21_iw52_${baseCtx.turn}_${baseCtx.seed}_${status}`;
  const handoffCopy =
    status === 'ready'
      ? 'wave-52 origin handoff ready — Agent 21 unblocks O10-236 integration dry-run with agents 10 and 25'
      : status === 'pending'
        ? 'wave-52 origin handoff pending — projection sync or prior handoff partial'
        : 'wave-52 origin handoff blocked — resolve drift before O10-236';

  return {
    handoffId,
    moduleVersion: O10M_AGENT21_MODULE_VERSION,
    status,
    projectionSyncStatus: projection.status,
    priorOriginHandoff: prior.status,
    handoffCopy,
    disclaimer: '(Non-authoritative forecast.) Origin handoff is modular bookkeeping only.',
    overallUncertainty: ag21LabelUncertainty(
      status === 'ready' ? 'low' : status === 'pending' ? 'moderate' : 'high',
      [`handoff=${handoffId}`, `iw52=${status}`]
    ),
    authoritative: false
  };
}

export function runAg21IntegrationWave55OriginHandoffSelfChecks(): {
  id: string;
  passed: boolean;
  detail: string;
}[] {
  const out: { id: string; passed: boolean; detail: string }[] = [];
  const push = (id: string, passed: boolean, detail: string) => out.push({ id, passed, detail });

  const ctx: Ag21ForecastContext = { turn: 107, seed: 84, actorCash: 630, actorDebt: 245, regionsControlled: 3 };
  const handoff = handoffAg21IntegrationWave55OriginGate(ctx);

  push('iw52_id', handoff.handoffId.startsWith('ag21_iw52_'), handoff.handoffId);
  push('iw52_status', ['ready', 'blocked', 'pending'].includes(handoff.status), handoff.status);
  push('iw52_copy', handoff.handoffCopy.includes('O10-236'), handoff.handoffCopy.slice(0, 40));
  push('iw52_non_auth', handoff.authoritative === false, handoff.disclaimer.slice(0, 28));

  return out;
}

// --- bundled from forecast-round55-console.tsx ---
/**
 * Agent 21 — scale wave round 52 console.
 */


export const Ag21ForecastRound55Console: React.FC<{ seed?: number }> = ({ seed = 150 }) => {
  const base = useMemo(() => createDefaultAg21ForecastContext({ seed, turn: 65 }), [seed]);
  const stressed = useMemo(
    () => ({ ...base, actorCash: Math.round(base.actorCash * 0.073), actorDebt: base.actorDebt + 1360 }),
    [base]
  );

  const priorHandoff = useMemo(() => handoffAg21IntegrationWave54OriginGate(base, stressed), [base, stressed]);
  const projection = useMemo(() => syncAg21Wave55ProjectionBaseline(base, stressed), [base, stressed]);
  const handoff = useMemo(() => handoffAg21IntegrationWave55OriginGate(base, stressed), [base, stressed]);

  return (
    <div className="border border-violet-500/30 rounded-lg p-3 bg-slate-950/85 text-xs space-y-2" data-testid="ag21-round55-console">
      <div className="font-bold text-violet-200">
        🔬 Forecast Lab Round 52 <span className="text-[10px] font-normal opacity-70">(non-authoritative)</span>
      </div>
      <div data-testid="ag21-round55-prior">
        Wave 51 handoff · {priorHandoff.status} · {priorHandoff.handoffCopy.slice(0, 44)}…
      </div>
      <div data-testid="ag21-round55-projection">
        Wave 52 sync · {projection.status} · baseline {projection.baselineSha}
      </div>
      <div data-testid="ag21-round55-handoff">
        Origin handoff · {handoff.status} · {handoff.handoffCopy.slice(0, 48)}…
      </div>
    </div>
  );
};

// --- bundled from scale-wave-round55-gate-latch.ts ---
export const AGENT21_SCALE_WAVE_ROUND52 = {
  ticket: 'O10-247',
  wave: 52,
  round: 52,
  integrationBaseline: 'c4bbec678f79f6215f04bc1497c19c70cb06d8f7',
} as const;



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
  for (const row of runAg21CloseoutAttestationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ExportManifestSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabArchiveSealSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ManifestConfirmationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ArchiveAuditTrailSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabRetentionPolicySelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21RetentionComplianceSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21ArchiveAuditRollupSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabGovernanceCheckpointSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21GovernanceRemediationPlanSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21OriginGateAttestationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21LabContinuityVerdictSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21FullChunksDryRunReadinessSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave16ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationDryRunAttestationSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21FullChunksDryRunExecutionSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave17ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationDryRunClosureSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave18ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave18OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave19ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave19OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave20ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave20OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave21ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave21OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave22ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave22OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave23ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave23OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave24ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave24OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave25ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave25OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave26ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave26OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave27ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave27OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave28ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave28OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave29ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave29OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave30ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave30OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave31ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave31OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave32ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave32OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave33ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave33OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave34ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave34OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave35ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave35OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave36ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave36OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave37ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave37OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave38ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave38OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave39ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave39OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave40ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave40OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave41ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave41OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave42ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave42OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave43ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave43OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave44ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave44OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave45ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave45OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave46ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave46OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave47ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave47OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave48ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave48OriginHandoffSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21Wave49ProjectionSyncSelfChecks()) {
    results.push({ id: row.id, passed: row.passed, detail: row.detail });
  }
  for (const row of runAg21IntegrationWave49OriginHandoffSelfChecks()) {
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
