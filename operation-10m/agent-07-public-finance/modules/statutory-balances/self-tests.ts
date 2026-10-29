import { buildStatutoryBalancesReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 12,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 9,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 24,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runStatutoryBalancesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildStatutoryBalancesReport(12, snap({}));
  record('SB01', 'Three statutory bands reported', healthy.bands.length === 3, 'ok');
  record('SB02', 'Healthy snapshot within soft anchors', healthy.allWithinSoftAnchors, healthy.narrative);
  record('SB03', 'Net debt ratio bounded', healthy.netDebtToCapacityRatio <= 0.72, `ratio=${healthy.netDebtToCapacityRatio}`);

  const levered = buildStatutoryBalancesReport(
    12,
    snap({ debtLevel: 58, debtServiceLoad: 19, fiscalHeadroom: -2, pressure: 'strained' })
  );
  record('SB04', 'High debt triggers anchor breach or warn', levered.warnings.length > 0, levered.warnings[0] ?? 'none');

  const critical = buildStatutoryBalancesReport(
    12,
    snap({ pressure: 'critical', fiscalHeadroom: -20, debtLevel: 70, maintenanceLoad: 22 })
  );
  record('SB05', 'Critical override on operating anchor', critical.bands[0].withinAnchor, `nob=${critical.netOperatingBalance}`);

  record('SB06', 'Schema version set', healthy.schemaVersion.includes('statutory-balances'), healthy.schemaVersion);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
