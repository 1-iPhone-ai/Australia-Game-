import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { GrantFiscalReconciliationOutlookCoherenceReport } from '../grant-fiscal-reconciliation-outlook-coherence/types';
import type { SovereignBufferReconciliationOutlookBridgeReport } from '../sovereign-buffer-reconciliation-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  FiscalSovereignReconciliationOutlookBridgeReport,
  FiscalSovereignReconciliationOutlookCheck
} from './types';
import { FISCAL_SOVEREIGN_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA } from './types';

const FISCAL_SOVEREIGN_RECONCILIATION_TOLERANCE = 7.4;

export function buildFiscalSovereignReconciliationOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  grantFiscalReconciliation: GrantFiscalReconciliationOutlookCoherenceReport,
  sovereignBufferReconciliation: SovereignBufferReconciliationOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): FiscalSovereignReconciliationOutlookBridgeReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const grantGap = Math.abs(grantFiscalReconciliation.aggregateCoherenceGapPoints - outlookHeadroom * 0.14);
  const sovereignGap = Math.abs(sovereignBufferReconciliation.bridgeGapPoints - grantGap * 0.44);
  const bridgeGapPoints = Math.round((grantGap + sovereignGap) * 10) / 20;

  const checks: FiscalSovereignReconciliationOutlookCheck[] = [
    {
      id: 'FSROB01',
      label: 'Grant–fiscal reconciliation outlook coherence within band',
      passed:
        grantFiscalReconciliation.withinGrantFiscalReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      observed: grantFiscalReconciliation.aggregateCoherenceGapPoints,
      tolerance: 8.0
    },
    {
      id: 'FSROB02',
      label: 'Sovereign–buffer reconciliation outlook bridge within band',
      passed:
        sovereignBufferReconciliation.withinSovereignBufferReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      observed: sovereignBufferReconciliation.bridgeGapPoints,
      tolerance: 8.6
    },
    {
      id: 'FSROB03',
      label: 'Grant gap vs sovereign buffer reconciliation outlook',
      passed:
        sovereignGap <= FISCAL_SOVEREIGN_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: sovereignGap,
      tolerance: FISCAL_SOVEREIGN_RECONCILIATION_TOLERANCE + 2
    }
  ];

  const withinFiscalSovereignReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (grantFiscalReconciliation.withinGrantFiscalReconciliationOutlookBand &&
      sovereignBufferReconciliation.withinSovereignBufferReconciliationOutlookBand) ||
    sovereignBufferReconciliation.withinSovereignBufferReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithGrantFiscalReconciliationCoherence =
    grantFiscalReconciliation.alignedWithSovereignGrantOutlook &&
    sovereignBufferReconciliation.alignedWithFiscalBufferReconciliationBridge &&
    (bridgeGapPoints <= grantFiscalReconciliation.aggregateCoherenceGapPoints + 2.9 ||
      grantFiscalReconciliation.withinGrantFiscalReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinFiscalSovereignReconciliationOutlookBand) {
    warnings.push(`Fiscal–sovereign reconciliation outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithGrantFiscalReconciliationCoherence) {
    warnings.push('Fiscal sovereign reconciliation outlook diverges from grant fiscal coherence.');
  }

  const narrative = withinFiscalSovereignReconciliationOutlookBand
    ? `Fiscal–sovereign reconciliation outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Fiscal–sovereign reconciliation outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: FISCAL_SOVEREIGN_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinFiscalSovereignReconciliationOutlookBand,
    alignedWithGrantFiscalReconciliationCoherence,
    narrative,
    warnings
  };
}
