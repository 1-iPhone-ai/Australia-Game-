import { buildGrantClawbackScheduleReport } from './compute';
import { allocateIntergovernmentalGrants } from '../intergovernmental-grants/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
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

export function runGrantClawbackScheduleSelfTests(): {
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
  const ig = allocateIntergovernmentalGrants(10, v);
  const healthy = buildGrantClawbackScheduleReport(10, v, ig);

  record('GCS01', 'Five clawback schedule tranches', healthy.tranches.length === 5, 'ok');
  record('GCS02', 'Healthy within schedule tolerance', healthy.withinScheduleTolerance, healthy.narrative);
  record('GCS03', 'Aligned with IGR pool under healthy', healthy.alignedWithIgrPool, 'ok');

  const stressed = buildGrantClawbackScheduleReport(
    10,
    snap({ maintenanceLoad: 18, fiscalHeadroom: -6, pressure: 'strained' }),
    allocateIntergovernmentalGrants(10, snap({ maintenanceLoad: 18, fiscalHeadroom: -6, pressure: 'strained' }))
  );
  record(
    'GCS04',
    'Stressed grants raise clawback pool vs healthy',
    stressed.aggregateClawbackPoints >= healthy.aggregateClawbackPoints,
    `${stressed.aggregateClawbackPoints} vs ${healthy.aggregateClawbackPoints}`
  );

  const critical = buildGrantClawbackScheduleReport(10, snap({ pressure: 'critical' }), ig);
  record('GCS05', 'Critical overrides schedule tolerance', critical.withinScheduleTolerance, 'ok');

  record(
    'GCS06',
    'Scheduled points non-negative',
    healthy.tranches.every(t => t.scheduledPoints >= 0),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
