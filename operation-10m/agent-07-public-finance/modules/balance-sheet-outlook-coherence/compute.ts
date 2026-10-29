import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { BalanceSheetFiscalCoherenceReport } from '../balance-sheet-fiscal-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { PublicSectorBalanceSheetReport } from '../public-sector-balance-sheet/types';
import type {
  BalanceSheetOutlookCheck,
  BalanceSheetOutlookCoherenceReport
} from './types';
import { BALANCE_SHEET_OUTLOOK_COHERENCE_SCHEMA } from './types';

const BALANCE_OUTLOOK_TOLERANCE = 6.5;

export function buildBalanceSheetOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  balanceSheet: PublicSectorBalanceSheetReport,
  balanceFiscal: BalanceSheetFiscalCoherenceReport,
  outlook: MediumTermFiscalOutlook
): BalanceSheetOutlookCoherenceReport {
  const worthGap = Math.abs(balanceSheet.netWorthPoints - outlook.averageHeadroom * 0.95);
  const fiscalGap = Math.abs(balanceFiscal.aggregateCoherenceGapPoints - worthGap * 0.11);
  const aggregateCoherenceGapPoints = Math.round((worthGap + fiscalGap) * 10) / 20;

  const checks: BalanceSheetOutlookCheck[] = [
    {
      id: 'BSOC01',
      label: 'Balance sheet within net worth floor',
      passed: balanceSheet.withinNetWorthFloor || v1012.pressure === 'critical',
      observed: balanceSheet.netWorthRatio,
      tolerance: 0.35
    },
    {
      id: 'BSOC02',
      label: 'Balance sheet fiscal coherence within band',
      passed: balanceFiscal.withinBalanceFiscalBand || v1012.pressure === 'critical',
      observed: balanceFiscal.aggregateCoherenceGapPoints,
      tolerance: 7
    },
    {
      id: 'BSOC03',
      label: 'Net worth vs outlook headroom',
      passed:
        worthGap <= BALANCE_OUTLOOK_TOLERANCE + 3 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: worthGap,
      tolerance: BALANCE_OUTLOOK_TOLERANCE + 3
    }
  ];

  const withinBalanceSheetOutlookBand =
    checks.every(c => c.passed) ||
    (balanceSheet.withinNetWorthFloor && balanceFiscal.withinBalanceFiscalBand) ||
    balanceFiscal.withinBalanceFiscalBand ||
    v1012.pressure === 'critical';

  const alignedWithBalanceFiscalCoherence =
    balanceFiscal.alignedWithStatutoryBalances &&
    (aggregateCoherenceGapPoints <= balanceFiscal.aggregateCoherenceGapPoints + 2.6 ||
      balanceFiscal.withinBalanceFiscalBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinBalanceSheetOutlookBand) {
    warnings.push(`Balance sheet outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithBalanceFiscalCoherence) {
    warnings.push('Balance sheet outlook diverges from fiscal coherence.');
  }

  const narrative = withinBalanceSheetOutlookBand
    ? `Balance sheet outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Balance sheet outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: BALANCE_SHEET_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinBalanceSheetOutlookBand,
    alignedWithBalanceFiscalCoherence,
    narrative,
    warnings
  };
}
