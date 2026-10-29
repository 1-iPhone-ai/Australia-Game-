import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { CashManagementReport } from '../cash-management/types';
import type { PublicSectorBalanceSheetReport } from '../public-sector-balance-sheet/types';
import type { StatutoryBalancesReport } from '../statutory-balances/types';
import type { BalanceSheetFiscalCheck, BalanceSheetFiscalCoherenceReport } from './types';
import { BALANCE_SHEET_FISCAL_COHERENCE_SCHEMA } from './types';

const BALANCE_GAP_TOLERANCE = 6.1;

export function buildBalanceSheetFiscalCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  balanceSheet: PublicSectorBalanceSheetReport,
  statutory: StatutoryBalancesReport,
  cashMgmt: CashManagementReport
): BalanceSheetFiscalCoherenceReport {
  const netWorthGap = Math.abs(balanceSheet.netWorthPoints - statutory.netOperatingBalance * 1.15);
  const liquidGap = Math.abs(balanceSheet.liquidAssetSlice - cashMgmt.aggregateClosingBalance * 0.22);
  const aggregateCoherenceGapPoints =
    Math.round((netWorthGap + liquidGap) * 10) / 20;

  const checks: BalanceSheetFiscalCheck[] = [
    {
      id: 'BSFC01',
      label: 'Net worth within floor',
      passed: balanceSheet.withinNetWorthFloor || v1012.pressure === 'critical',
      observed: balanceSheet.netWorthRatio,
      tolerance: 0.18
    },
    {
      id: 'BSFC02',
      label: 'Net worth vs statutory operating balance',
      passed:
        netWorthGap <= BALANCE_GAP_TOLERANCE + 3 ||
        statutory.allWithinSoftAnchors ||
        v1012.pressure === 'critical',
      observed: netWorthGap,
      tolerance: BALANCE_GAP_TOLERANCE + 3
    },
    {
      id: 'BSFC03',
      label: 'Liquid slice vs cash closing',
      passed:
        balanceSheet.liquidSliceCoherentWithCash ||
        liquidGap <= BALANCE_GAP_TOLERANCE ||
        v1012.pressure === 'critical',
      observed: liquidGap,
      tolerance: BALANCE_GAP_TOLERANCE
    }
  ];

  const withinBalanceFiscalBand =
    checks.every(c => c.passed) ||
    (balanceSheet.withinNetWorthFloor && balanceSheet.liquidSliceCoherentWithCash) ||
    v1012.pressure === 'critical';

  const alignedWithStatutoryBalances =
    statutory.allWithinSoftAnchors &&
    (aggregateCoherenceGapPoints <= Math.abs(statutory.fiscalBalance) + 4.5 ||
      balanceSheet.withinNetWorthFloor ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinBalanceFiscalBand) {
    warnings.push(`Balance sheet fiscal gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithStatutoryBalances) {
    warnings.push('Balance sheet coherence diverges from statutory balances.');
  }

  const narrative = withinBalanceFiscalBand
    ? `Balance sheet fiscal gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Balance sheet fiscal alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: BALANCE_SHEET_FISCAL_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinBalanceFiscalBand,
    alignedWithStatutoryBalances,
    narrative,
    warnings
  };
}
