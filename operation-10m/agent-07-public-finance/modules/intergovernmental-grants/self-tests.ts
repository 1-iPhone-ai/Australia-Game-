import { allocateIntergovernmentalGrants } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 11,
    revenueCapacity: partial.revenueCapacity ?? 64,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 3,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runIntergovernmentalGrantsSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = allocateIntergovernmentalGrants(11, snap({}));
  record('IG01', 'Five grant programs allocated', healthy.allocations.length === 5, 'ok');
  record('IG02', 'Pool reconciled to IGR slice', healthy.reconciledToIgrPool, `total=${healthy.totalFederal}`);
  record('IG03', 'Net outlay equals federal minus clawback', healthy.netFederalOutlay === Math.round((healthy.totalFederal - healthy.totalClawback) * 10) / 10, 'ok');
  record('IG04', 'Healthy pass rate high', healthy.performancePassRate >= 0.6, `rate=${healthy.performancePassRate}`);

  const critical = allocateIntergovernmentalGrants(11, snap({ pressure: 'critical', fiscalHeadroom: -12, maintenanceLoad: 20, debtServiceLoad: 24, sustainability: 'fragile' }));
  record('IG05', 'Critical snapshot triggers clawbacks', critical.totalClawback > healthy.totalClawback, `${critical.totalClawback} vs ${healthy.totalClawback}`);
  record('IG06', 'Performance pass rate drops under stress', critical.performancePassRate < healthy.performancePassRate, `rate=${critical.performancePassRate}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
