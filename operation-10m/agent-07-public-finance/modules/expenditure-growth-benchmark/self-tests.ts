import { buildForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/compute';
import { buildMediumTermFiscalOutlook } from '../medium-term-outlook/compute';
import { buildMultiYearExpenditureFramework } from '../multi-year-framework/compute';
import { buildSupplementaryEstimatesReport } from '../supplementary-estimates/compute';
import { scheduleRecurringCommitments } from '../recurring-commitments/compute';
import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { buildExpenditureGrowthBenchmarkReport } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 9,
    revenueCapacity: partial.revenueCapacity ?? 70,
    fiscalHeadroom: partial.fiscalHeadroom ?? 5,
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

function bundle(turn: number, v1012: V1012FiscalSnapshot) {
  const persisted = createInitialFiscalOutcomesPersisted(turn);
  const { state } = computeFiscalOutcomesLayer({ turn, v1012 }, persisted);
  const recurring = scheduleRecurringCommitments(turn, v1012, state.budget);
  const myefo = buildMultiYearExpenditureFramework(v1012, 3);
  const outlook = buildMediumTermFiscalOutlook(v1012, 3);
  const supplementary = buildSupplementaryEstimatesReport(turn, v1012, state.budget);
  const forwardIntegrity = buildForwardEstimatesIntegrityReport(turn, v1012, myefo, supplementary, outlook);
  return { recurring, myefo, forwardIntegrity };
}

export function runExpenditureGrowthBenchmarkSelfTests(): {
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
  const { recurring, myefo, forwardIntegrity } = bundle(9, v);
  const healthy = buildExpenditureGrowthBenchmarkReport(9, v, myefo, recurring, forwardIntegrity);

  record('EGB01', 'At least one benchmark row', healthy.rows.length >= 1, 'ok');
  record('EGB02', 'Within aggregate benchmark', healthy.withinAggregateBenchmark, healthy.narrative);
  record('EGB03', 'Coherent with forward integrity', healthy.coherentWithForwardIntegrity, 'ok');
  record('EGB04', 'Revenue growth band positive', healthy.revenueCapacityGrowthBand > 0, `band=${healthy.revenueCapacityGrowthBand}`);

  const strained = buildExpenditureGrowthBenchmarkReport(
    9,
    snap({ pressure: 'strained', fiscalHeadroom: -5 }),
    bundle(9, snap({ pressure: 'strained', fiscalHeadroom: -5 })).myefo,
    bundle(9, snap({ pressure: 'strained', fiscalHeadroom: -5 })).recurring,
    bundle(9, snap({ pressure: 'strained', fiscalHeadroom: -5 })).forwardIntegrity
  );
  record('EGB05', 'Strained snapshot runs benchmark', strained.rows.length >= 1, `growth=${strained.aggregateGrowthRate}`);

  const critical = buildExpenditureGrowthBenchmarkReport(
    9,
    snap({ pressure: 'critical' }),
    myefo,
    recurring,
    forwardIntegrity
  );
  record('EGB06', 'Critical override path', critical.withinAggregateBenchmark || critical.coherentWithForwardIntegrity, 'ok');

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
