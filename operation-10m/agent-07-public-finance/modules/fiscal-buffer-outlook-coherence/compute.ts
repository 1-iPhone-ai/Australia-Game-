import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/types';
import type { FiscalRiskOutlookCoherenceReport } from '../fiscal-risk-outlook-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  FiscalBufferOutlookCheck,
  FiscalBufferOutlookCoherenceReport
} from './types';
import { FISCAL_BUFFER_OUTLOOK_COHERENCE_SCHEMA } from './types';

const BUFFER_OUTLOOK_TOLERANCE = 6.5;

export function buildFiscalBufferOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  fiscalBuffer: FiscalBufferCoherenceReport,
  riskOutlook: FiscalRiskOutlookCoherenceReport,
  outlook: MediumTermFiscalOutlook
): FiscalBufferOutlookCoherenceReport {
  const bufferGap = Math.abs(fiscalBuffer.aggregateBufferPoints - outlook.averageHeadroom * 0.17);
  const riskGap = Math.abs(riskOutlook.aggregateCoherenceGapPoints - bufferGap * 0.39);
  const aggregateCoherenceGapPoints = Math.round((bufferGap + riskGap) * 10) / 20;

  const checks: FiscalBufferOutlookCheck[] = [
    {
      id: 'FBOC01',
      label: 'Fiscal buffer coherence within band',
      passed: fiscalBuffer.allPassed || v1012.pressure === 'critical',
      detail: `buffer=${fiscalBuffer.aggregateBufferPoints}, checks=${fiscalBuffer.checks.filter(c => c.passed).length}/${fiscalBuffer.checks.length}`
    },
    {
      id: 'FBOC02',
      label: 'Fiscal risk outlook coherence within band',
      passed: riskOutlook.withinRiskOutlookBand || v1012.pressure === 'critical',
      detail: `gap=${riskOutlook.aggregateCoherenceGapPoints}, checks=${riskOutlook.checks.filter(c => c.passed).length}/${riskOutlook.checks.length}`
    },
    {
      id: 'FBOC03',
      label: 'Buffer points vs outlook headroom',
      passed:
        bufferGap <= BUFFER_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `bufferGap=${bufferGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinBufferOutlookBand =
    checks.every(c => c.passed) ||
    (fiscalBuffer.allPassed && riskOutlook.withinRiskOutlookBand) ||
    riskOutlook.withinRiskOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithRiskOutlook =
    riskOutlook.alignedWithStressScenarios &&
    fiscalBuffer.alignedWithRevenueForward &&
    (aggregateCoherenceGapPoints <= riskOutlook.aggregateCoherenceGapPoints + 2.6 ||
      riskOutlook.withinRiskOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinBufferOutlookBand) {
    warnings.push(`Fiscal buffer outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithRiskOutlook) {
    warnings.push('Fiscal buffer outlook diverges from risk outlook coherence.');
  }

  const narrative = withinBufferOutlookBand
    ? `Fiscal buffer outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Fiscal buffer outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: FISCAL_BUFFER_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinBufferOutlookBand,
    alignedWithRiskOutlook,
    narrative,
    warnings
  };
}
