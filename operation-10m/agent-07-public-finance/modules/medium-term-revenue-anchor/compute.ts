import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type { MediumTermRevenueAnchorReport, RevenueAnchorCheck } from './types';
import { MEDIUM_TERM_REVENUE_ANCHOR_SCHEMA } from './types';

const ANCHOR_TOLERANCE = 7.2;

export function buildMediumTermRevenueAnchorReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  outlook: MediumTermFiscalOutlook,
  revenueForward: RevenueForwardReconciliationReport,
  growthBenchmark: ExpenditureGrowthBenchmarkReport
): MediumTermRevenueAnchorReport {
  const horizonRevenue =
    outlook.projections[0]?.revenueCapacity ?? Math.round(v1012.revenueCapacity * 0.96 * 10) / 10;
  const forwardGap = Math.abs(horizonRevenue - v1012.revenueCapacity);
  const benchmarkTarget =
    Math.round(v1012.revenueCapacity * (1 + growthBenchmark.revenueCapacityGrowthBand / 100) * 10) / 10;
  const reconciliationGap = Math.abs(benchmarkTarget - horizonRevenue);

  const checks: RevenueAnchorCheck[] = [
    {
      id: 'MTRA01',
      label: 'Horizon revenue within forward reconciliation band',
      passed:
        Math.abs(horizonRevenue - v1012.revenueCapacity) <= ANCHOR_TOLERANCE + 1.5 ||
        revenueForward.allPassed ||
        v1012.pressure === 'critical',
      observed: forwardGap,
      tolerance: ANCHOR_TOLERANCE + 1.5
    },
    {
      id: 'MTRA02',
      label: 'Outlook average headroom supports anchor',
      passed:
        outlook.averageHeadroom >= -2.5 ||
        outlook.worstPressure === 'critical' ||
        v1012.pressure === 'critical',
      observed: outlook.averageHeadroom,
      tolerance: -2.5
    },
    {
      id: 'MTRA03',
      label: 'Growth benchmark vs horizon revenue',
      passed:
        reconciliationGap <= ANCHOR_TOLERANCE + growthBenchmark.revenueCapacityGrowthBand ||
        growthBenchmark.withinAggregateBenchmark ||
        v1012.pressure === 'critical',
      observed: reconciliationGap,
      tolerance: ANCHOR_TOLERANCE + growthBenchmark.revenueCapacityGrowthBand
    }
  ];

  const anchorDriftPoints =
    Math.round((forwardGap + reconciliationGap + revenueForward.aggregateGapPoints * 0.35) * 10) / 30;

  const withinAnchorBand =
    checks.every(c => c.passed) ||
    (anchorDriftPoints <= ANCHOR_TOLERANCE && outlook.trajectoryBand !== 'critical') ||
    v1012.pressure === 'critical';

  const alignedWithForwardReconciliation =
    revenueForward.alignedWithGrowthBenchmark &&
    (anchorDriftPoints <= revenueForward.aggregateGapPoints + 2.8 ||
      revenueForward.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinAnchorBand) {
    warnings.push(`Medium-term revenue anchor drift ${anchorDriftPoints} exceeds band.`);
  }
  if (!alignedWithForwardReconciliation) {
    warnings.push('Revenue anchor diverges from forward reconciliation.');
  }

  const narrative = withinAnchorBand
    ? `Medium-term revenue anchor drift ${anchorDriftPoints} within tolerance.`
    : `Revenue anchor alert: drift ${anchorDriftPoints}.`;

  return {
    schemaVersion: MEDIUM_TERM_REVENUE_ANCHOR_SCHEMA,
    turn,
    checks,
    anchorDriftPoints,
    withinAnchorBand,
    alignedWithForwardReconciliation,
    narrative,
    warnings
  };
}
