import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { BufferFiscalReconciliationOutlookCoherenceReport } from '../buffer-fiscal-reconciliation-outlook-coherence/types';
import type { GrantSovereignReconciliationOutlookBridgeReport } from '../grant-sovereign-reconciliation-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  FiscalGrantReconciliationOutlookBridgeReport,
  FiscalGrantReconciliationOutlookCheck
} from './types';
import { FISCAL_GRANT_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA } from './types';

const FISCAL_GRANT_RECONCILIATION_TOLERANCE = 7.6;

export function buildFiscalGrantReconciliationOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  bufferFiscalReconciliation: BufferFiscalReconciliationOutlookCoherenceReport,
  grantSovereignReconciliation: GrantSovereignReconciliationOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): FiscalGrantReconciliationOutlookBridgeReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const fiscalGap = Math.abs(
    bufferFiscalReconciliation.aggregateCoherenceGapPoints - outlookHeadroom * 0.14
  );
  const grantGap = Math.abs(grantSovereignReconciliation.bridgeGapPoints - fiscalGap * 0.44);
  const bridgeGapPoints = Math.round((fiscalGap + grantGap) * 10) / 20;

  const checks: FiscalGrantReconciliationOutlookCheck[] = [
    {
      id: 'FGROB01',
      label: 'Buffer–fiscal reconciliation outlook coherence within band',
      passed:
        bufferFiscalReconciliation.withinBufferFiscalReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      observed: bufferFiscalReconciliation.aggregateCoherenceGapPoints,
      tolerance: 8.1
    },
    {
      id: 'FGROB02',
      label: 'Grant–sovereign reconciliation outlook bridge within band',
      passed:
        grantSovereignReconciliation.withinGrantSovereignReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      observed: grantSovereignReconciliation.bridgeGapPoints,
      tolerance: 8.7
    },
    {
      id: 'FGROB03',
      label: 'Fiscal gap vs grant sovereign reconciliation outlook',
      passed:
        grantGap <= FISCAL_GRANT_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: grantGap,
      tolerance: FISCAL_GRANT_RECONCILIATION_TOLERANCE + 2
    }
  ];

  const withinFiscalGrantReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (bufferFiscalReconciliation.withinBufferFiscalReconciliationOutlookBand &&
      grantSovereignReconciliation.withinGrantSovereignReconciliationOutlookBand) ||
    grantSovereignReconciliation.withinGrantSovereignReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithBufferFiscalReconciliationCoherence =
    bufferFiscalReconciliation.alignedWithGrantSovereignReconciliationBridge &&
    grantSovereignReconciliation.alignedWithBufferGrantReconciliationCoherence &&
    (bridgeGapPoints <= bufferFiscalReconciliation.aggregateCoherenceGapPoints + 2.8 ||
      bufferFiscalReconciliation.withinBufferFiscalReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinFiscalGrantReconciliationOutlookBand) {
    warnings.push(`Fiscal–grant reconciliation outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithBufferFiscalReconciliationCoherence) {
    warnings.push('Fiscal grant reconciliation outlook diverges from buffer fiscal coherence.');
  }

  const narrative = withinFiscalGrantReconciliationOutlookBand
    ? `Fiscal–grant reconciliation outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Fiscal–grant reconciliation outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: FISCAL_GRANT_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinFiscalGrantReconciliationOutlookBand,
    alignedWithBufferFiscalReconciliationCoherence,
    narrative,
    warnings
  };
}
