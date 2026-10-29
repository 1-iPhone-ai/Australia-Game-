import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { buildSpendingOffsetsReport } from '../spending-offsets/compute';
import { buildEfficiencyDividendRegisterReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 68,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 5,
    debtLevel: partial.debtLevel ?? 20,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 6,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runEfficiencyDividendRegisterSelfTests(): {
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
  const offsets = buildSpendingOffsetsReport(9, v);
  const rules = assessFiscalRulesFramework({
    turn: 9,
    v1012: v,
    envelopeContingencyPoints: 2,
    forwardSpendingGrowth: 2
  });
  const healthy = buildEfficiencyDividendRegisterReport(9, v, offsets, rules);

  record('EDR01', 'At least one efficiency dividend line', healthy.lines.length >= 1, 'ok');
  record(
    'EDR02',
    'Healthy within portfolio schedule',
    healthy.withinPortfolioSchedule,
    `ratio=${healthy.scheduleToRealizationRatio}`
  );
  record(
    'EDR03',
    'Coherent with spending offsets',
    healthy.coherentWithSpendingOffsets,
    `realized=${healthy.aggregateRealizedPoints}`
  );

  const strained = buildEfficiencyDividendRegisterReport(
    9,
    snap({ pressure: 'strained', fiscalHeadroom: -2 }),
    offsets,
    rules
  );
  record('EDR04', 'Strained still produces register', strained.lines.length >= 1, 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
