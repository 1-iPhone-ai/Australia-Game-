import { allocateIntergovernmentalGrants } from '../intergovernmental-grants/compute';
import { buildBudgetNeutralForwardCoherenceReport } from '../budget-neutral-forward-coherence/compute';
import { buildBudgetNeutralPackagesReport } from '../budget-neutral-packages/compute';
import { buildExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/compute';
import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { buildGrantForwardAlignmentReport } from '../grant-forward-alignment/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { buildSpendingOffsetsReport } from '../spending-offsets/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { buildBudgetNeutralOutlookBridgeReport } from './compute';
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

export function runBudgetNeutralOutlookBridgeSelfTests(): {
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
  const supplementary = buildSupplementaryEstimatesReport(9, v);
  const neutral = buildBudgetNeutralPackagesReport(9, v, offsets, supplementary);
  const myefo = buildMultiYearExpenditureFramework(v, 3);
  const recurring = scheduleRecurringCommitments(9, v, state.budget);
  const outlook = buildMediumTermFiscalOutlook(v, 3);
  const forwardIntegrity = buildForwardEstimatesIntegrityReport(9, v, myefo, supplementary, outlook);
  const growth = buildExpenditureGrowthBenchmarkReport(9, v, myefo, recurring, forwardIntegrity);
  const grants = allocateIntergovernmentalGrants(9, v);
  const grantForward = buildGrantForwardAlignmentReport(9, v, grants, myefo, forwardIntegrity, growth);
  const neutralForward = buildBudgetNeutralForwardCoherenceReport(9, v, neutral, grantForward, growth);
  const healthy = buildBudgetNeutralOutlookBridgeReport(9, v, neutral, neutralForward, outlook);

  record('BNOB-T01', 'Three budget neutral outlook checks', healthy.checks.length === 3, 'ok');
  record(
    'BNOB-T02',
    'Within budget neutral outlook band',
    healthy.withinBudgetNeutralOutlookBand,
    `gap=${healthy.bridgeGapPoints}`
  );
  record(
    'BNOB-T03',
    'Aligned with neutral forward coherence',
    healthy.alignedWithNeutralForwardCoherence,
    healthy.narrative
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
