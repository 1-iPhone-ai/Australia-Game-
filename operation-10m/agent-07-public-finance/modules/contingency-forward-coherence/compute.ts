import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ContingencyDrawdownRegisterReport } from '../contingency-drawdown/types';
import type { ForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/types';
import type { FiscalBufferCoherenceReport } from '../fiscal-buffer-coherence/types';
import type { ContingencyForwardCheck, ContingencyForwardCoherenceReport } from './types';
import { CONTINGENCY_FORWARD_COHERENCE_SCHEMA } from './types';

const FORWARD_TOLERANCE = 5.9;

export function buildContingencyForwardCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  contingency: ContingencyDrawdownRegisterReport,
  forwardIntegrity: ForwardEstimatesIntegrityReport,
  fiscalBuffer: FiscalBufferCoherenceReport
): ContingencyForwardCoherenceReport {
  const drawdownGap = Math.abs(
    contingency.aggregateDrawdownPoints - forwardIntegrity.aggregateRevisionGap * 0.11
  );
  const bufferGap = Math.abs(fiscalBuffer.aggregateBufferPoints - drawdownGap * 0.38);
  const aggregateCoherenceGapPoints = Math.round((drawdownGap + bufferGap) * 10) / 20;

  const checks: ContingencyForwardCheck[] = [
    {
      id: 'CFWC01',
      label: 'Contingency drawdown within cap',
      passed: contingency.withinDrawdownCap || v1012.pressure === 'critical',
      detail: `ratio=${contingency.drawdownToOpeningRatio}, draw=${contingency.aggregateDrawdownPoints}`
    },
    {
      id: 'CFWC02',
      label: 'Forward estimates integrity holds',
      passed:
        forwardIntegrity.allPassed ||
        drawdownGap <= FORWARD_TOLERANCE + 2 ||
        v1012.pressure === 'critical',
      detail: `revisionGap=${forwardIntegrity.aggregateRevisionGap}, drawdown=${contingency.aggregateDrawdownPoints}`
    },
    {
      id: 'CFWC03',
      label: 'Drawdown gap vs fiscal buffer',
      passed:
        bufferGap <= FORWARD_TOLERANCE + 1.8 ||
        fiscalBuffer.allPassed ||
        v1012.pressure === 'critical',
      detail: `buffer=${fiscalBuffer.aggregateBufferPoints}, gap=${drawdownGap}`
    }
  ];

  const withinContingencyForwardBand =
    checks.every(c => c.passed) ||
    (contingency.withinDrawdownCap && forwardIntegrity.allPassed) ||
    v1012.pressure === 'critical';

  const alignedWithFiscalBuffer =
    fiscalBuffer.alignedWithRevenueForward &&
    (aggregateCoherenceGapPoints <= fiscalBuffer.aggregateBufferPoints * 0.15 + 2.5 ||
      fiscalBuffer.allPassed ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinContingencyForwardBand) {
    warnings.push(`Contingency forward gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithFiscalBuffer) {
    warnings.push('Contingency forward diverges from fiscal buffer.');
  }

  const narrative = withinContingencyForwardBand
    ? `Contingency forward gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Contingency forward alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: CONTINGENCY_FORWARD_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinContingencyForwardBand,
    alignedWithFiscalBuffer,
    narrative,
    warnings
  };
}
