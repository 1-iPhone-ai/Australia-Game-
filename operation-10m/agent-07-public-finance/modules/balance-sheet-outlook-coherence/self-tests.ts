import { buildBalanceSheetFiscalCoherenceReport } from '../balance-sheet-fiscal-coherence/compute';
import { buildCashManagementReport } from '../cash-management/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildPublicSectorBalanceSheetReport } from '../public-sector-balance-sheet/compute';
import { buildStatutoryBalancesReport } from '../statutory-balances/compute';
import { buildBalanceSheetOutlookCoherenceReport } from './compute';
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

export function runBalanceSheetOutlookCoherenceSelfTests(): {
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
  const balanceFiscal = buildBalanceSheetFiscalCoherenceReport(9, v, balanceSheet, statutory, cash);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const healthy = buildBalanceSheetOutlookCoherenceReport(9, v, balanceSheet, balanceFiscal, outlook);

  record('BSOC-T01', 'Three balance sheet outlook checks', healthy.checks.length === 3, 'ok');
  record(
    'BSOC-T02',
    'Within balance sheet outlook band',
    healthy.withinBalanceSheetOutlookBand,
    `gap=${healthy.aggregateCoherenceGapPoints}`
  );
  record(
    'BSOC-T03',
    'Aligned with balance fiscal coherence',
    healthy.alignedWithBalanceFiscalCoherence,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
