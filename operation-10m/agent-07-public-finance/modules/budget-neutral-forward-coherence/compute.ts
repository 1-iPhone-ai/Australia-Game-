import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { BudgetNeutralPackagesReport } from '../budget-neutral-packages/types';
import type { ExpenditureGrowthBenchmarkReport } from '../expenditure-growth-benchmark/types';
import type { GrantForwardAlignmentReport } from '../grant-forward-alignment/types';
import type { BudgetNeutralForwardCoherenceReport, NeutralForwardCheck } from './types';
import { BUDGET_NEUTRAL_FORWARD_COHERENCE_SCHEMA } from './types';

const NEUTRAL_GAP_TOLERANCE = 5.1;

export function buildBudgetNeutralForwardCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  neutralPackages: BudgetNeutralPackagesReport,
  grantForward: GrantForwardAlignmentReport,
  growthBenchmark: ExpenditureGrowthBenchmarkReport
): BudgetNeutralForwardCoherenceReport {
  const netToGrantGap = Math.abs(neutralPackages.aggregateNetPoints - grantForward.aggregateAlignmentGapPoints * 0.25);
  const growthNeutralGap = Math.abs(
    neutralPackages.aggregateNewSpending * 0.12 - growthBenchmark.aggregateGrowthRate
  );
  const aggregateNeutralGapPoints =
    Math.round((netToGrantGap + growthNeutralGap) * 10) / 20;

  const checks: NeutralForwardCheck[] = [
    {
      id: 'BNFC01',
      label: 'Portfolio neutrality within band',
      passed: neutralPackages.withinPortfolioNeutrality || v1012.pressure === 'critical',
      observed: Math.abs(neutralPackages.aggregateNetPoints),
      tolerance: 2.5
    },
    {
      id: 'BNFC02',
      label: 'Neutral net vs grant forward gap',
      passed:
        netToGrantGap <= NEUTRAL_GAP_TOLERANCE + 1.8 ||
        grantForward.withinGrantForwardBand ||
        v1012.pressure === 'critical',
      observed: netToGrantGap,
      tolerance: NEUTRAL_GAP_TOLERANCE + 1.8
    },
    {
      id: 'BNFC03',
      label: 'New spending vs growth benchmark',
      passed:
        growthNeutralGap <= NEUTRAL_GAP_TOLERANCE + growthBenchmark.revenueCapacityGrowthBand ||
        growthBenchmark.withinAggregateBenchmark ||
        v1012.pressure === 'critical',
      observed: growthNeutralGap,
      tolerance: NEUTRAL_GAP_TOLERANCE + growthBenchmark.revenueCapacityGrowthBand
    }
  ];

  const withinNeutralForwardBand =
    checks.every(c => c.passed) ||
    (neutralPackages.withinPortfolioNeutrality && aggregateNeutralGapPoints <= NEUTRAL_GAP_TOLERANCE + 2) ||
    v1012.pressure === 'critical';

  const alignedWithGrantForward =
    grantForward.alignedWithExpenditureFramework &&
    (aggregateNeutralGapPoints <= grantForward.aggregateAlignmentGapPoints + 2.4 ||
      grantForward.withinGrantForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinNeutralForwardBand) {
    warnings.push(`Budget neutral forward gap ${aggregateNeutralGapPoints} outside band.`);
  }
  if (!alignedWithGrantForward) {
    warnings.push('Budget neutral forward diverges from grant forward alignment.');
  }

  const narrative = withinNeutralForwardBand
    ? `Budget neutral forward gap ${aggregateNeutralGapPoints} within tolerance.`
    : `Budget neutral forward alert: gap ${aggregateNeutralGapPoints}.`;

  return {
    schemaVersion: BUDGET_NEUTRAL_FORWARD_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateNeutralGapPoints,
    withinNeutralForwardBand,
    alignedWithGrantForward,
    narrative,
    warnings
  };
}
