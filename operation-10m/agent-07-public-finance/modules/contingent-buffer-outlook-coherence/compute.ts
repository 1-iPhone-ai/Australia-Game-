import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ContingentLiabilityOutlookCoherenceReport } from '../contingent-liability-outlook-coherence/types';
import type { FiscalBufferOutlookCoherenceReport } from '../fiscal-buffer-outlook-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  ContingentBufferOutlookCheck,
  ContingentBufferOutlookCoherenceReport
} from './types';
import { CONTINGENT_BUFFER_OUTLOOK_COHERENCE_SCHEMA } from './types';

const CONTINGENT_BUFFER_TOLERANCE = 6.7;

export function buildContingentBufferOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  contingentOutlook: ContingentLiabilityOutlookCoherenceReport,
  bufferOutlook: FiscalBufferOutlookCoherenceReport,
  outlook: MediumTermFiscalOutlook
): ContingentBufferOutlookCoherenceReport {
  const contingentGap = Math.abs(
    contingentOutlook.aggregateCoherenceGapPoints - outlook.averageHeadroom * 0.16
  );
  const bufferGap = Math.abs(bufferOutlook.aggregateCoherenceGapPoints - contingentGap * 0.38);
  const aggregateCoherenceGapPoints = Math.round((contingentGap + bufferGap) * 10) / 20;

  const checks: ContingentBufferOutlookCheck[] = [
    {
      id: 'CBOC01',
      label: 'Contingent liability outlook coherence within band',
      passed: contingentOutlook.withinContingentOutlookBand || v1012.pressure === 'critical',
      detail: `gap=${contingentOutlook.aggregateCoherenceGapPoints}, checks=${contingentOutlook.checks.filter(c => c.passed).length}/${contingentOutlook.checks.length}`
    },
    {
      id: 'CBOC02',
      label: 'Fiscal buffer outlook coherence within band',
      passed: bufferOutlook.withinBufferOutlookBand || v1012.pressure === 'critical',
      detail: `gap=${bufferOutlook.aggregateCoherenceGapPoints}, checks=${bufferOutlook.checks.filter(c => c.passed).length}/${bufferOutlook.checks.length}`
    },
    {
      id: 'CBOC03',
      label: 'Contingent gap vs buffer outlook headroom',
      passed:
        bufferGap <= CONTINGENT_BUFFER_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `bufferGap=${bufferGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinContingentBufferOutlookBand =
    checks.every(c => c.passed) ||
    (contingentOutlook.withinContingentOutlookBand && bufferOutlook.withinBufferOutlookBand) ||
    bufferOutlook.withinBufferOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithBufferOutlook =
    bufferOutlook.alignedWithRiskOutlook &&
    contingentOutlook.alignedWithContingentForwardBridge &&
    (aggregateCoherenceGapPoints <= bufferOutlook.aggregateCoherenceGapPoints + 2.5 ||
      bufferOutlook.withinBufferOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinContingentBufferOutlookBand) {
    warnings.push(`Contingent–buffer outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithBufferOutlook) {
    warnings.push('Contingent buffer outlook diverges from fiscal buffer outlook coherence.');
  }

  const narrative = withinContingentBufferOutlookBand
    ? `Contingent–buffer outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Contingent–buffer outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: CONTINGENT_BUFFER_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinContingentBufferOutlookBand,
    alignedWithBufferOutlook,
    narrative,
    warnings
  };
}
