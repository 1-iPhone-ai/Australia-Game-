/**
 * Agent 21 — ensemble vs trajectory fusion convergence (read-only round 6).
 */

import { buildAg21EnsembleProjection } from './forecast-ensemble-projection';
import { fuseAg21ScenarioTrajectories } from './forecast-trajectory-fusion';
import {
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21VerifyIsolatedExperiment,
  type Ag21UncertaintyBand,
  type Ag21UncertaintyLabel
} from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

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
