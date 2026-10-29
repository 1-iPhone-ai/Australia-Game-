/**
 * Agent 21 — multi-horizon ladder volatility (step-to-step spread, read-only).
 */

import { buildAg21MultiHorizonProjection } from './forecast-lab-depth';
import {
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21VerifyIsolatedExperiment,
  type Ag21UncertaintyBand,
  type Ag21UncertaintyLabel
} from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

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
