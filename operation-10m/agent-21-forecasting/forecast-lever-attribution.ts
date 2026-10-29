/**
 * Agent 21 — sensitivity lever attribution (share of ensemble spread, read-only).
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
