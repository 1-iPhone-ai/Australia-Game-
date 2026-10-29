import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/types';
import type { MultiYearExpenditureFramework } from '../multi-year-framework/types';
import type { NationalRevenueLedger } from '../revenue-ledger/types';
import type { RevenueForwardCheck, RevenueForwardReconciliationReport } from './types';
import { REVENUE_FORWARD_RECONCILIATION_SCHEMA } from './types';

const FORWARD_GAP_TOLERANCE = 6.5;

export function buildRevenueForwardReconciliationReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  ledger: NationalRevenueLedger,
  myefo: MultiYearExpenditureFramework,
  growthBenchmark: ExpenditureGrowthBenchmarkReport
): RevenueForwardReconciliationReport {
  const forwardCapacity =
    myefo.forwardBands[0]?.envelopeCapacity ?? Math.round(v1012.revenueCapacity * 0.92);
  const revenueBandTarget = Math.round(
    v1012.revenueCapacity * (1 + growthBenchmark.revenueCapacityGrowthBand / 100) * 10
  ) / 10;
  const modeledGap = Math.round((ledger.currentCapacity - forwardCapacity) * 10) / 10;
  const bandGap = Math.round((ledger.currentCapacity - revenueBandTarget) * 10) / 10;

  const checks: RevenueForwardCheck[] = [
    {
      id: 'RFR01',
      label: 'Ledger current vs MYEFO forward band',
      passed:
        Math.abs(modeledGap) <= FORWARD_GAP_TOLERANCE ||
        ledger.reconciledToV1012 ||
        v1012.pressure === 'critical',
      observed: Math.abs(modeledGap),
      tolerance: FORWARD_GAP_TOLERANCE
    },
    {
      id: 'RFR02',
      label: 'Structural capacity within ledger tolerance',
      passed:
        ledger.reconciledToV1012 ||
        Math.abs(ledger.currentCapacity - ledger.structuralCapacity) <=
          Math.max(8, ledger.structuralCapacity * 0.12),
      observed: Math.abs(ledger.currentCapacity - ledger.structuralCapacity),
      tolerance: Math.max(8, ledger.structuralCapacity * 0.12)
    },
    {
      id: 'RFR03',
      label: 'Forward band vs revenue growth benchmark',
      passed:
        Math.abs(bandGap) <= FORWARD_GAP_TOLERANCE + 1.5 ||
        growthBenchmark.withinAggregateBenchmark ||
        v1012.pressure === 'critical',
      observed: Math.abs(bandGap),
      tolerance: FORWARD_GAP_TOLERANCE + 1.5
    }
  ];

  const aggregateGapPoints = Math.round((Math.abs(modeledGap) + Math.abs(bandGap)) * 10) / 20;
  const allPassed = checks.every(c => c.passed);

  const alignedWithGrowthBenchmark =
    growthBenchmark.coherentWithForwardIntegrity &&
    (Math.abs(bandGap) <= growthBenchmark.revenueCapacityGrowthBand + 2.2 ||
      allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!allPassed) {
    warnings.push(`Revenue forward gap modeled=${modeledGap}, band=${bandGap}.`);
  }
  if (!alignedWithGrowthBenchmark) {
    warnings.push('Revenue forward reconciliation diverges from expenditure growth benchmark.');
  }

  const narrative = allPassed
    ? `Revenue forward reconciliation gap ${aggregateGapPoints} within tolerance.`
    : `Revenue forward alert: aggregate gap ${aggregateGapPoints}.`;

  return {
    schemaVersion: REVENUE_FORWARD_RECONCILIATION_SCHEMA,
    turn,
    checks,
    aggregateGapPoints,
    allPassed,
    alignedWithGrowthBenchmark,
    narrative,
    warnings
  };
}
