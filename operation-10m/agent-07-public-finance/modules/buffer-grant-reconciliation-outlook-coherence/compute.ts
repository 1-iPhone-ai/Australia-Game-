import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalSovereignReconciliationOutlookBridgeReport } from '../fiscal-sovereign-reconciliation-outlook-bridge/types';
import type { FiscalBufferReconciliationOutlookBridgeReport } from '../fiscal-buffer-reconciliation-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  BufferGrantReconciliationOutlookCheck,
  BufferGrantReconciliationOutlookCoherenceReport
} from './types';
import { BUFFER_GRANT_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA } from './types';

const BUFFER_GRANT_RECONCILIATION_TOLERANCE = 7.5;

export function buildBufferGrantReconciliationOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  fiscalSovereignReconciliation: FiscalSovereignReconciliationOutlookBridgeReport,
  fiscalBufferReconciliation: FiscalBufferReconciliationOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): BufferGrantReconciliationOutlookCoherenceReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const sovereignGap = Math.abs(
    fiscalSovereignReconciliation.bridgeGapPoints - outlookHeadroom * 0.15
  );
  const bufferGap = Math.abs(fiscalBufferReconciliation.bridgeGapPoints - sovereignGap * 0.42);
  const aggregateCoherenceGapPoints = Math.round((sovereignGap + bufferGap) * 10) / 20;

  const checks: BufferGrantReconciliationOutlookCheck[] = [
    {
      id: 'BGROC01',
      label: 'Fiscal–sovereign reconciliation outlook bridge within band',
      passed:
        fiscalSovereignReconciliation.withinFiscalSovereignReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      detail: `gap=${fiscalSovereignReconciliation.bridgeGapPoints}, checks=${fiscalSovereignReconciliation.checks.filter(c => c.passed).length}/${fiscalSovereignReconciliation.checks.length}`
    },
    {
      id: 'BGROC02',
      label: 'Fiscal buffer reconciliation outlook bridge within band',
      passed:
        fiscalBufferReconciliation.withinFiscalBufferReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      detail: `gap=${fiscalBufferReconciliation.bridgeGapPoints}, checks=${fiscalBufferReconciliation.checks.filter(c => c.passed).length}/${fiscalBufferReconciliation.checks.length}`
    },
    {
      id: 'BGROC03',
      label: 'Sovereign gap vs fiscal buffer reconciliation outlook',
      passed:
        bufferGap <= BUFFER_GRANT_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `bufferGap=${bufferGap}, headroom=${outlookHeadroom}`
    }
  ];

  const withinBufferGrantReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (fiscalSovereignReconciliation.withinFiscalSovereignReconciliationOutlookBand &&
      fiscalBufferReconciliation.withinFiscalBufferReconciliationOutlookBand) ||
    fiscalBufferReconciliation.withinFiscalBufferReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithSovereignBufferReconciliationBridge =
    fiscalSovereignReconciliation.alignedWithGrantFiscalReconciliationCoherence &&
    fiscalBufferReconciliation.alignedWithGrantReconciliationBridge &&
    (aggregateCoherenceGapPoints <= fiscalBufferReconciliation.bridgeGapPoints + 2.9 ||
      fiscalBufferReconciliation.withinFiscalBufferReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinBufferGrantReconciliationOutlookBand) {
    warnings.push(`Buffer–grant reconciliation outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithSovereignBufferReconciliationBridge) {
    warnings.push('Buffer grant reconciliation outlook diverges from sovereign buffer bridge.');
  }

  const narrative = withinBufferGrantReconciliationOutlookBand
    ? `Buffer–grant reconciliation outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Buffer–grant reconciliation outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: BUFFER_GRANT_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinBufferGrantReconciliationOutlookBand,
    alignedWithSovereignBufferReconciliationBridge,
    narrative,
    warnings
  };
}
