import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtPortfolioGovernanceReport, DebtPortfolioTranche, DurationBand } from './types';
import { DEBT_PORTFOLIO_GOVERNANCE_SCHEMA } from './types';

const MAX_TRANCHE_SHARE = 0.42;
const DURATION_FLOOR = 4.2;
const DURATION_CEILING = 9.8;

function durationBand(years: number): DurationBand {
  if (years < DURATION_FLOOR + 0.5) return 'short';
  if (years > DURATION_CEILING - 0.5) return 'long';
  return 'neutral';
}

export function buildDebtPortfolioGovernanceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  opts?: { liquidityStress?: boolean }
): DebtPortfolioGovernanceReport {
  const stress = opts?.liquidityStress ?? v1012.debtServiceLoad > 14;
  const levelSkew = Math.min(0.12, v1012.debtLevel / 500);

  const baseShares = [
    { id: 't_bill', tenorYears: 2, share: 0.18 - levelSkew * 0.5 },
    { id: 't_3y', tenorYears: 3, share: 0.22 },
    { id: 't_5y', tenorYears: 5, share: 0.26 + levelSkew },
    { id: 't_10y', tenorYears: 10, share: 0.24 },
    { id: 't_15y', tenorYears: 15, share: 0.1 - levelSkew * 0.5 }
  ];

  let tranches: DebtPortfolioTranche[] = baseShares.map(t => {
    const weightShare = Math.round(Math.max(0.05, t.share) * 1000) / 1000;
    const rolloverTurns = Math.max(1, Math.round(t.tenorYears * (stress ? 0.85 : 1.05)));
    return {
      id: t.id,
      tenorYears: t.tenorYears,
      weightShare,
      rolloverTurns,
      concentrationFlag: weightShare > MAX_TRANCHE_SHARE
    };
  });

  const shareSum = tranches.reduce((s, t) => s + t.weightShare, 0);
  tranches = tranches.map(t => ({
    ...t,
    weightShare: Math.round((t.weightShare / shareSum) * 1000) / 1000,
    concentrationFlag: t.weightShare / shareSum > MAX_TRANCHE_SHARE
  }));

  if (stress && v1012.pressure !== 'critical') {
    tranches = tranches.map(t =>
      t.tenorYears <= 3
        ? { ...t, weightShare: Math.round(t.weightShare * 1.08 * 1000) / 1000 }
        : { ...t, weightShare: Math.round(t.weightShare * 0.96 * 1000) / 1000 }
    );
    const reSum = tranches.reduce((s, t) => s + t.weightShare, 0);
    tranches = tranches.map(t => ({
      ...t,
      weightShare: Math.round((t.weightShare / reSum) * 1000) / 1000,
      concentrationFlag: t.weightShare / reSum > MAX_TRANCHE_SHARE
    }));
  }

  const weightedAverageDurationYears =
    Math.round(tranches.reduce((s, t) => s + t.tenorYears * t.weightShare, 0) * 100) / 100;

  const maxTrancheShare = Math.round(Math.max(...tranches.map(t => t.weightShare)) * 1000) / 1000;
  const band = durationBand(weightedAverageDurationYears);

  const rolloverStressAligned =
    !stress ||
    weightedAverageDurationYears >= DURATION_FLOOR ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const withinGovernanceTargets =
    maxTrancheShare <= MAX_TRANCHE_SHARE + 0.02 &&
    weightedAverageDurationYears >= DURATION_FLOOR - 0.35 &&
    weightedAverageDurationYears <= DURATION_CEILING + 0.35 &&
    rolloverStressAligned;

  const warnings: string[] = [];
  if (maxTrancheShare > MAX_TRANCHE_SHARE) {
    warnings.push(`Tranche concentration ${maxTrancheShare} exceeds ${MAX_TRANCHE_SHARE}.`);
  }
  if (weightedAverageDurationYears < DURATION_FLOOR) {
    warnings.push(`Weighted duration ${weightedAverageDurationYears}y below floor ${DURATION_FLOOR}.`);
  }
  if (!rolloverStressAligned) {
    warnings.push('Liquidity stress not aligned with portfolio duration tilt.');
  }

  const narrative = withinGovernanceTargets
    ? `Debt portfolio WAD ${weightedAverageDurationYears}y (${band}), max share ${maxTrancheShare}.`
    : `Debt governance review: WAD ${weightedAverageDurationYears}y, concentration ${maxTrancheShare}.`;

  return {
    schemaVersion: DEBT_PORTFOLIO_GOVERNANCE_SCHEMA,
    turn,
    tranches,
    weightedAverageDurationYears,
    durationBand: band,
    maxTrancheShare,
    rolloverStressAligned,
    withinGovernanceTargets,
    narrative,
    warnings
  };
}
