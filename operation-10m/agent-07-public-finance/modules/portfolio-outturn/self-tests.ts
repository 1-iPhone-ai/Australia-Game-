import { buildPortfolioOutturnReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 70,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runPortfolioOutturnSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildPortfolioOutturnReport(9, snap({}));
  record('PO01', 'Five portfolio outturn lines', healthy.lines.length === 5, 'ok');
  record('PO02', 'Healthy aggregate within tolerance', healthy.withinReconciliationTolerance, healthy.narrative);
  record(
    'PO03',
    'Variance ratio bounded per line under healthy',
    healthy.lines.every(l => l.withinPortfolioBand),
    `outside=${healthy.portfoliosOutsideBand}`
  );

  const strained = buildPortfolioOutturnReport(11, snap({ turn: 11, maintenanceLoad: 19, fiscalHeadroom: -4, pressure: 'strained' }));
  record(
    'PO04',
    'Strained maintenance increases aggregate variance magnitude',
    Math.abs(strained.aggregateVariancePoints) >= Math.abs(healthy.aggregateVariancePoints),
    `${strained.aggregateVariancePoints} vs ${healthy.aggregateVariancePoints}`
  );

  const critical = buildPortfolioOutturnReport(12, snap({ pressure: 'critical', fiscalHeadroom: -22, maintenanceLoad: 22 }));
  record('PO05', 'Critical pressure overrides reconciliation guard', critical.withinReconciliationTolerance, 'ok');

  record(
    'PO06',
    'Each line links portfolio id',
    healthy.lines.every(l => l.portfolioId.startsWith('pf_')),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
