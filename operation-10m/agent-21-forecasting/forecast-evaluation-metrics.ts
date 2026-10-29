/**
 * Agent 21 — forecast evaluation metrics (read-only analytics on lab outputs).
 */

import type { Ag21UncertaintyBand } from './isolation-core';
import type { Ag21ForecastScenarioEntry } from './scenario-catalog';

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
