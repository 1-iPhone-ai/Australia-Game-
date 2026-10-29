import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { EfficiencyDividendRegisterReport } from '../efficiency-dividend-register/types';
import type { EfficiencyOffsetForwardCoherenceReport } from '../efficiency-offset-forward-coherence/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type {
  EfficiencyDividendForwardBridgeReport,
  EfficiencyDividendForwardCheck
} from './types';
import { EFFICIENCY_DIVIDEND_FORWARD_BRIDGE_SCHEMA } from './types';

const EFFICIENCY_FORWARD_TOLERANCE = 6.6;

export function buildEfficiencyDividendForwardBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  efficiencyRegister: EfficiencyDividendRegisterReport,
  offsetForward: EfficiencyOffsetForwardCoherenceReport,
  revenueForward: RevenueForwardReconciliationReport
): EfficiencyDividendForwardBridgeReport {
  const realizedGap = Math.abs(
    efficiencyRegister.aggregateRealizedPoints - offsetForward.aggregateCoherenceGapPoints * 0.34
  );
  const forwardGap = Math.abs(revenueForward.aggregateGapPoints - realizedGap * 0.39);
  const bridgeGapPoints = Math.round((realizedGap + forwardGap) * 10) / 20;

  const checks: EfficiencyDividendForwardCheck[] = [
    {
      id: 'EDFB01',
      label: 'Efficiency dividend within portfolio schedule',
      passed:
        efficiencyRegister.withinPortfolioSchedule ||
        efficiencyRegister.coherentWithSpendingOffsets ||
        v1012.pressure === 'critical',
      observed: efficiencyRegister.aggregateRealizedPoints,
      tolerance: efficiencyRegister.aggregateScheduledPoints + 2
    },
    {
      id: 'EDFB02',
      label: 'Efficiency offset forward coherence within band',
      passed: offsetForward.withinEfficiencyOffsetForwardBand || v1012.pressure === 'critical',
      observed: offsetForward.aggregateCoherenceGapPoints,
      tolerance: 8
    },
    {
      id: 'EDFB03',
      label: 'Realized efficiency vs revenue forward gap',
      passed:
        forwardGap <= EFFICIENCY_FORWARD_TOLERANCE + 2 ||
        revenueForward.allPassed ||
        v1012.pressure === 'critical',
      observed: forwardGap,
      tolerance: EFFICIENCY_FORWARD_TOLERANCE + 2
    }
  ];

  const withinEfficiencyDividendForwardBand =
    checks.every(c => c.passed) ||
    (efficiencyRegister.withinPortfolioSchedule && offsetForward.withinEfficiencyOffsetForwardBand) ||
    revenueForward.allPassed ||
    v1012.pressure === 'critical';

  const alignedWithOffsetForwardCoherence =
    offsetForward.alignedWithRevenueForward &&
    (bridgeGapPoints <= offsetForward.aggregateCoherenceGapPoints + 2.6 ||
      offsetForward.withinEfficiencyOffsetForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinEfficiencyDividendForwardBand) {
    warnings.push(`Efficiency dividend forward bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithOffsetForwardCoherence) {
    warnings.push('Efficiency dividend forward diverges from offset forward coherence.');
  }

  const narrative = withinEfficiencyDividendForwardBand
    ? `Efficiency dividend forward bridge gap ${bridgeGapPoints} within tolerance.`
    : `Efficiency dividend forward alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: EFFICIENCY_DIVIDEND_FORWARD_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinEfficiencyDividendForwardBand,
    alignedWithOffsetForwardCoherence,
    narrative,
    warnings
  };
}
