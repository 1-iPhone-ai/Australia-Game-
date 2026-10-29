import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtPortfolioGovernanceReport } from '../debt-portfolio-governance/types';
import type { CreditOutlookBand, SovereignCreditOutlookReport } from './types';
import { SOVEREIGN_CREDIT_OUTLOOK_SCHEMA } from './types';

const SPREAD_CAP_BPS = 185;

function bandFromSpread(spread: number, headroom: number): CreditOutlookBand {
  if (headroom <= -12 || spread >= 220) return 'distress';
  if (spread >= 155 || headroom <= -4) return 'pressure';
  if (spread >= 115 || headroom <= 2) return 'negative_watch';
  return 'stable';
}

export function buildSovereignCreditOutlookReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  debtGovernance: DebtPortfolioGovernanceReport,
  opts?: { stressWorstDelta?: number }
): SovereignCreditOutlookReport {
  const stressAdj = Math.max(0, -(opts?.stressWorstDelta ?? 0) * 2.2);
  const baseSpread =
    48 +
    v1012.debtServiceLoad * 2.4 +
    Math.max(0, v1012.debtLevel - 25) * 0.35 +
    (v1012.fiscalHeadroom < 0 ? Math.abs(v1012.fiscalHeadroom) * 2.8 : 0) +
    stressAdj;

  const durationAdj = debtGovernance.weightedAverageDurationYears > 8 ? 8 : 0;
  const concentrationAdj = debtGovernance.maxTrancheShare > 0.38 ? 12 : 0;
  const impliedSpreadBps = Math.round((baseSpread + durationAdj + concentrationAdj) * 10) / 10;

  const headroomToDistress =
    Math.round((v1012.fiscalHeadroom + 18 - impliedSpreadBps / 12) * 10) / 10;

  const ratingBand = bandFromSpread(impliedSpreadBps, headroomToDistress);

  const withinOutlookBand =
    impliedSpreadBps <= SPREAD_CAP_BPS ||
    ratingBand !== 'distress' ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const coherentWithDebtGovernance =
    debtGovernance.withinGovernanceTargets ||
    ratingBand === 'stable' ||
    ratingBand === 'negative_watch' ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const warnings: string[] = [];
  if (!withinOutlookBand) {
    warnings.push(`Implied spread ${impliedSpreadBps}bps exceeds cap ${SPREAD_CAP_BPS}.`);
  }
  if (!coherentWithDebtGovernance) {
    warnings.push(`Credit band ${ratingBand} misaligned with debt portfolio governance.`);
  }

  const narrative = withinOutlookBand
    ? `Sovereign credit outlook ${ratingBand}: implied spread ${impliedSpreadBps}bps, headroom ${headroomToDistress}.`
    : `Credit pressure: spread ${impliedSpreadBps}bps (${ratingBand}).`;

  return {
    schemaVersion: SOVEREIGN_CREDIT_OUTLOOK_SCHEMA,
    turn,
    impliedSpreadBps,
    ratingBand,
    headroomToDistress,
    withinOutlookBand,
    coherentWithDebtGovernance,
    narrative,
    warnings
  };
}
