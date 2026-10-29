/**
 * Agent 21 — policy regret ranking (counterfactual branches vs baseline ladder).
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
