import { buildAppropriationWarrantLedger } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 70,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runAppropriationWarrantsSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildAppropriationWarrantLedger(8, snap({}));
  record('AW01', 'Five portfolio warrant lines', healthy.lines.length === 5, 'ok');
  record('AW02', 'Healthy lapse within tolerance', healthy.lapseWithinTolerance, healthy.narrative);
  record(
    'AW03',
    'Issued plus remaining approximates appropriation',
    healthy.lines.every(l => l.warrantIssuedPoints + l.warrantRemainingPoints <= l.appropriationPoints + 0.2),
    'ok'
  );

  const lateYear = buildAppropriationWarrantLedger(11, snap({ pressure: 'strained', fiscalHeadroom: -1 }));
  record(
    'AW04',
    'Late-year strained pressure raises lapse risk',
    lateYear.aggregateLapseRisk >= healthy.aggregateLapseRisk,
    `${lateYear.aggregateLapseRisk} vs ${healthy.aggregateLapseRisk}`
  );

  const critical = buildAppropriationWarrantLedger(11, snap({ pressure: 'critical', fiscalHeadroom: -18 }));
  record('AW05', 'Critical overrides aggregate lapse guard', critical.lapseWithinTolerance, 'ok');

  record(
    'AW06',
    'Each line has warrant id',
    healthy.lines.every(l => l.warrantId.startsWith('warrant_')),
    'ok'
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
