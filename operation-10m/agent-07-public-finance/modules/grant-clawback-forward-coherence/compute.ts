import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { GrantClawbackScheduleReport } from '../grant-clawback-schedule/types';
import type { GrantForwardAlignmentReport } from '../grant-forward-alignment/types';
import type { IntergovernmentalGrantsReport } from '../intergovernmental-grants/types';
import type { ClawbackForwardCheck, GrantClawbackForwardCoherenceReport } from './types';
import { GRANT_CLAWBACK_FORWARD_COHERENCE_SCHEMA } from './types';

const CLAWBACK_GAP_TOLERANCE = 5.4;

export function buildGrantClawbackForwardCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  clawbackSchedule: GrantClawbackScheduleReport,
  grantForward: GrantForwardAlignmentReport,
  igGrants: IntergovernmentalGrantsReport
): GrantClawbackForwardCoherenceReport {
  const forwardGap = Math.abs(
    clawbackSchedule.aggregateClawbackPoints - grantForward.aggregateAlignmentGapPoints * 0.32
  );
  const poolGap = Math.abs(clawbackSchedule.aggregateScheduledPoints - igGrants.totalClawback * 0.85);
  const aggregateClawbackGapPoints =
    Math.round((forwardGap + poolGap) * 10) / 20;

  const checks: ClawbackForwardCheck[] = [
    {
      id: 'GCFC01',
      label: 'Clawback schedule within tolerance',
      passed: clawbackSchedule.withinScheduleTolerance || v1012.pressure === 'critical',
      detail: `ratio=${clawbackSchedule.scheduleToClawbackRatio}, scheduled=${clawbackSchedule.aggregateScheduledPoints}`
    },
    {
      id: 'GCFC02',
      label: 'Clawback vs grant forward alignment gap',
      passed:
        forwardGap <= CLAWBACK_GAP_TOLERANCE + 2 ||
        grantForward.withinGrantForwardBand ||
        v1012.pressure === 'critical',
      detail: `forwardGap=${grantForward.aggregateAlignmentGapPoints}, clawback=${clawbackSchedule.aggregateClawbackPoints}`
    },
    {
      id: 'GCFC03',
      label: 'Scheduled clawback vs IGR pool',
      passed:
        poolGap <= CLAWBACK_GAP_TOLERANCE + 1.5 ||
        clawbackSchedule.alignedWithIgrPool ||
        v1012.pressure === 'critical',
      detail: `poolClawback=${igGrants.totalClawback}, scheduled=${clawbackSchedule.aggregateScheduledPoints}`
    }
  ];

  const withinClawbackForwardBand =
    checks.every(c => c.passed) ||
    (clawbackSchedule.withinScheduleTolerance && aggregateClawbackGapPoints <= CLAWBACK_GAP_TOLERANCE + 1) ||
    v1012.pressure === 'critical';

  const alignedWithGrantForward =
    grantForward.alignedWithExpenditureFramework &&
    (aggregateClawbackGapPoints <= grantForward.aggregateAlignmentGapPoints + 2.3 ||
      grantForward.withinGrantForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinClawbackForwardBand) {
    warnings.push(`Grant clawback forward gap ${aggregateClawbackGapPoints}.`);
  }
  if (!alignedWithGrantForward) {
    warnings.push('Grant clawback forward diverges from grant forward alignment.');
  }

  const narrative = withinClawbackForwardBand
    ? `Grant clawback forward gap ${aggregateClawbackGapPoints} within tolerance.`
    : `Grant clawback forward alert: gap ${aggregateClawbackGapPoints}.`;

  return {
    schemaVersion: GRANT_CLAWBACK_FORWARD_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateClawbackGapPoints,
    withinClawbackForwardBand,
    alignedWithGrantForward,
    narrative,
    warnings
  };
}
