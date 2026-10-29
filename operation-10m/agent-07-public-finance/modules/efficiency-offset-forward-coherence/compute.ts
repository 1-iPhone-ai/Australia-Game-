import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { EfficiencyDividendRegisterReport } from '../efficiency-dividend-register/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type { SpendingOffsetsReport } from '../spending-offsets/types';
import type {
  EfficiencyOffsetForwardCheck,
  EfficiencyOffsetForwardCoherenceReport
} from './types';
import { EFFICIENCY_OFFSET_FORWARD_COHERENCE_SCHEMA } from './types';

const OFFSET_FORWARD_TOLERANCE = 5.6;

export function buildEfficiencyOffsetForwardCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  efficiencyRegister: EfficiencyDividendRegisterReport,
  spendingOffsets: SpendingOffsetsReport,
  revenueForward: RevenueForwardReconciliationReport
): EfficiencyOffsetForwardCoherenceReport {
  const realizationGap = Math.abs(
    efficiencyRegister.aggregateRealizedPoints - spendingOffsets.aggregateOffsets * 0.42
  );
  const forwardGap = Math.abs(revenueForward.aggregateGapPoints - realizationGap * 0.55);
  const scheduleGap = Math.abs(
    efficiencyRegister.scheduleToRealizationRatio - spendingOffsets.portfolioCoverageRatio
  );
  const aggregateCoherenceGapPoints = Math.round((realizationGap + forwardGap + scheduleGap) * 10) / 30;

  const checks: EfficiencyOffsetForwardCheck[] = [
    {
      id: 'EOFC01',
      label: 'Efficiency realization within portfolio schedule',
      passed: efficiencyRegister.withinPortfolioSchedule || v1012.pressure === 'critical',
      detail: `ratio=${efficiencyRegister.scheduleToRealizationRatio}, realized=${efficiencyRegister.aggregateRealizedPoints}`
    },
    {
      id: 'EOFC02',
      label: 'Offsets cover new spending envelope',
      passed:
        spendingOffsets.withinPortfolioTarget ||
        spendingOffsets.portfolioCoverageRatio >= 0.85 ||
        v1012.pressure === 'critical',
      detail: `coverage=${spendingOffsets.portfolioCoverageRatio}, offsets=${spendingOffsets.aggregateOffsets}`
    },
    {
      id: 'EOFC03',
      label: 'Realization gap vs revenue forward',
      passed:
        forwardGap <= OFFSET_FORWARD_TOLERANCE + 2 ||
        revenueForward.allPassed ||
        v1012.pressure === 'critical',
      detail: `forwardGap=${revenueForward.aggregateGapPoints}, realizationGap=${realizationGap}`
    }
  ];

  const withinEfficiencyOffsetForwardBand =
    checks.every(c => c.passed) ||
    (efficiencyRegister.coherentWithSpendingOffsets && revenueForward.allPassed) ||
    v1012.pressure === 'critical';

  const alignedWithRevenueForward =
    revenueForward.alignedWithGrowthBenchmark &&
    (aggregateCoherenceGapPoints <= revenueForward.aggregateGapPoints + 2.1 ||
      revenueForward.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinEfficiencyOffsetForwardBand) {
    warnings.push(`Efficiency offset forward gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithRevenueForward) {
    warnings.push('Efficiency offset forward diverges from revenue forward.');
  }

  const narrative = withinEfficiencyOffsetForwardBand
    ? `Efficiency offset forward gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Efficiency offset forward alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: EFFICIENCY_OFFSET_FORWARD_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinEfficiencyOffsetForwardBand,
    alignedWithRevenueForward,
    narrative,
    warnings
  };
}
