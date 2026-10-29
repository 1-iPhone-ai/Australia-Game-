import { buildSpendingOffsetsReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runSpendingOffsetsSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildSpendingOffsetsReport(8, snap({}));
  record('SO01', 'Five offset portfolio lines', healthy.lines.length === 5, 'ok');
  record('SO02', 'Healthy portfolio meets coverage floor', healthy.withinPortfolioTarget, healthy.narrative);
  record(
    'SO03',
    'Coverage ratio bounded',
    healthy.portfolioCoverageRatio >= 0 && healthy.portfolioCoverageRatio <= 1.5,
    `ratio=${healthy.portfolioCoverageRatio}`
  );

  const election = buildSpendingOffsetsReport(10, snap({ turn: 10 }));
  record(
    'SO04',
    'Election window raises new spending load',
    election.aggregateNewSpending >= healthy.aggregateNewSpending,
    `${election.aggregateNewSpending} vs ${healthy.aggregateNewSpending}`
  );

  const critical = buildSpendingOffsetsReport(10, snap({ pressure: 'critical', fiscalHeadroom: -22 }));
  record('SO05', 'Critical overrides portfolio target', critical.withinPortfolioTarget, 'ok');

  record(
    'SO06',
    'Fully offset lines have coverage at least 1',
    healthy.lines.filter(l => l.fullyOffset).every(l => l.coverageRatio >= 0.99),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
