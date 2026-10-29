/**
 * Agent 21 — ensemble projection bands (fuse lab signals on isolated snapshots).
 */

import { buildAg21MultiHorizonProjection } from './forecast-lab-depth';
import { runAg21PolicySensitivitySweep } from './forecast-policy-sensitivity';
import {
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21VerifyIsolatedExperiment,
  type Ag21UncertaintyBand,
  type Ag21UncertaintyLabel
} from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

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
