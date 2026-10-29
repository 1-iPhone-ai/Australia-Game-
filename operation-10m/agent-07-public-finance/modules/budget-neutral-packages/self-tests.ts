import { buildBudgetNeutralPackagesReport } from './compute';
import { buildSpendingOffsetsReport } from '../spending-offsets/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 69,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 23,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runBudgetNeutralPackagesSelfTests(): {
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
  const offsets = buildSpendingOffsetsReport(9, v);
  const supp = buildSupplementaryEstimatesReport(9, v);
  const healthy = buildBudgetNeutralPackagesReport(9, v, offsets, supp);

  record('BNP01', 'Four budget-neutral packages', healthy.packages.length === 4, 'ok');
  record('BNP02', 'Healthy portfolio neutrality', healthy.withinPortfolioNeutrality, healthy.narrative);
  record('BNP03', 'Coherent with spending offsets', healthy.coherentWithSpendingOffsets, 'ok');

  record(
    'BNP04',
    'Aggregate new spending positive under healthy',
    healthy.aggregateNewSpending > 0 && healthy.aggregateOffsets > 0,
    `new=${healthy.aggregateNewSpending}`
  );

  const critical = buildBudgetNeutralPackagesReport(9, snap({ pressure: 'critical' }), offsets, supp);
  record('BNP05', 'Critical overrides neutrality guard', critical.withinPortfolioNeutrality, 'ok');

  record(
    'BNP06',
    'Each package within neutrality band after guard',
    healthy.packages.every(p => p.withinNeutralityBand),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
