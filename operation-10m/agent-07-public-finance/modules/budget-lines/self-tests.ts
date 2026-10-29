import { buildBudgetEnvelope } from '../fiscal-outcomes/budget-envelopes';
import { buildDetailedBudgetPaper, countAppropriationLines } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export interface BudgetLinesSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 3,
    revenueCapacity: partial.revenueCapacity ?? 64,
    fiscalHeadroom: partial.fiscalHeadroom ?? 7,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 14,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 5,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runBudgetLinesSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: BudgetLinesSelfTestResult[];
} {
  const results: BudgetLinesSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v1012 = snap({});
  const envelope = buildBudgetEnvelope(v1012);
  const paper = buildDetailedBudgetPaper(v1012, envelope);

  record(
    'BL01',
    'Every envelope category has sub-line breakdown',
    paper.categories.length === envelope.lines.length,
    `categories=${paper.categories.length}`
  );

  const allBalanced = paper.categories.every(c => c.linesBalanced);
  record('BL02', 'Sub-line sums reconcile to envelope rows', allBalanced, `balanced=${allBalanced}`);

  const core = paper.categories.find(c => c.category === 'core_services');
  record(
    'BL03',
    'Core services has multiple appropriation codes',
    (core?.subLines.length ?? 0) >= 4,
    `sublines=${core?.subLines.length ?? 0}`
  );

  const critical = buildDetailedBudgetPaper(
    snap({ pressure: 'critical', fiscalHeadroom: -5 }),
    buildBudgetEnvelope(snap({ pressure: 'critical', fiscalHeadroom: -5 }))
  );
  const hasPressure = critical.categories.some(c => c.subLines.some(s => s.varianceBand === 'pressure' || s.varianceBand === 'blown'));
  record('BL04', 'Critical pressure elevates variance bands', hasPressure, `warnings=${critical.aggregateVarianceWarnings.length}`);

  record('BL05', 'Appropriation catalog minimum depth', countAppropriationLines() >= 20, `lines=${countAppropriationLines()}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
