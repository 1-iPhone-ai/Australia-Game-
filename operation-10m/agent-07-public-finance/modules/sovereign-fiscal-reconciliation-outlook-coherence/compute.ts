import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FiscalGrantReconciliationOutlookBridgeReport } from '../fiscal-grant-reconciliation-outlook-bridge/types';
import type { BufferFiscalReconciliationOutlookCoherenceReport } from '../buffer-fiscal-reconciliation-outlook-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  SovereignFiscalReconciliationOutlookCheck,
  SovereignFiscalReconciliationOutlookCoherenceReport
} from './types';
import { SOVEREIGN_FISCAL_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA } from './types';

const SOVEREIGN_FISCAL_RECONCILIATION_TOLERANCE = 7.7;

export function buildSovereignFiscalReconciliationOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  fiscalGrantReconciliation: FiscalGrantReconciliationOutlookBridgeReport,
  bufferFiscalReconciliation: BufferFiscalReconciliationOutlookCoherenceReport,
  outlook: MediumTermFiscalOutlook
): SovereignFiscalReconciliationOutlookCoherenceReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const grantGap = Math.abs(
    fiscalGrantReconciliation.bridgeGapPoints - outlookHeadroom * 0.16
  );
  const fiscalGap = Math.abs(bufferFiscalReconciliation.aggregateCoherenceGapPoints - grantGap * 0.41);
  const aggregateCoherenceGapPoints = Math.round((grantGap + fiscalGap) * 10) / 20;

  const checks: SovereignFiscalReconciliationOutlookCheck[] = [
    {
      id: 'SFROC01',
      label: 'Fiscal–grant reconciliation outlook bridge within band',
      passed:
        fiscalGrantReconciliation.withinFiscalGrantReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      detail: `gap=${fiscalGrantReconciliation.bridgeGapPoints}, checks=${fiscalGrantReconciliation.checks.filter(c => c.passed).length}/${fiscalGrantReconciliation.checks.length}`
    },
    {
      id: 'SFROC02',
      label: 'Buffer–fiscal reconciliation outlook coherence within band',
      passed:
        bufferFiscalReconciliation.withinBufferFiscalReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      detail: `gap=${bufferFiscalReconciliation.aggregateCoherenceGapPoints}, checks=${bufferFiscalReconciliation.checks.filter(c => c.passed).length}/${bufferFiscalReconciliation.checks.length}`
    },
    {
      id: 'SFROC03',
      label: 'Fiscal grant gap vs buffer fiscal reconciliation outlook',
      passed:
        fiscalGap <= SOVEREIGN_FISCAL_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `fiscalGap=${fiscalGap}, headroom=${outlookHeadroom}`
    }
  ];

  const withinSovereignFiscalReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (fiscalGrantReconciliation.withinFiscalGrantReconciliationOutlookBand &&
      bufferFiscalReconciliation.withinBufferFiscalReconciliationOutlookBand) ||
    bufferFiscalReconciliation.withinBufferFiscalReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithFiscalGrantReconciliationBridge =
    fiscalGrantReconciliation.alignedWithBufferFiscalReconciliationCoherence &&
    bufferFiscalReconciliation.alignedWithGrantSovereignReconciliationBridge &&
    (aggregateCoherenceGapPoints <= bufferFiscalReconciliation.aggregateCoherenceGapPoints + 2.8 ||
      bufferFiscalReconciliation.withinBufferFiscalReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinSovereignFiscalReconciliationOutlookBand) {
    warnings.push(`Sovereign–fiscal reconciliation outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithFiscalGrantReconciliationBridge) {
    warnings.push('Sovereign fiscal reconciliation outlook diverges from fiscal grant bridge.');
  }

  const narrative = withinSovereignFiscalReconciliationOutlookBand
    ? `Sovereign–fiscal reconciliation outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Sovereign–fiscal reconciliation outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: SOVEREIGN_FISCAL_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinSovereignFiscalReconciliationOutlookBand,
    alignedWithFiscalGrantReconciliationBridge,
    narrative,
    warnings
  };
}
