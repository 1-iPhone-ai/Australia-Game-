import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/types';
import type { ForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/types';
import type { IntergovernmentalGrantsReport } from '../intergovernmental-grants/types';
import type { MultiYearExpenditureFramework } from '../multi-year-framework/types';
import type { GrantForwardAlignmentReport, GrantForwardCheck } from './types';
import { GRANT_FORWARD_ALIGNMENT_SCHEMA } from './types';

const GRANT_GAP_TOLERANCE = 5.2;

export function buildGrantForwardAlignmentReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  grants: IntergovernmentalGrantsReport,
  myefo: MultiYearExpenditureFramework,
  forwardIntegrity: ForwardEstimatesIntegrityReport,
  growthBenchmark: ExpenditureGrowthBenchmarkReport
): GrantForwardAlignmentReport {
  const forwardCapacity = myefo.forwardBands[0]?.envelopeCapacity ?? v1012.revenueCapacity * 0.9;
  const grantShare = grants.netFederalOutlay / Math.max(1, forwardCapacity);
  const bandDriftGap = Math.abs(forwardIntegrity.bandDriftPoints - grants.totalClawback * 0.35);
  const growthGap = Math.abs(
    growthBenchmark.aggregateGrowthRate - grantShare * growthBenchmark.revenueCapacityGrowthBand
  );

  const aggregateAlignmentGapPoints =
    Math.round((bandDriftGap + growthGap + Math.abs(grantShare - 0.18) * 10) * 10) / 30;

  const checks: GrantForwardCheck[] = [
    {
      id: 'GFA01',
      label: 'Grants reconciled to IGR pool',
      passed: grants.reconciledToIgrPool || v1012.pressure === 'critical',
      detail: `net=${grants.netFederalOutlay}, federal=${grants.totalFederal}`
    },
    {
      id: 'GFA02',
      label: 'Grant outlay vs MYEFO forward capacity',
      passed:
        grantShare <= 0.42 ||
        grants.performancePassRate >= 0.55 ||
        v1012.pressure === 'critical',
      detail: `share=${Math.round(grantShare * 1000) / 10}%, capacity=${forwardCapacity}`
    },
    {
      id: 'GFA03',
      label: 'Forward integrity vs grant clawback drift',
      passed:
        bandDriftGap <= GRANT_GAP_TOLERANCE + 2 ||
        forwardIntegrity.allPassed ||
        v1012.pressure === 'critical',
      detail: `drift=${forwardIntegrity.bandDriftPoints}, clawback=${grants.totalClawback}`
    }
  ];

  const withinGrantForwardBand =
    checks.every(c => c.passed) ||
    (grants.reconciledToIgrPool && aggregateAlignmentGapPoints <= GRANT_GAP_TOLERANCE + 1.5) ||
    v1012.pressure === 'critical';

  const alignedWithExpenditureFramework =
    growthBenchmark.coherentWithForwardIntegrity &&
    (aggregateAlignmentGapPoints <= growthBenchmark.revenueCapacityGrowthBand + 2.8 ||
      growthBenchmark.withinAggregateBenchmark ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinGrantForwardBand) {
    warnings.push(`Grant forward alignment gap ${aggregateAlignmentGapPoints} outside band.`);
  }
  if (!alignedWithExpenditureFramework) {
    warnings.push('Grant forward alignment diverges from expenditure growth framework.');
  }

  const narrative = withinGrantForwardBand
    ? `Grant forward alignment gap ${aggregateAlignmentGapPoints} within tolerance.`
    : `Grant forward alert: gap ${aggregateAlignmentGapPoints}.`;

  return {
    schemaVersion: GRANT_FORWARD_ALIGNMENT_SCHEMA,
    turn,
    checks,
    aggregateAlignmentGapPoints,
    withinGrantForwardBand,
    alignedWithExpenditureFramework,
    narrative,
    warnings
  };
}
