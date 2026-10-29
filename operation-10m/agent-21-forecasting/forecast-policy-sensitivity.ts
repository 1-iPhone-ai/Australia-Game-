/**
 * Agent 21 — policy sensitivity sweep (isolated context perturbations, non-authoritative).
 */

import {
  ag21FingerprintSnapshot,
  ag21LabelUncertainty,
  ag21VerifyIsolatedExperiment,
  type Ag21UncertaintyBand,
  type Ag21UncertaintyLabel
} from './isolation-core';
import type { Ag21ForecastContext } from './strategic-forecast-policy-lab';

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
