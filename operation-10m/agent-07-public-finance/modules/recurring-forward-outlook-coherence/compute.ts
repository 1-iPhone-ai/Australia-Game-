import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { RecurringCommitmentsSchedule } from '../recurring-commitments/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type {
  RecurringForwardCheck,
  RecurringForwardOutlookCoherenceReport
} from './types';
import { RECURRING_FORWARD_OUTLOOK_COHERENCE_SCHEMA } from './types';

const RECURRING_FORWARD_TOLERANCE = 6.2;

export function buildRecurringForwardOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  recurring: RecurringCommitmentsSchedule,
  revenueForward: RevenueForwardReconciliationReport,
  outlook: MediumTermFiscalOutlook
): RecurringForwardOutlookCoherenceReport {
  const loadGap = Math.abs(recurring.totalLoadThisTurn - revenueForward.aggregateGapPoints * 0.09);
  const outlookGap = Math.abs(outlook.averageHeadroom - v1012.fiscalHeadroom + recurring.mandatoryLoad * 0.04);
  const aggregateCoherenceGapPoints = Math.round((loadGap + outlookGap) * 10) / 20;

  const checks: RecurringForwardCheck[] = [
    {
      id: 'RFOC01',
      label: 'Recurring load overlaps envelope',
      passed: recurring.overlapsEnvelopeCommitted || revenueForward.allPassed || v1012.pressure === 'critical',
      detail: `total=${recurring.totalLoadThisTurn}, mandatory=${recurring.mandatoryLoad}`
    },
    {
      id: 'RFOC02',
      label: 'Revenue forward reconciliation passes',
      passed: revenueForward.allPassed || v1012.pressure === 'critical',
      detail: `gap=${revenueForward.aggregateGapPoints}, aligned=${revenueForward.alignedWithGrowthBenchmark}`
    },
    {
      id: 'RFOC03',
      label: 'Recurring load vs forward gap',
      passed:
        loadGap <= RECURRING_FORWARD_TOLERANCE + 2 ||
        revenueForward.allPassed ||
        v1012.pressure === 'critical',
      detail: `loadGap=${loadGap}, forward=${revenueForward.aggregateGapPoints}`
    }
  ];

  const withinRecurringForwardBand =
    checks.every(c => c.passed) ||
    (recurring.overlapsEnvelopeCommitted && revenueForward.allPassed) ||
    revenueForward.allPassed ||
    v1012.pressure === 'critical';

  const alignedWithOutlookTrajectory =
    (outlook.trajectoryBand === 'strong' || outlook.trajectoryBand === 'healthy' || outlook.trajectoryBand === 'mixed') &&
    (aggregateCoherenceGapPoints <= Math.abs(outlook.averageHeadroom - v1012.fiscalHeadroom) + 2.5 ||
      outlook.worstPressure !== 'critical' ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinRecurringForwardBand) {
    warnings.push(`Recurring forward outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithOutlookTrajectory) {
    warnings.push('Recurring forward diverges from outlook trajectory.');
  }

  const narrative = withinRecurringForwardBand
    ? `Recurring forward outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Recurring forward outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: RECURRING_FORWARD_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinRecurringForwardBand,
    alignedWithOutlookTrajectory,
    narrative,
    warnings
  };
}
