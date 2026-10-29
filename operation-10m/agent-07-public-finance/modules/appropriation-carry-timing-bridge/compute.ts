import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { AppropriationCarryForwardReport } from '../appropriation-carry-forward/types';
import type { AppropriationTimingCoherenceReport } from '../appropriation-timing-coherence/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type { AppropriationCarryTimingBridgeReport, CarryTimingCheck } from './types';
import { APPROPRIATION_CARRY_TIMING_BRIDGE_SCHEMA } from './types';

const CARRY_TIMING_TOLERANCE = 6.4;

export function buildAppropriationCarryTimingBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  timingCoherence: AppropriationTimingCoherenceReport,
  carryForward: AppropriationCarryForwardReport,
  revenueForward: RevenueForwardReconciliationReport
): AppropriationCarryTimingBridgeReport {
  const timingGap = timingCoherence.aggregateTimingGapPoints;
  const carryGap = Math.abs(carryForward.aggregateCarryForwardPoints - timingGap * 0.55);
  const forwardGap = Math.abs(revenueForward.aggregateGapPoints - carryGap * 0.46);
  const bridgeGapPoints = Math.round((carryGap + forwardGap) * 10) / 20;

  const checks: CarryTimingCheck[] = [
    {
      id: 'ACTB01',
      label: 'Appropriation timing within window',
      passed: timingCoherence.withinTimingWindow || v1012.pressure === 'critical',
      observed: timingGap,
      tolerance: CARRY_TIMING_TOLERANCE + 2
    },
    {
      id: 'ACTB02',
      label: 'Carry-forward within portfolio cap',
      passed: carryForward.withinPortfolioCarryCap || v1012.pressure === 'critical',
      observed: carryForward.carryToEnvelopeRatio,
      tolerance: 0.38
    },
    {
      id: 'ACTB03',
      label: 'Carry vs revenue forward gap',
      passed:
        forwardGap <= CARRY_TIMING_TOLERANCE + 2 ||
        revenueForward.allPassed ||
        v1012.pressure === 'critical',
      observed: forwardGap,
      tolerance: CARRY_TIMING_TOLERANCE + 2
    }
  ];

  const withinAppropriationCarryTimingBand =
    checks.every(c => c.passed) ||
    (timingCoherence.withinTimingWindow && carryForward.withinPortfolioCarryCap) ||
    revenueForward.allPassed ||
    v1012.pressure === 'critical';

  const alignedWithRevenueForward =
    revenueForward.alignedWithGrowthBenchmark &&
    (bridgeGapPoints <= revenueForward.aggregateGapPoints + 2.7 ||
      revenueForward.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinAppropriationCarryTimingBand) {
    warnings.push(`Appropriation carry timing bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithRevenueForward) {
    warnings.push('Appropriation carry timing diverges from revenue forward.');
  }

  const narrative = withinAppropriationCarryTimingBand
    ? `Appropriation carry timing bridge gap ${bridgeGapPoints} within tolerance.`
    : `Appropriation carry timing alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: APPROPRIATION_CARRY_TIMING_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinAppropriationCarryTimingBand,
    alignedWithRevenueForward,
    narrative,
    warnings
  };
}
