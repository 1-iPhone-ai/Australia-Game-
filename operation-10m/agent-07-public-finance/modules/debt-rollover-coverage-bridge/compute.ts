import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtRolloverPlan } from '../debt-rollover/types';
import type { DebtServiceCoverageReport } from '../debt-service-coverage/types';
import type { SovereignIssuanceCouplingBridgeReport } from '../sovereign-issuance-coupling-bridge/types';
import type { DebtRolloverCoverageBridgeReport, RolloverCoverageCheck } from './types';
import { DEBT_ROLLOVER_COVERAGE_BRIDGE_SCHEMA } from './types';

const COVERAGE_TOLERANCE = 6.1;

export function buildDebtRolloverCoverageBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  debtRollover: DebtRolloverPlan,
  debtService: DebtServiceCoverageReport,
  issuanceCoupling: SovereignIssuanceCouplingBridgeReport
): DebtRolloverCoverageBridgeReport {
  const rolloverEvents = debtRollover.events.filter(e => e.outcome !== 'not_due').length;
  const serviceGap = Math.max(0, debtServiceCoverageRatioGap(debtService) - rolloverEvents * 0.35);
  const couplingGap = Math.abs(issuanceCoupling.bridgeCouplingGapPoints - serviceGap * 0.48);
  const bridgeGapPoints = Math.round((serviceGap + couplingGap) * 10) / 20;

  const checks: RolloverCoverageCheck[] = [
    {
      id: 'DRCB01',
      label: 'Rollover liquidity within tolerance',
      passed:
        !debtRollover.liquidityStress ||
        !v1012.debtEnabled ||
        v1012.pressure === 'critical',
      observed: rolloverEvents,
      tolerance: 4
    },
    {
      id: 'DRCB02',
      label: 'Debt service coverage adequate',
      passed:
        debtService.withinCoverageFloor ||
        debtService.coverageRatio >= 1.05 ||
        v1012.pressure === 'critical',
      observed: debtService.coverageRatio,
      tolerance: 1.05
    },
    {
      id: 'DRCB03',
      label: 'Service gap vs issuance coupling',
      passed:
        couplingGap <= COVERAGE_TOLERANCE + 2 ||
        issuanceCoupling.withinIssuanceCouplingBand ||
        v1012.pressure === 'critical',
      observed: couplingGap,
      tolerance: COVERAGE_TOLERANCE + 2
    }
  ];

  const withinRolloverCoverageBand =
    checks.every(c => c.passed) ||
    (!debtRollover.liquidityStress && debtService.withinCoverageFloor) ||
    v1012.pressure === 'critical';

  const alignedWithIssuanceCoupling =
    issuanceCoupling.alignedWithDebtService &&
    (bridgeGapPoints <= issuanceCoupling.bridgeCouplingGapPoints + 2.6 ||
      issuanceCoupling.withinIssuanceCouplingBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinRolloverCoverageBand) {
    warnings.push(`Debt rollover coverage bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithIssuanceCoupling) {
    warnings.push('Rollover coverage diverges from issuance coupling.');
  }

  const narrative = withinRolloverCoverageBand
    ? `Debt rollover coverage bridge gap ${bridgeGapPoints} within tolerance.`
    : `Debt rollover coverage alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: DEBT_ROLLOVER_COVERAGE_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinRolloverCoverageBand,
    alignedWithIssuanceCoupling,
    narrative,
    warnings
  };
}

function debtServiceCoverageRatioGap(debtService: DebtServiceCoverageReport): number {
  return Math.max(0, 1.35 - debtService.coverageRatio) * 10;
}
