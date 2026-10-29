import { executeIssuanceCalendar } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 63,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
    pressure: partial.pressure ?? 'tight',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 7,
    debtLevel: partial.debtLevel ?? 28,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runSovereignIssuanceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const cal = executeIssuanceCalendar(10, snap({ turn: 10 }));
  record('SI01', 'TBill executes on scheduled turn', cal.lines.find(l => l.id === 'iss_tbill')!.issuedVolumePoints > 0, 'ok');
  record('SI02', 'Future lines deferred', cal.lines.some(l => l.deferred && l.id === 'iss_nom_7y'), 'ok');

  const critical = executeIssuanceCalendar(10, snap({ turn: 10, pressure: 'critical', fiscalHeadroom: -12 }));
  record('SI03', 'Critical market stress may cause liquidity shortfall', critical.liquidityShortfall || critical.warnings.length > 0, `warnings=${critical.warnings.length}`);

  const off = executeIssuanceCalendar(10, snap({ debtEnabled: false }));
  record('SI04', 'Debt disabled defers all issuance', off.totalIssued === 0, `issued=${off.totalIssued}`);

  record('SI05', 'Weighted tenor computed when issued', cal.weightedAverageTenorYears > 0, `wavg=${cal.weightedAverageTenorYears}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
