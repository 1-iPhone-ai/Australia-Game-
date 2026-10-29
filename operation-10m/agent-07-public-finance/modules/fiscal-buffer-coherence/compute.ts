import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { CashManagementReport } from '../cash-management/types';
import type { ContingencyDrawdownRegisterReport } from '../contingency-drawdown/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type { StatutoryBalancesReport } from '../statutory-balances/types';
import type { FiscalBufferCheck, FiscalBufferCoherenceReport } from './types';
import { FISCAL_BUFFER_COHERENCE_SCHEMA } from './types';

const BUFFER_TOLERANCE = 5.5;

export function buildFiscalBufferCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  statutoryBalances: StatutoryBalancesReport,
  cashManagement: CashManagementReport,
  contingencyDrawdown: ContingencyDrawdownRegisterReport,
  revenueForward: RevenueForwardReconciliationReport
): FiscalBufferCoherenceReport {
  const reserveBuffer =
    Math.round(
      (Math.max(0, statutoryBalances.netOperatingBalance) +
        Math.max(0, statutoryBalances.fiscalBalance) +
        cashManagement.aggregateClosingBalance) *
        10
    ) / 10;
  const contingencyBuffer = Math.round(contingencyDrawdown.closingFlexPoints * 10) / 10;
  const combinedBuffer =
    Math.round((reserveBuffer * 0.62 + contingencyBuffer * 0.38) * 10) / 10;
  const headroomTarget = Math.max(6, v1012.fiscalHeadroom + v1012.revenueCapacity * 0.08);
  const drawdownGap = Math.abs(combinedBuffer - headroomTarget);

  const checks: FiscalBufferCheck[] = [
    {
      id: 'FBC01',
      label: 'Statutory balances plus cash closing',
      passed:
        reserveBuffer >= headroomTarget * 0.55 ||
        cashManagement.withinDrawdownLimit ||
        statutoryBalances.allWithinSoftAnchors ||
        v1012.pressure === 'critical',
      observed: reserveBuffer,
      tolerance: headroomTarget * 0.55
    },
    {
      id: 'FBC02',
      label: 'Contingency flex capacity available',
      passed:
        contingencyBuffer >= 2 ||
        contingencyDrawdown.withinDrawdownCap ||
        v1012.pressure === 'critical',
      observed: contingencyBuffer,
      tolerance: 2
    },
    {
      id: 'FBC03',
      label: 'Combined buffer vs fiscal headroom',
      passed:
        combinedBuffer >= headroomTarget * 0.72 ||
        drawdownGap <= BUFFER_TOLERANCE + v1012.debtServiceLoad * 0.15 ||
        v1012.pressure === 'critical',
      observed: drawdownGap,
      tolerance: BUFFER_TOLERANCE + v1012.debtServiceLoad * 0.15
    }
  ];

  const aggregateBufferPoints = Math.round(combinedBuffer * 10) / 10;
  const allPassed = checks.every(c => c.passed);

  const alignedWithRevenueForward =
    revenueForward.alignedWithGrowthBenchmark &&
    (aggregateBufferPoints >= revenueForward.aggregateGapPoints * 0.4 ||
      revenueForward.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!allPassed) {
    warnings.push(`Fiscal buffer gap ${drawdownGap} vs headroom target ${headroomTarget}.`);
  }
  if (!alignedWithRevenueForward) {
    warnings.push('Fiscal buffer coherence diverges from revenue forward reconciliation.');
  }

  const narrative = allPassed
    ? `Fiscal buffer ${aggregateBufferPoints} coherent across reserves and contingency.`
    : `Fiscal buffer alert: combined ${aggregateBufferPoints}, gap ${drawdownGap}.`;

  return {
    schemaVersion: FISCAL_BUFFER_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateBufferPoints,
    allPassed,
    alignedWithRevenueForward,
    narrative,
    warnings
  };
}
