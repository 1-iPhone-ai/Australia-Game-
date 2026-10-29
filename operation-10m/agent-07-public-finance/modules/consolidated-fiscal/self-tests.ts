import { buildConsolidatedFiscalReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 7,
    revenueCapacity: partial.revenueCapacity ?? 66,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 18,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runConsolidatedFiscalSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const healthy = buildConsolidatedFiscalReport(7, snap({}));
  record('CF-T01', 'Healthy baseline all layers pass', healthy.allPassed, `${healthy.checks.filter(c => c.passed).length}/${healthy.checks.length}`);
  record('CF-T02', 'One hundred twelve fiscal layers integrated', healthy.layerCount === 112, `layers=${healthy.layerCount}`);

  record(
    'CF-T03',
    'Strained snapshot runs full check suite',
    buildConsolidatedFiscalReport(7, snap({ fiscalHeadroom: -3, pressure: 'strained' })).checks.length === 168,
    'ok'
  );

  const critical = buildConsolidatedFiscalReport(
    7,
    snap({ fiscalHeadroom: -18, pressure: 'critical', debtServiceLoad: 22, debtLevel: 62, maintenanceLoad: 18 })
  );
  record('CF-T04', 'Critical stack fails at least one guard', critical.allPassed === false, `failed=${critical.checks.filter(c => !c.passed).map(c => c.id).join(',') || 'none'}`);

  record(
    'CF-T05',
    'CF01–CF168 ids present',
    healthy.checks.length === 168 &&
      healthy.checks[0]?.id === 'CF01' &&
      healthy.checks[167]?.id === 'CF168',
    healthy.checks.map(c => c.id).join(',')
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
