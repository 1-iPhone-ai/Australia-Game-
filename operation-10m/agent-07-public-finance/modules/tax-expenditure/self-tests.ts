import { buildTaxExpenditureStatement, countTaxExpenditureMeasures } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 5,
    revenueCapacity: partial.revenueCapacity ?? 65,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 15,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runTaxExpenditureSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const stmt = buildTaxExpenditureStatement(5, snap({}));
  record('TE01', 'Forgone reduces net structural capacity', stmt.netStructuralCapacity < stmt.grossStructuralCapacity, `net=${stmt.netStructuralCapacity}`);
  record('TE02', 'Catalog measures enumerated', stmt.lines.length === countTaxExpenditureMeasures(), `count=${stmt.lines.length}`);
  record('TE03', 'Material super concession flagged', stmt.lines.some(l => l.measureId === 'te_super_concession' && l.band !== 'minor'), 'ok');

  const sunset = buildTaxExpenditureStatement(13, snap({ turn: 13 }));
  const phantom = sunset.lines.find(l => l.measureId === 'te_phantom_sunset');
  record('TE04', 'Sunset measure zero after expiry', phantom?.forgonePoints === 0, `forgone=${phantom?.forgonePoints}`);

  const critical = buildTaxExpenditureStatement(5, snap({ pressure: 'critical' }));
  record('TE05', 'Critical pressure scales forgone upward', critical.totalForgone > stmt.totalForgone, `crit=${critical.totalForgone}, base=${stmt.totalForgone}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
