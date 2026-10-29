import { buildCashManagementReport } from '../cash-management/compute';
import { buildPublicSectorBalanceSheetReport } from '../public-sector-balance-sheet/compute';
import { buildStatutoryBalancesReport } from '../statutory-balances/compute';
import { buildBalanceSheetFiscalCoherenceReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runBalanceSheetFiscalCoherenceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v = snap({});
  const cash = buildCashManagementReport(9, v);
  const balanceSheet = buildPublicSectorBalanceSheetReport(9, v, {
    cashClosingBalance: cash.aggregateClosingBalance
  });
  const statutory = buildStatutoryBalancesReport(9, v);
  const healthy = buildBalanceSheetFiscalCoherenceReport(9, v, balanceSheet, statutory, cash);

  record('BSFC-T01', 'Three balance fiscal checks', healthy.checks.length === 3, 'ok');
  record(
    'BSFC-T02',
    'Within balance fiscal band',
    healthy.withinBalanceFiscalBand,
    `gap=${healthy.aggregateCoherenceGapPoints}`
  );
  record(
    'BSFC-T03',
    'Aligned with statutory balances',
    healthy.alignedWithStatutoryBalances,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
