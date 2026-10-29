import { assessFiscalRulesFramework } from '../fiscal-rules/compute';
import { reviewProgramPerformance } from '../program-performance/compute';
import { buildSpendingOffsetsReport } from '../spending-offsets/compute';
import { buildProgramPerformanceFiscalBridgeReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';

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

export function runProgramPerformanceFiscalBridgeSelfTests(): {
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
  const persisted = createInitialFiscalOutcomesPersisted(9);
  const { state } = computeFiscalOutcomesLayer({ turn: 9, v1012: v }, persisted);
  const offsets = buildSpendingOffsetsReport(9, v);
  const contingencyFlex = state.budget.lines.find(l => l.category === 'contingency')?.flexPoints ?? 0;
  const rules = assessFiscalRulesFramework({
    turn: 9,
    v1012: v,
    envelopeContingencyPoints: contingencyFlex,
    forwardSpendingGrowth: 2
  });
  const programPerf = reviewProgramPerformance(9, v);
  const healthy = buildProgramPerformanceFiscalBridgeReport(9, v, programPerf, rules, offsets);

  record('PPFB-T01', 'Three bridge checks', healthy.checks.length === 3, 'ok');
  record(
    'PPFB-T02',
    'Within performance fiscal band',
    healthy.withinPerformanceFiscalBand,
    `gap=${healthy.bridgeFeedbackGapPoints}`
  );
  record(
    'PPFB-T03',
    'Aligned with spending offsets',
    healthy.alignedWithSpendingOffsets,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
