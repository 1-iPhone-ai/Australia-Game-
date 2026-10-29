import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { BufferGrantReconciliationOutlookCoherenceReport } from '../buffer-grant-reconciliation-outlook-coherence/types';
import type { FiscalSovereignReconciliationOutlookBridgeReport } from '../fiscal-sovereign-reconciliation-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  GrantSovereignReconciliationOutlookBridgeReport,
  GrantSovereignReconciliationOutlookCheck
} from './types';
import { GRANT_SOVEREIGN_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA } from './types';

const GRANT_SOVEREIGN_RECONCILIATION_TOLERANCE = 7.4;

export function buildGrantSovereignReconciliationOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  bufferGrantReconciliation: BufferGrantReconciliationOutlookCoherenceReport,
  fiscalSovereignReconciliation: FiscalSovereignReconciliationOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): GrantSovereignReconciliationOutlookBridgeReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const bufferGap = Math.abs(bufferGrantReconciliation.aggregateCoherenceGapPoints - outlookHeadroom * 0.13);
  const sovereignGap = Math.abs(fiscalSovereignReconciliation.bridgeGapPoints - bufferGap * 0.43);
  const bridgeGapPoints = Math.round((bufferGap + sovereignGap) * 10) / 20;

  const checks: GrantSovereignReconciliationOutlookCheck[] = [
    {
      id: 'GSROB01',
      label: 'Buffer–grant reconciliation outlook coherence within band',
      passed:
        bufferGrantReconciliation.withinBufferGrantReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      observed: bufferGrantReconciliation.aggregateCoherenceGapPoints,
      tolerance: 8.0
    },
    {
      id: 'GSROB02',
      label: 'Fiscal–sovereign reconciliation outlook bridge within band',
      passed:
        fiscalSovereignReconciliation.withinFiscalSovereignReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      observed: fiscalSovereignReconciliation.bridgeGapPoints,
      tolerance: 8.6
    },
    {
      id: 'GSROB03',
      label: 'Buffer gap vs fiscal sovereign reconciliation outlook',
      passed:
        sovereignGap <= GRANT_SOVEREIGN_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: sovereignGap,
      tolerance: GRANT_SOVEREIGN_RECONCILIATION_TOLERANCE + 2
    }
  ];

  const withinGrantSovereignReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (bufferGrantReconciliation.withinBufferGrantReconciliationOutlookBand &&
      fiscalSovereignReconciliation.withinFiscalSovereignReconciliationOutlookBand) ||
    fiscalSovereignReconciliation.withinFiscalSovereignReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithBufferGrantReconciliationCoherence =
    bufferGrantReconciliation.alignedWithSovereignBufferReconciliationBridge &&
    fiscalSovereignReconciliation.alignedWithGrantFiscalReconciliationCoherence &&
    (bridgeGapPoints <= bufferGrantReconciliation.aggregateCoherenceGapPoints + 2.9 ||
      bufferGrantReconciliation.withinBufferGrantReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinGrantSovereignReconciliationOutlookBand) {
    warnings.push(`Grant–sovereign reconciliation outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithBufferGrantReconciliationCoherence) {
    warnings.push('Grant sovereign reconciliation outlook diverges from grant fiscal coherence.');
  }

  const narrative = withinGrantSovereignReconciliationOutlookBand
    ? `Grant–sovereign reconciliation outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Grant–sovereign reconciliation outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: GRANT_SOVEREIGN_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinGrantSovereignReconciliationOutlookBand,
    alignedWithBufferGrantReconciliationCoherence,
    narrative,
    warnings
  };
}
