import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { IntergovernmentalGrantsReport } from '../intergovernmental-grants/types';
import type { GrantClawbackScheduleReport, GrantClawbackTranche } from './types';
import { GRANT_CLAWBACK_SCHEDULE_SCHEMA } from './types';

const SCHEDULE_RATIO_CAP = 0.58;

export function buildGrantClawbackScheduleReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  igGrants: IntergovernmentalGrantsReport
): GrantClawbackScheduleReport {
  const performanceScale = igGrants.performancePassRate >= 0.55 ? 0.85 : igGrants.performancePassRate >= 0.4 ? 1 : 1.18;

  const tranches: GrantClawbackTranche[] = igGrants.allocations.map((row, idx) => {
    const scheduledPoints = Math.round(row.clawbackPoints * 0.92 * performanceScale * 10) / 10;
    const performanceGatePassed = row.performanceGateMet || v1012.pressure === 'critical';
    const withinScheduleBand = scheduledPoints <= row.federalPoints * 0.25 + 0.2;
    return {
      id: `gcs_${idx}_${row.programId}`,
      grantProgramId: row.programId,
      label: row.label,
      scheduledPoints,
      performanceGatePassed,
      withinScheduleBand
    };
  });

  let aggregateScheduledPoints = Math.round(tranches.reduce((s, t) => s + t.scheduledPoints, 0) * 10) / 10;
  const aggregateClawbackPoints = igGrants.totalClawback;

  if (v1012.pressure !== 'critical' && aggregateClawbackPoints > 0 && aggregateScheduledPoints / aggregateClawbackPoints > SCHEDULE_RATIO_CAP) {
    const scale = (SCHEDULE_RATIO_CAP * aggregateClawbackPoints) / Math.max(0.1, aggregateScheduledPoints);
    for (const t of tranches) {
      t.scheduledPoints = Math.round(t.scheduledPoints * scale * 10) / 10;
    }
    aggregateScheduledPoints = Math.round(tranches.reduce((s, t) => s + t.scheduledPoints, 0) * 10) / 10;
  }

  const scheduleToClawbackRatio =
    aggregateClawbackPoints <= 0
      ? 0
      : Math.round((aggregateScheduledPoints / aggregateClawbackPoints) * 1000) / 1000;

  const withinScheduleTolerance =
    scheduleToClawbackRatio <= SCHEDULE_RATIO_CAP ||
    aggregateClawbackPoints <= 0 ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && scheduleToClawbackRatio <= SCHEDULE_RATIO_CAP * 1.1);

  const alignedWithIgrPool =
    Math.abs(aggregateScheduledPoints - aggregateClawbackPoints * 0.42) <= 3.5 ||
    igGrants.reconciledToIgrPool ||
    v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinScheduleTolerance) {
    warnings.push(`Schedule/clawback ratio ${scheduleToClawbackRatio} exceeds ${SCHEDULE_RATIO_CAP}.`);
  }
  if (!alignedWithIgrPool) {
    warnings.push(`Scheduled ${aggregateScheduledPoints} misaligned with clawback pool ${aggregateClawbackPoints}.`);
  }

  const narrative = withinScheduleTolerance
    ? `Grant clawback schedule: ${aggregateScheduledPoints} scheduled vs ${aggregateClawbackPoints} clawback pool.`
    : `Clawback schedule alert: ratio ${scheduleToClawbackRatio}.`;

  return {
    schemaVersion: GRANT_CLAWBACK_SCHEDULE_SCHEMA,
    turn,
    tranches,
    aggregateScheduledPoints,
    aggregateClawbackPoints,
    scheduleToClawbackRatio,
    withinScheduleTolerance,
    alignedWithIgrPool,
    narrative,
    warnings
  };
}
