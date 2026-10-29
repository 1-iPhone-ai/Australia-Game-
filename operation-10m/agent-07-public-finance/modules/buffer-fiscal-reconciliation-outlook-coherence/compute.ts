import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { GrantSovereignReconciliationOutlookBridgeReport } from '../grant-sovereign-reconciliation-outlook-bridge/types';
import type { BufferGrantReconciliationOutlookCoherenceReport } from '../buffer-grant-reconciliation-outlook-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  BufferFiscalReconciliationOutlookCheck,
  BufferFiscalReconciliationOutlookCoherenceReport
} from './types';
import { BUFFER_FISCAL_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA } from './types';

const BUFFER_FISCAL_RECONCILIATION_TOLERANCE = 7.5;

export function buildBufferFiscalReconciliationOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  grantSovereignReconciliation: GrantSovereignReconciliationOutlookBridgeReport,
  bufferGrantReconciliation: BufferGrantReconciliationOutlookCoherenceReport,
  outlook: MediumTermFiscalOutlook
): BufferFiscalReconciliationOutlookCoherenceReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const sovereignGap = Math.abs(
    grantSovereignReconciliation.bridgeGapPoints - outlookHeadroom * 0.15
  );
  const bufferGap = Math.abs(bufferGrantReconciliation.aggregateCoherenceGapPoints - sovereignGap * 0.42);
  const aggregateCoherenceGapPoints = Math.round((sovereignGap + bufferGap) * 10) / 20;

  const checks: BufferFiscalReconciliationOutlookCheck[] = [
    {
      id: 'BFROC01',
      label: 'Grant–sovereign reconciliation outlook bridge within band',
      passed:
        grantSovereignReconciliation.withinGrantSovereignReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      detail: `gap=${grantSovereignReconciliation.bridgeGapPoints}, checks=${grantSovereignReconciliation.checks.filter(c => c.passed).length}/${grantSovereignReconciliation.checks.length}`
    },
    {
      id: 'BFROC02',
      label: 'Buffer–grant reconciliation outlook coherence within band',
      passed:
        bufferGrantReconciliation.withinBufferGrantReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      detail: `gap=${bufferGrantReconciliation.aggregateCoherenceGapPoints}, checks=${bufferGrantReconciliation.checks.filter(c => c.passed).length}/${bufferGrantReconciliation.checks.length}`
    },
    {
      id: 'BFROC03',
      label: 'Grant sovereign gap vs buffer grant reconciliation outlook',
      passed:
        bufferGap <= BUFFER_FISCAL_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `bufferGap=${bufferGap}, headroom=${outlookHeadroom}`
    }
  ];

  const withinBufferFiscalReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (grantSovereignReconciliation.withinGrantSovereignReconciliationOutlookBand &&
      bufferGrantReconciliation.withinBufferGrantReconciliationOutlookBand) ||
    bufferGrantReconciliation.withinBufferGrantReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithGrantSovereignReconciliationBridge =
    grantSovereignReconciliation.alignedWithBufferGrantReconciliationCoherence &&
    bufferGrantReconciliation.alignedWithSovereignBufferReconciliationBridge &&
    (aggregateCoherenceGapPoints <= bufferGrantReconciliation.aggregateCoherenceGapPoints + 2.9 ||
      bufferGrantReconciliation.withinBufferGrantReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinBufferFiscalReconciliationOutlookBand) {
    warnings.push(`Buffer–fiscal reconciliation outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithGrantSovereignReconciliationBridge) {
    warnings.push('Buffer grant reconciliation outlook diverges from sovereign buffer bridge.');
  }

  const narrative = withinBufferFiscalReconciliationOutlookBand
    ? `Buffer–fiscal reconciliation outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Buffer–fiscal reconciliation outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: BUFFER_FISCAL_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinBufferFiscalReconciliationOutlookBand,
    alignedWithGrantSovereignReconciliationBridge,
    narrative,
    warnings
  };
}
