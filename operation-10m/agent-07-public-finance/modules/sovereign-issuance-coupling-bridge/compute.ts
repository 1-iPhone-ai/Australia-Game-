import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtFiscalCouplingRegisterReport } from '../debt-fiscal-coupling-register/types';
import type { DebtServiceCoverageReport } from '../debt-service-coverage/types';
import type { SovereignIssuanceCalendar } from '../sovereign-issuance/types';
import type { IssuanceCouplingCheck, SovereignIssuanceCouplingBridgeReport } from './types';
import { SOVEREIGN_ISSUANCE_COUPLING_BRIDGE_SCHEMA } from './types';

const COUPLING_GAP_TOLERANCE = 5.9;

export function buildSovereignIssuanceCouplingBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  issuance: SovereignIssuanceCalendar,
  debtCoupling: DebtFiscalCouplingRegisterReport,
  debtService: DebtServiceCoverageReport
): SovereignIssuanceCouplingBridgeReport {
  const issuanceGap = Math.abs(issuance.totalIssued - issuance.totalScheduled * 0.88);
  const couplingGap = Math.abs(debtCoupling.couplingStressPoints - issuanceGap * 0.15);
  const serviceGap = Math.max(0, 1.05 - debtService.coverageRatio) * 10;
  const bridgeCouplingGapPoints =
    Math.round((issuanceGap + couplingGap + serviceGap) * 10) / 30;

  const checks: IssuanceCouplingCheck[] = [
    {
      id: 'SICB01',
      label: 'Issuance without liquidity shortfall',
      passed: !issuance.liquidityShortfall || !v1012.debtEnabled || v1012.pressure === 'critical',
      observed: issuance.totalIssued,
      tolerance: issuance.totalScheduled
    },
    {
      id: 'SICB02',
      label: 'Issuance schedule vs debt coupling stress',
      passed:
        couplingGap <= COUPLING_GAP_TOLERANCE + 2 ||
        debtCoupling.withinCouplingBand ||
        v1012.pressure === 'critical',
      observed: couplingGap,
      tolerance: COUPLING_GAP_TOLERANCE + 2
    },
    {
      id: 'SICB03',
      label: 'Coverage ratio supports issuance bridge',
      passed:
        debtService.withinCoverageFloor ||
        serviceGap <= COUPLING_GAP_TOLERANCE ||
        v1012.pressure === 'critical',
      observed: debtService.coverageRatio,
      tolerance: 1.05
    }
  ];

  const withinIssuanceCouplingBand =
    checks.every(c => c.passed) ||
    (!issuance.liquidityShortfall && debtCoupling.withinCouplingBand) ||
    v1012.pressure === 'critical';

  const alignedWithDebtService =
    debtService.runwayTurnsAligned &&
    (bridgeCouplingGapPoints <= debtService.coverageRatio + 2.2 ||
      debtService.withinCoverageFloor ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinIssuanceCouplingBand) {
    warnings.push(`Sovereign issuance coupling gap ${bridgeCouplingGapPoints}.`);
  }
  if (!alignedWithDebtService) {
    warnings.push('Issuance coupling bridge diverges from debt service coverage.');
  }

  const narrative = withinIssuanceCouplingBand
    ? `Sovereign issuance coupling gap ${bridgeCouplingGapPoints} within tolerance.`
    : `Issuance coupling alert: gap ${bridgeCouplingGapPoints}.`;

  return {
    schemaVersion: SOVEREIGN_ISSUANCE_COUPLING_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeCouplingGapPoints,
    withinIssuanceCouplingBand,
    alignedWithDebtService,
    narrative,
    warnings
  };
}
