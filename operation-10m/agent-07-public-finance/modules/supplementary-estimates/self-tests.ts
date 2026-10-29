import { buildSupplementaryEstimatesReport } from './compute';
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

export function runSupplementaryEstimatesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildSupplementaryEstimatesReport(8, snap({}));
  record('SE01', 'Five supplementary estimate lines', healthy.lines.length === 5, 'ok');
  record('SE02', 'Healthy revision within tolerance', healthy.withinRevisionTolerance, healthy.narrative);
  record(
    'SE03',
    'Net revision equals upward minus downward',
    Math.abs(healthy.netRevisionPoints - (healthy.aggregateUpwardRevision - healthy.aggregateDownwardRevision)) < 0.15,
    `net=${healthy.netRevisionPoints}`
  );

  const midYear = buildSupplementaryEstimatesReport(7, snap({ turn: 7, maintenanceLoad: 16, fiscalHeadroom: -2 }));
  record(
    'SE04',
    'Strained maintenance raises parameter drift',
    midYear.aggregateUpwardRevision >= healthy.aggregateUpwardRevision,
    `${midYear.aggregateUpwardRevision} vs ${healthy.aggregateUpwardRevision}`
  );

  const critical = buildSupplementaryEstimatesReport(11, snap({ pressure: 'critical', fiscalHeadroom: -20 }));
  record('SE05', 'Critical pressure overrides revision guard', critical.withinRevisionTolerance, 'ok');

  record(
    'SE06',
    'Each line carries portfolio id',
    healthy.lines.every(l => l.portfolioId.length > 0),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
