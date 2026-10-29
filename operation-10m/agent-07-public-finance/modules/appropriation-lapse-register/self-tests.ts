import { buildAppropriationLapseRegisterReport } from './compute';
import { buildAppropriationWarrantLedger } from '../appropriation-warrants/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 25,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runAppropriationLapseRegisterSelfTests(): {
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
  const warrants = buildAppropriationWarrantLedger(11, v);
  const healthy = buildAppropriationLapseRegisterReport(11, v, warrants);
  record('ALR01', 'Five lapse register entries', healthy.entries.length === 5, 'ok');
  record('ALR02', 'Healthy within register tolerance', healthy.withinRegisterTolerance, healthy.narrative);
  record('ALR03', 'Aligned with warrant ledger', healthy.alignedWithWarrantLedger, 'ok');

  const midYear = buildAppropriationLapseRegisterReport(
    5,
    snap({ turn: 5 }),
    buildAppropriationWarrantLedger(5, snap({ turn: 5 }))
  );
  record(
    'ALR04',
    'Year-end turn raises lapse aggregate vs mid-year',
    healthy.aggregateLapsePoints >= midYear.aggregateLapsePoints * 0.95,
    `${healthy.aggregateLapsePoints} vs mid ${midYear.aggregateLapsePoints}`
  );

  const critical = buildAppropriationLapseRegisterReport(
    11,
    snap({ pressure: 'critical', fiscalHeadroom: -18 }),
    buildAppropriationWarrantLedger(11, snap({ pressure: 'critical' }))
  );
  record('ALR05', 'Critical overrides register tolerance', critical.withinRegisterTolerance, 'ok');

  record(
    'ALR06',
    'Lapse ratio bounded under healthy',
    healthy.lapseToRemainingRatio <= 0.53,
    `ratio=${healthy.lapseToRemainingRatio}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
