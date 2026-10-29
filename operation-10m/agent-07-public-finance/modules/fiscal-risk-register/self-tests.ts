import { buildFiscalRiskRegister, catalogFiscalRisks } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 6,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runFiscalRiskRegisterSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const catalog = catalogFiscalRisks(9);
  record('FR01', 'Risk catalog covers core categories', catalog.length >= 6, `n=${catalog.length}`);

  const base = buildFiscalRiskRegister(9, snap({}));
  record('FR02', 'Healthy snapshot within appetite', base.withinRiskAppetite && base.tier === 'low', `heat=${base.aggregateHeat}`);
  record('FR03', 'Aggregate heat positive', base.aggregateHeat > 0, 'ok');
  record('FR04', 'Unmitigated count matches catalog', base.unmitigatedCount === catalog.filter(c => !c.mitigationReady).length, `u=${base.unmitigatedCount}`);

  const strained = buildFiscalRiskRegister(9, snap({ fiscalHeadroom: -2, pressure: 'strained', debtServiceLoad: 16 }));
  record('FR05', 'Strained snapshot raises heat', strained.aggregateHeat > base.aggregateHeat, `${strained.aggregateHeat} vs ${base.aggregateHeat}`);
  record('FR06', 'Elevated or severe under strain', strained.tier !== 'low', `tier=${strained.tier}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
