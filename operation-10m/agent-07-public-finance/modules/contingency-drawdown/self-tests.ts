import { buildContingencyDrawdownRegisterReport } from './compute';
import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 8,
    revenueCapacity: partial.revenueCapacity ?? 67,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 6,
    debtLevel: partial.debtLevel ?? 22,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runContingencyDrawdownSelfTests(): {
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
  const persisted = createInitialFiscalOutcomesPersisted(8);
  const { state } = computeFiscalOutcomesLayer({ turn: 8, v1012: v }, persisted);
  const flex = state.budget.lines.find(l => l.category === 'contingency')?.flexPoints ?? 4;
  const rules = assessFiscalRulesFramework({
    turn: 8,
    v1012: v,
    envelopeContingencyPoints: flex,
    forwardSpendingGrowth: 2
  });

  const healthy = buildContingencyDrawdownRegisterReport(8, v, flex, rules);
  record('CDR01', 'Four contingency drawdown entries', healthy.entries.length === 4, 'ok');
  record('CDR02', 'Healthy within drawdown cap', healthy.withinDrawdownCap, healthy.narrative);
  record('CDR03', 'Coherent with fiscal rules under healthy', healthy.coherentWithFiscalRules, 'ok');

  const strained = buildContingencyDrawdownRegisterReport(
    8,
    snap({ pressure: 'strained', maintenanceLoad: 16 }),
    flex,
    rules
  );
  record(
    'CDR04',
    'Strained pressure raises drawdown aggregate',
    strained.aggregateDrawdownPoints >= healthy.aggregateDrawdownPoints,
    `${strained.aggregateDrawdownPoints} vs ${healthy.aggregateDrawdownPoints}`
  );

  const critical = buildContingencyDrawdownRegisterReport(8, snap({ pressure: 'critical' }), flex, rules);
  record('CDR05', 'Critical overrides drawdown cap', critical.withinDrawdownCap, 'ok');

  record(
    'CDR06',
    'Closing flex non-negative',
    healthy.closingFlexPoints >= 0 && healthy.closingFlexPoints <= healthy.openingFlexPoints,
    `closing=${healthy.closingFlexPoints}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
