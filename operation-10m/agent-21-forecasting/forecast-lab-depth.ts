/**
 * Agent 21 — extended forecast lab depth (multi-horizon ladders, batch scenario review).
 * All projections operate on isolated copies; outputs are non-authoritative.
 */

import { runAg21CounterfactualFork, type Ag21CounterfactualBranchSpec } from './counterfactual-experiments';
import { compareAg21Scenarios, evaluateAg21ForecastRun } from './forecast-evaluation-metrics';
import {
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21VerifyIsolatedExperiment,
  type Ag21UncertaintyBand,
  type Ag21UncertaintyLabel
} from './isolation-core';
import { lookupAg21Scenario, type Ag21ForecastScenarioEntry } from './scenario-catalog';
import type { Ag21ForecastContext, Ag21ForecastBundle, Ag21PolicyExperimentResult } from './strategic-forecast-policy-lab';

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
