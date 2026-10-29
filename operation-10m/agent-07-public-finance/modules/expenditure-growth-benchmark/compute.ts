import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/types';
import type { MultiYearExpenditureFramework } from '../multi-year-framework/types';
import type { RecurringCommitmentsSchedule } from '../recurring-commitments/types';
import type { ExpenditureGrowthBenchmarkReport, GrowthBenchmarkRow } from './types';
import { EXPENDITURE_GROWTH_BENCHMARK_SCHEMA } from './types';

const AGGREGATE_GROWTH_CAP = 4.2;

export function buildExpenditureGrowthBenchmarkReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  myefo: MultiYearExpenditureFramework,
  recurring: RecurringCommitmentsSchedule,
  forwardIntegrity: ForwardEstimatesIntegrityReport
): ExpenditureGrowthBenchmarkReport {
  const revenueBand = Math.min(5.5, Math.max(1.8, v1012.revenueCapacity / 14));
  const envelopeCapacity =
    myefo.forwardBands[0]?.envelopeCapacity ?? Math.max(1, recurring.totalLoadThisTurn * 2);
  const loadRatio = recurring.totalLoadThisTurn / Math.max(1, envelopeCapacity);

  const rows: GrowthBenchmarkRow[] = myefo.ceilings.map(row => {
    const projectedPoints = Math.round(row.ceilingPoints * (1 + loadRatio * 0.04) * 10) / 10;
    const growthRatePercent =
      row.baselinePoints <= 0
        ? 0
        : Math.round(((projectedPoints - row.baselinePoints) / row.baselinePoints) * 1000) / 10;
    const cap = row.growthCapPercent + (v1012.pressure === 'strained' ? 0.6 : 0);
    const withinBenchmarkBand =
      growthRatePercent <= cap + 0.35 ||
      row.binding === false ||
      v1012.pressure === 'critical';
    return {
      category: row.category,
      baselinePoints: row.baselinePoints,
      projectedPoints,
      growthRatePercent,
      withinBenchmarkBand
    };
  });

  const totalBaseline = rows.reduce((s, r) => s + r.baselinePoints, 0);
  const totalProjected = rows.reduce((s, r) => s + r.projectedPoints, 0);
  const aggregateGrowthRate =
    totalBaseline <= 0
      ? 0
      : Math.round(((totalProjected - totalBaseline) / totalBaseline) * 1000) / 10;

  const withinAggregateBenchmark =
    aggregateGrowthRate <= AGGREGATE_GROWTH_CAP ||
    aggregateGrowthRate <= revenueBand + 1.2 ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && aggregateGrowthRate <= AGGREGATE_GROWTH_CAP * 1.15);

  const coherentWithForwardIntegrity =
    forwardIntegrity.coherentWithSupplementary &&
    (Math.abs(aggregateGrowthRate - forwardIntegrity.bandDriftPoints) <= 2.8 ||
      forwardIntegrity.allPassed ||
      forwardIntegrity.aggregateRevisionGap <= 5 ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinAggregateBenchmark) {
    warnings.push(`Aggregate growth ${aggregateGrowthRate}% exceeds cap ${AGGREGATE_GROWTH_CAP}%.`);
  }
  if (!coherentWithForwardIntegrity) {
    warnings.push('Growth benchmark diverges from forward estimates integrity band.');
  }

  const narrative = withinAggregateBenchmark
    ? `Expenditure growth benchmark ${aggregateGrowthRate}% vs revenue band ${revenueBand.toFixed(1)}%.`
    : `Growth benchmark alert: ${aggregateGrowthRate}%.`;

  return {
    schemaVersion: EXPENDITURE_GROWTH_BENCHMARK_SCHEMA,
    turn,
    rows,
    aggregateGrowthRate,
    revenueCapacityGrowthBand: Math.round(revenueBand * 10) / 10,
    withinAggregateBenchmark,
    coherentWithForwardIntegrity,
    narrative,
    warnings
  };
}
