import { assessFiscalResilience, FISCAL_SHOCK_CATALOG } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export interface ResilienceSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 5,
    revenueCapacity: partial.revenueCapacity ?? 62,
    fiscalHeadroom: partial.fiscalHeadroom ?? 8,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 3,
    debtLevel: partial.debtLevel ?? 12,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'prudent'
  };
}

export function runFiscalResilienceSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: ResilienceSelfTestResult[];
} {
  const results: ResilienceSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const single = assessFiscalResilience(5, snap({}), ['commodity_drop']);
  record(
    'FR01',
    'Commodity shock lowers adjusted revenue',
    single.shocksApplied[0]!.adjustedSnapshot.revenueCapacity < 62,
    `revenue=${single.shocksApplied[0]!.adjustedSnapshot.revenueCapacity}`
  );

  const stack = assessFiscalResilience(5, snap({ fiscalHeadroom: 6 }), ['commodity_drop', 'rate_shock']);
  record(
    'FR02',
    'Shock stack worsens pressure',
    stack.shocksApplied.length === 2 &&
      (stack.shocksApplied[1]!.pressureAfter === 'strained' ||
        stack.shocksApplied[1]!.pressureAfter === 'tight' ||
        stack.shocksApplied[1]!.pressureAfter === 'critical'),
    `pressure=${stack.shocksApplied[1]!.pressureAfter}`
  );

  const disaster = assessFiscalResilience(5, snap({}), ['disaster_surge']);
  record(
    'FR03',
    'Disaster shock raises maintenance load',
    disaster.shocksApplied[0]!.adjustedSnapshot.maintenanceLoad > 6,
    `maintenance=${disaster.shocksApplied[0]!.adjustedSnapshot.maintenanceLoad}`
  );

  const positive = assessFiscalResilience(5, snap({}), ['migration_dividend']);
  record(
    'FR04',
    'Positive shock improves headroom',
    positive.shocksApplied[0]!.adjustedSnapshot.fiscalHeadroom > 8,
    `headroom=${positive.shocksApplied[0]!.adjustedSnapshot.fiscalHeadroom}`
  );

  record(
    'FR05',
    'Shock catalog minimum size',
    Object.keys(FISCAL_SHOCK_CATALOG).length >= 4,
    `catalog=${Object.keys(FISCAL_SHOCK_CATALOG).length}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
