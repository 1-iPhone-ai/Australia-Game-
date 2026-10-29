import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtServiceCoverageReport } from '../debt-service-coverage/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type {
  DebtServiceForwardCheck,
  DebtServiceForwardCoherenceReport
} from './types';
import { DEBT_SERVICE_FORWARD_COHERENCE_SCHEMA } from './types';

const DEBT_FORWARD_TOLERANCE = 6.3;

export function buildDebtServiceForwardCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  debtCoverage: DebtServiceCoverageReport,
  revenueForward: RevenueForwardReconciliationReport,
  outlook: MediumTermFiscalOutlook
): DebtServiceForwardCoherenceReport {
  const outlookDebtLoad =
    outlook.projections[0]?.debtServiceLoad ?? v1012.debtServiceLoad;
  const coverageGap = Math.abs(debtCoverage.coverageRatio - outlookDebtLoad * 0.22);
  const forwardGap = Math.abs(revenueForward.aggregateGapPoints - coverageGap * 0.48);
  const aggregateCoherenceGapPoints = Math.round((coverageGap + forwardGap) * 10) / 20;

  const checks: DebtServiceForwardCheck[] = [
    {
      id: 'DSFC01',
      label: 'Debt service within coverage floor',
      passed: debtCoverage.withinCoverageFloor || v1012.pressure === 'critical',
      detail: `ratio=${debtCoverage.coverageRatio}, band=${debtCoverage.coverageBand}`
    },
    {
      id: 'DSFC02',
      label: 'Revenue forward reconciliation passes',
      passed: revenueForward.allPassed || v1012.pressure === 'critical',
      detail: `gap=${revenueForward.aggregateGapPoints}, aligned=${revenueForward.alignedWithGrowthBenchmark}`
    },
    {
      id: 'DSFC03',
      label: 'Coverage vs outlook debt load',
      passed:
        coverageGap <= DEBT_FORWARD_TOLERANCE + 2 ||
        debtCoverage.runwayTurnsAligned ||
        v1012.pressure === 'critical',
      detail: `coverageGap=${coverageGap}, outlookLoad=${outlookDebtLoad}`
    }
  ];

  const withinDebtServiceForwardBand =
    checks.every(c => c.passed) ||
    (debtCoverage.withinCoverageFloor && revenueForward.allPassed) ||
    revenueForward.allPassed ||
    v1012.pressure === 'critical';

  const alignedWithForwardReconciliation =
    revenueForward.alignedWithGrowthBenchmark &&
    (aggregateCoherenceGapPoints <= revenueForward.aggregateGapPoints + 2.8 ||
      revenueForward.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinDebtServiceForwardBand) {
    warnings.push(`Debt service forward gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithForwardReconciliation) {
    warnings.push('Debt service forward diverges from revenue reconciliation.');
  }

  const narrative = withinDebtServiceForwardBand
    ? `Debt service forward gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Debt service forward alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: DEBT_SERVICE_FORWARD_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinDebtServiceForwardBand,
    alignedWithForwardReconciliation,
    narrative,
    warnings
  };
}
