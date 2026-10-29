import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { BufferSovereignReconciliationOutlookBridgeReport } from '../buffer-sovereign-reconciliation-outlook-bridge/types';
import type { FiscalGrantReconciliationOutlookBridgeReport } from '../fiscal-grant-reconciliation-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  FiscalGrantReconciliationOutlookCoherenceCheck,
  FiscalGrantReconciliationOutlookCoherenceReport
} from './types';
import { FISCAL_GRANT_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA } from './types';

const FISCAL_GRANT_RECONCILIATION_COHERENCE_TOLERANCE = 7.9;

export function buildFiscalGrantReconciliationOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  bufferSovereignReconciliation: BufferSovereignReconciliationOutlookBridgeReport,
  fiscalGrantReconciliation: FiscalGrantReconciliationOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): FiscalGrantReconciliationOutlookCoherenceReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const sovereignGap = Math.abs(
    bufferSovereignReconciliation.bridgeGapPoints - outlookHeadroom * 0.18
  );
  const grantGap = Math.abs(fiscalGrantReconciliation.bridgeGapPoints - sovereignGap * 0.42);
  const aggregateCoherenceGapPoints = Math.round((sovereignGap + grantGap) * 10) / 20;

  const checks: FiscalGrantReconciliationOutlookCoherenceCheck[] = [
    {
      id: 'FGROC01',
      label: 'Buffer–sovereign reconciliation outlook bridge within band',
      passed:
        bufferSovereignReconciliation.withinBufferSovereignReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      detail: `gap=${bufferSovereignReconciliation.bridgeGapPoints}, checks=${bufferSovereignReconciliation.checks.filter(c => c.passed).length}/${bufferSovereignReconciliation.checks.length}`
    },
    {
      id: 'FGROC02',
      label: 'Fiscal–grant reconciliation outlook bridge within band',
      passed:
        fiscalGrantReconciliation.withinFiscalGrantReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      detail: `gap=${fiscalGrantReconciliation.bridgeGapPoints}, checks=${fiscalGrantReconciliation.checks.filter(c => c.passed).length}/${fiscalGrantReconciliation.checks.length}`
    },
    {
      id: 'FGROC03',
      label: 'Sovereign gap vs fiscal grant reconciliation outlook',
      passed:
        grantGap <= FISCAL_GRANT_RECONCILIATION_COHERENCE_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `grantGap=${grantGap}, headroom=${outlookHeadroom}`
    }
  ];

  const withinFiscalGrantReconciliationOutlookCoherenceBand =
    checks.every(c => c.passed) ||
    (bufferSovereignReconciliation.withinBufferSovereignReconciliationOutlookBand &&
      fiscalGrantReconciliation.withinFiscalGrantReconciliationOutlookBand) ||
    fiscalGrantReconciliation.withinFiscalGrantReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithBufferSovereignReconciliationBridge =
    bufferSovereignReconciliation.alignedWithSovereignFiscalReconciliationCoherence &&
    fiscalGrantReconciliation.alignedWithBufferFiscalReconciliationCoherence &&
    (aggregateCoherenceGapPoints <= fiscalGrantReconciliation.bridgeGapPoints + 2.8 ||
      fiscalGrantReconciliation.withinFiscalGrantReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinFiscalGrantReconciliationOutlookCoherenceBand) {
    warnings.push(`Fiscal–grant reconciliation outlook coherence gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithBufferSovereignReconciliationBridge) {
    warnings.push('Fiscal grant reconciliation outlook diverges from buffer sovereign bridge.');
  }

  const narrative = withinFiscalGrantReconciliationOutlookCoherenceBand
    ? `Fiscal–grant reconciliation outlook coherence gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Fiscal–grant reconciliation outlook coherence alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: FISCAL_GRANT_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinFiscalGrantReconciliationOutlookCoherenceBand,
    alignedWithBufferSovereignReconciliationBridge,
    narrative,
    warnings
  };
}
