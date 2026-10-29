import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtRolloverCoverageBridgeReport } from '../debt-rollover-coverage-bridge/types';
import type { DebtServiceCoverageReport } from '../debt-service-coverage/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { DebtRolloverOutlookBridgeReport, DebtRolloverOutlookCheck } from './types';
import { DEBT_ROLLOVER_OUTLOOK_BRIDGE_SCHEMA } from './types';

const ROLLOVER_OUTLOOK_TOLERANCE = 6.2;

export function buildDebtRolloverOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  rolloverCoverage: DebtRolloverCoverageBridgeReport,
  debtService: DebtServiceCoverageReport,
  outlook: MediumTermFiscalOutlook
): DebtRolloverOutlookBridgeReport {
  const outlookDebt = outlook.projections[0]?.debtServiceLoad ?? v1012.debtServiceLoad;
  const serviceGap = Math.abs(debtService.coverageRatio - outlookDebt * 0.24);
  const rolloverGap = Math.abs(rolloverCoverage.bridgeGapPoints - serviceGap * 0.46);
  const bridgeGapPoints = Math.round((serviceGap + rolloverGap) * 10) / 20;

  const checks: DebtRolloverOutlookCheck[] = [
    {
      id: 'DROB01',
      label: 'Rollover coverage bridge within band',
      passed: rolloverCoverage.withinRolloverCoverageBand || v1012.pressure === 'critical',
      observed: rolloverCoverage.bridgeGapPoints,
      tolerance: 8
    },
    {
      id: 'DROB02',
      label: 'Debt service within coverage floor',
      passed: debtService.withinCoverageFloor || !v1012.debtEnabled || v1012.pressure === 'critical',
      observed: debtService.coverageRatio,
      tolerance: 1.35
    },
    {
      id: 'DROB03',
      label: 'Service coverage vs outlook debt load',
      passed:
        serviceGap <= ROLLOVER_OUTLOOK_TOLERANCE + 2 ||
        debtService.runwayTurnsAligned ||
        v1012.pressure === 'critical',
      observed: serviceGap,
      tolerance: ROLLOVER_OUTLOOK_TOLERANCE + 2
    }
  ];

  const withinDebtRolloverOutlookBand =
    checks.every(c => c.passed) ||
    (rolloverCoverage.withinRolloverCoverageBand && debtService.withinCoverageFloor) ||
    rolloverCoverage.withinRolloverCoverageBand ||
    v1012.pressure === 'critical';

  const alignedWithRolloverCoverage =
    rolloverCoverage.alignedWithIssuanceCoupling &&
    (bridgeGapPoints <= rolloverCoverage.bridgeGapPoints + 2.4 ||
      rolloverCoverage.withinRolloverCoverageBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinDebtRolloverOutlookBand) {
    warnings.push(`Debt rollover outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithRolloverCoverage) {
    warnings.push('Debt rollover outlook diverges from coverage bridge.');
  }

  const narrative = withinDebtRolloverOutlookBand
    ? `Debt rollover outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Debt rollover outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: DEBT_ROLLOVER_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinDebtRolloverOutlookBand,
    alignedWithRolloverCoverage,
    narrative,
    warnings
  };
}
