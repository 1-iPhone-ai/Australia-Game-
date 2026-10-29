import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { GrantReconciliationOutlookBridgeReport } from '../grant-reconciliation-outlook-bridge/types';
import type { FiscalBufferOutlookCoherenceReport } from '../fiscal-buffer-outlook-coherence/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  FiscalBufferReconciliationOutlookBridgeReport,
  FiscalBufferReconciliationOutlookCheck
} from './types';
import { FISCAL_BUFFER_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA } from './types';

const FISCAL_BUFFER_RECONCILIATION_TOLERANCE = 7.1;

export function buildFiscalBufferReconciliationOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  grantReconciliation: GrantReconciliationOutlookBridgeReport,
  fiscalBufferOutlook: FiscalBufferOutlookCoherenceReport,
  outlook: MediumTermFiscalOutlook
): FiscalBufferReconciliationOutlookBridgeReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const grantGap = Math.abs(grantReconciliation.bridgeGapPoints - outlookHeadroom * 0.11);
  const bufferGap = Math.abs(fiscalBufferOutlook.aggregateCoherenceGapPoints - grantGap * 0.41);
  const bridgeGapPoints = Math.round((grantGap + bufferGap) * 10) / 20;

  const checks: FiscalBufferReconciliationOutlookCheck[] = [
    {
      id: 'FBROB01',
      label: 'Grant reconciliation outlook bridge within band',
      passed:
        grantReconciliation.withinGrantReconciliationOutlookBand || v1012.pressure === 'critical',
      observed: grantReconciliation.bridgeGapPoints,
      tolerance: 7.8
    },
    {
      id: 'FBROB02',
      label: 'Fiscal buffer outlook coherence within band',
      passed: fiscalBufferOutlook.withinBufferOutlookBand || v1012.pressure === 'critical',
      observed: fiscalBufferOutlook.aggregateCoherenceGapPoints,
      tolerance: 8.4
    },
    {
      id: 'FBROB03',
      label: 'Grant gap vs fiscal buffer outlook',
      passed:
        bufferGap <= FISCAL_BUFFER_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: bufferGap,
      tolerance: FISCAL_BUFFER_RECONCILIATION_TOLERANCE + 2
    }
  ];

  const withinFiscalBufferReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (grantReconciliation.withinGrantReconciliationOutlookBand &&
      fiscalBufferOutlook.withinBufferOutlookBand) ||
    fiscalBufferOutlook.withinBufferOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithGrantReconciliationBridge =
    grantReconciliation.alignedWithReconciliationCouplingBridge &&
    fiscalBufferOutlook.alignedWithRiskOutlook &&
    (bridgeGapPoints <= grantReconciliation.bridgeGapPoints + 2.5 ||
      grantReconciliation.withinGrantReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinFiscalBufferReconciliationOutlookBand) {
    warnings.push(`Fiscal–buffer reconciliation outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithGrantReconciliationBridge) {
    warnings.push('Fiscal buffer reconciliation outlook diverges from grant reconciliation bridge.');
  }

  const narrative = withinFiscalBufferReconciliationOutlookBand
    ? `Fiscal–buffer reconciliation outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Fiscal–buffer reconciliation outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: FISCAL_BUFFER_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinFiscalBufferReconciliationOutlookBand,
    alignedWithGrantReconciliationBridge,
    narrative,
    warnings
  };
}
