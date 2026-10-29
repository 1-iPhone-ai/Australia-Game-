import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { CashManagementLine, CashManagementReport, CashRunwayBand } from './types';
import { CASH_MANAGEMENT_SCHEMA } from './types';

const DRAWDOWN_LIMIT = 12;

function runwayBand(runwayTurns: number, squeeze: boolean): CashRunwayBand {
  if (squeeze) return 'critical';
  if (runwayTurns >= 5) return 'comfortable';
  if (runwayTurns >= 3) return 'watch';
  if (runwayTurns >= 1) return 'squeeze';
  return 'critical';
}

export function buildCashManagementReport(turn: number, v1012: V1012FiscalSnapshot): CashManagementReport {
  const revenueInflow = Math.round(v1012.revenueCapacity * 0.11 * 10) / 10;
  const grantInflow = Math.round(v1012.revenueCapacity * 0.015 * 10) / 10;
  const operatingOutflow =
    Math.round((v1012.maintenanceLoad * 0.9 + v1012.debtServiceLoad * 0.55 + Math.max(0, 8 - v1012.fiscalHeadroom) * 0.4) * 10) /
    10;
  const capitalOutflow = v1012.debtEnabled ? Math.round(v1012.debtLevel * 0.02 * 10) / 10 : 0;

  const opening =
    Math.round((14 + v1012.fiscalHeadroom * 0.35 + (v1012.reservePolicy === 'prudent' ? 4 : 0)) * 10) / 10;

  const lines: CashManagementLine[] = [
    {
      id: 'operating',
      label: 'Operating TGA slice',
      openingBalancePoints: opening,
      inflowPoints: revenueInflow + grantInflow,
      outflowPoints: operatingOutflow,
      closingBalancePoints: 0
    },
    {
      id: 'capital',
      label: 'Capital & rollover buffer',
      openingBalancePoints: Math.max(2, opening * 0.25),
      inflowPoints: v1012.debtEnabled ? Math.round(v1012.debtLevel * 0.015 * 10) / 10 : 0,
      outflowPoints: capitalOutflow,
      closingBalancePoints: 0
    }
  ];

  for (const line of lines) {
    line.closingBalancePoints =
      Math.round((line.openingBalancePoints + line.inflowPoints - line.outflowPoints) * 10) / 10;
  }

  const aggregateClosingBalance = lines.reduce((s, l) => s + l.closingBalancePoints, 0);
  const weeklyBurn = Math.max(0.5, operatingOutflow / 4);
  const runwayTurns = Math.max(0, Math.round((aggregateClosingBalance / weeklyBurn) * 10) / 10);

  const endOfYearSqueeze = turn % 12 >= 10 && aggregateClosingBalance < DRAWDOWN_LIMIT;
  const band = runwayBand(runwayTurns, endOfYearSqueeze && v1012.pressure !== 'comfortable');

  const withinDrawdownLimit =
    aggregateClosingBalance >= DRAWDOWN_LIMIT || v1012.pressure === 'critical' || !v1012.debtEnabled;

  const warnings: string[] = [];
  if (endOfYearSqueeze) {
    warnings.push('End-of-year appropriation squeeze — TGA closing balance below drawdown comfort.');
  }
  if (!withinDrawdownLimit) {
    warnings.push(`Aggregate closing ${aggregateClosingBalance} below drawdown limit ${DRAWDOWN_LIMIT}.`);
  }
  if (band === 'squeeze' || band === 'critical') {
    warnings.push(`Cash runway ${runwayTurns} turns — ${band} band.`);
  }

  const narrative = withinDrawdownLimit
    ? `TGA aggregate closing ${aggregateClosingBalance} with ~${runwayTurns} turn runway (${band}).`
    : `Cash management alert: closing ${aggregateClosingBalance}, runway ${runwayTurns}.`;

  return {
    schemaVersion: CASH_MANAGEMENT_SCHEMA,
    turn,
    lines,
    aggregateClosingBalance,
    runwayTurns,
    runwayBand: band,
    withinDrawdownLimit,
    endOfYearSqueeze,
    narrative,
    warnings
  };
}
