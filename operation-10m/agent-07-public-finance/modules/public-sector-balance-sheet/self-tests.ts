import { buildPublicSectorBalanceSheetReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 69,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 30,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runPublicSectorBalanceSheetSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildPublicSectorBalanceSheetReport(11, snap({}));
  record('PSBS01', 'Five balance sheet lines', healthy.lines.length === 5, 'ok');
  record('PSBS02', 'Healthy net worth above floor', healthy.withinNetWorthFloor, healthy.narrative);
  record(
    'PSBS03',
    'Net worth equals assets minus liabilities',
    Math.abs(healthy.netWorthPoints - (healthy.totalAssetsPoints - healthy.totalLiabilitiesPoints)) < 0.05,
    `nw=${healthy.netWorthPoints}`
  );

  const levered = buildPublicSectorBalanceSheetReport(11, snap({ debtLevel: 85, debtServiceLoad: 24, fiscalHeadroom: -8 }));
  record(
    'PSBS04',
    'High leverage lowers net worth ratio',
    levered.netWorthRatio < healthy.netWorthRatio,
    `${levered.netWorthRatio} vs ${healthy.netWorthRatio}`
  );

  const withCash = buildPublicSectorBalanceSheetReport(11, snap({}), { cashClosingBalance: 18 });
  record('PSBS05', 'Cash probe improves liquid slice coherence', withCash.liquidSliceCoherentWithCash, 'ok');

  const critical = buildPublicSectorBalanceSheetReport(11, snap({ pressure: 'critical', fiscalHeadroom: -30, debtLevel: 90 }));
  record('PSBS06', 'Critical pressure overrides net worth floor', critical.withinNetWorthFloor, 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
