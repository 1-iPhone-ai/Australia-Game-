/**
 * Agent 21 — ensemble residual backtest (p50 vs isolated one-turn realization).
 */

import { buildAg21EnsembleProjection } from './forecast-ensemble-projection';
import { runAg21PolicySensitivitySweep } from './forecast-policy-sensitivity';
import {
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21VerifyIsolatedExperiment,
  type Ag21UncertaintyBand,
  type Ag21UncertaintyLabel
} from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

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
