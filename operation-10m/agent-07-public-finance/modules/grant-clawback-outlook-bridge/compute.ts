import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { GrantClawbackScheduleReport } from '../grant-clawback-schedule/types';
import type { GrantClawbackForwardCoherenceReport } from '../grant-clawback-forward-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { GrantClawbackOutlookBridgeReport, GrantClawbackOutlookCheck } from './types';
import { GRANT_CLAWBACK_OUTLOOK_BRIDGE_SCHEMA } from './types';

const CLAWBACK_OUTLOOK_TOLERANCE = 6.3;

export function buildGrantClawbackOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  clawbackSchedule: GrantClawbackScheduleReport,
  clawbackForward: GrantClawbackForwardCoherenceReport,
  outlook: MediumTermFiscalOutlook
): GrantClawbackOutlookBridgeReport {
  const scheduleGap = Math.abs(
    clawbackSchedule.aggregateClawbackPoints - outlook.averageHeadroom * 0.21
  );
  const forwardGap = Math.abs(clawbackForward.aggregateClawbackGapPoints - scheduleGap * 0.38);
  const bridgeGapPoints = Math.round((scheduleGap + forwardGap) * 10) / 20;

  const checks: GrantClawbackOutlookCheck[] = [
    {
      id: 'GCOB01',
      label: 'Grant clawback schedule within tolerance',
      passed: clawbackSchedule.withinScheduleTolerance || v1012.pressure === 'critical',
      detail: `scheduled=${clawbackSchedule.aggregateScheduledPoints}, clawback=${clawbackSchedule.aggregateClawbackPoints}`
    },
    {
      id: 'GCOB02',
      label: 'Grant clawback forward coherence within band',
      passed: clawbackForward.withinClawbackForwardBand || v1012.pressure === 'critical',
      detail: `gap=${clawbackForward.aggregateClawbackGapPoints}, checks=${clawbackForward.checks.filter(c => c.passed).length}/${clawbackForward.checks.length}`
    },
    {
      id: 'GCOB03',
      label: 'Clawback schedule vs outlook headroom',
      passed:
        scheduleGap <= CLAWBACK_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `scheduleGap=${scheduleGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinGrantClawbackOutlookBand =
    checks.every(c => c.passed) ||
    (clawbackSchedule.withinScheduleTolerance && clawbackForward.withinClawbackForwardBand) ||
    clawbackForward.withinClawbackForwardBand ||
    v1012.pressure === 'critical';

  const alignedWithClawbackForward =
    clawbackForward.alignedWithGrantForward &&
    (bridgeGapPoints <= clawbackForward.aggregateClawbackGapPoints + 2.5 ||
      clawbackForward.withinClawbackForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinGrantClawbackOutlookBand) {
    warnings.push(`Grant clawback outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithClawbackForward) {
    warnings.push('Grant clawback outlook diverges from forward coherence.');
  }

  const narrative = withinGrantClawbackOutlookBand
    ? `Grant clawback outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Grant clawback outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: GRANT_CLAWBACK_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinGrantClawbackOutlookBand,
    alignedWithClawbackForward,
    narrative,
    warnings
  };
}
