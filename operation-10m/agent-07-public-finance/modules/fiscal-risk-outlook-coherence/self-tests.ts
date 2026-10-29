import { buildFiscalRiskRegister } from '../fiscal-risk-register/compute';
import { buildFiscalStressScenariosReport } from '../fiscal-stress-scenarios/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildFiscalRiskOutlookCoherenceReport } from './compute';
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

export function runFiscalRiskOutlookCoherenceSelfTests(): {
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
  const riskRegister = buildFiscalRiskRegister(9, v);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const fiscalStress = buildFiscalStressScenariosReport(9, v);
  const healthy = buildFiscalRiskOutlookCoherenceReport(9, v, riskRegister, outlook, fiscalStress);

  record('FROC-T01', 'Three risk outlook checks', healthy.checks.length === 3, 'ok');
  record(
    'FROC-T02',
    'Within risk outlook band',
    healthy.withinRiskOutlookBand,
    `gap=${healthy.aggregateCoherenceGapPoints}`
  );
  record(
    'FROC-T03',
    'Aligned with stress scenarios',
    healthy.alignedWithStressScenarios,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
