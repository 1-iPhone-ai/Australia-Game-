import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { NationalRevenueLedger } from '../revenue-ledger/types';
import type { CashManagementReport } from '../cash-management/types';
import type { CoverageBand, DebtServiceCoverageReport } from './types';
import { DEBT_SERVICE_COVERAGE_SCHEMA } from './types';

const COVERAGE_FLOOR = 1.35;

function band(ratio: number): CoverageBand {
  if (ratio >= 2.1) return 'strong';
  if (ratio >= COVERAGE_FLOOR) return 'adequate';
  if (ratio >= 1.05) return 'thin';
  return 'breach';
}

export function buildDebtServiceCoverageReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  ledger: NationalRevenueLedger,
  cashMgmt: CashManagementReport
): DebtServiceCoverageReport {
  const streamDelta = ledger.streams.reduce((s, st) => s + st.deltaPoints, 0);
  const revenueCoverPoints =
    Math.round((v1012.revenueCapacity * 0.14 + streamDelta * 0.2 + Math.max(0, v1012.fiscalHeadroom) * 0.25) * 10) /
    10;
  const debtServicePoints =
    Math.round((v1012.debtServiceLoad * 0.95 + (v1012.debtEnabled ? v1012.debtLevel * 0.015 : 0)) * 10) / 10;

  const coverageRatio =
    debtServicePoints <= 0 ? 99 : Math.round((revenueCoverPoints / debtServicePoints) * 100) / 100;

  const coverageBand = band(coverageRatio);

  const runwayTurnsAligned =
    cashMgmt.runwayTurns >= 2.5 ||
    coverageBand === 'strong' ||
    coverageBand === 'adequate' ||
    v1012.pressure === 'critical' ||
    !v1012.debtEnabled;

  const withinCoverageFloor =
    coverageRatio >= COVERAGE_FLOOR ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && coverageRatio >= COVERAGE_FLOOR * 0.92) ||
    !v1012.debtEnabled;

  const warnings: string[] = [];
  if (!withinCoverageFloor) {
    warnings.push(`Coverage ratio ${coverageRatio} below floor ${COVERAGE_FLOOR}.`);
  }
  if (!runwayTurnsAligned) {
    warnings.push(`TGA runway ${cashMgmt.runwayTurns} misaligned with coverage band ${coverageBand}.`);
  }

  const narrative = withinCoverageFloor
    ? `Debt service coverage ${coverageRatio}x (${coverageBand}); revenue cover ${revenueCoverPoints}.`
    : `Coverage alert: ${coverageRatio}x vs service ${debtServicePoints}.`;

  return {
    schemaVersion: DEBT_SERVICE_COVERAGE_SCHEMA,
    turn,
    revenueCoverPoints,
    debtServicePoints,
    coverageRatio,
    coverageBand,
    runwayTurnsAligned,
    withinCoverageFloor,
    narrative,
    warnings
  };
}
