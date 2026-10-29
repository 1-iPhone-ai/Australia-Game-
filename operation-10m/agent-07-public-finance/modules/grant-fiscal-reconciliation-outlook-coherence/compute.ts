import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { SovereignBufferReconciliationOutlookBridgeReport } from '../sovereign-buffer-reconciliation-outlook-bridge/types';
import type { GrantReconciliationOutlookBridgeReport } from '../grant-reconciliation-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  GrantFiscalReconciliationOutlookCheck,
  GrantFiscalReconciliationOutlookCoherenceReport
} from './types';
import { GRANT_FISCAL_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA } from './types';

const GRANT_FISCAL_RECONCILIATION_TOLERANCE = 7.3;

export function buildGrantFiscalReconciliationOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  sovereignBufferReconciliation: SovereignBufferReconciliationOutlookBridgeReport,
  grantReconciliation: GrantReconciliationOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): GrantFiscalReconciliationOutlookCoherenceReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const sovereignGap = Math.abs(
    sovereignBufferReconciliation.bridgeGapPoints - outlookHeadroom * 0.13
  );
  const grantGap = Math.abs(grantReconciliation.bridgeGapPoints - sovereignGap * 0.4);
  const aggregateCoherenceGapPoints = Math.round((sovereignGap + grantGap) * 10) / 20;

  const checks: GrantFiscalReconciliationOutlookCheck[] = [
    {
      id: 'GFROC01',
      label: 'Sovereign buffer reconciliation outlook bridge within band',
      passed:
        sovereignBufferReconciliation.withinSovereignBufferReconciliationOutlookBand ||
        v1012.pressure === 'critical',
      detail: `gap=${sovereignBufferReconciliation.bridgeGapPoints}, checks=${sovereignBufferReconciliation.checks.filter(c => c.passed).length}/${sovereignBufferReconciliation.checks.length}`
    },
    {
      id: 'GFROC02',
      label: 'Grant reconciliation outlook bridge within band',
      passed:
        grantReconciliation.withinGrantReconciliationOutlookBand || v1012.pressure === 'critical',
      detail: `gap=${grantReconciliation.bridgeGapPoints}, checks=${grantReconciliation.checks.filter(c => c.passed).length}/${grantReconciliation.checks.length}`
    },
    {
      id: 'GFROC03',
      label: 'Sovereign gap vs grant reconciliation outlook',
      passed:
        grantGap <= GRANT_FISCAL_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `grantGap=${grantGap}, headroom=${outlookHeadroom}`
    }
  ];

  const withinGrantFiscalReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (sovereignBufferReconciliation.withinSovereignBufferReconciliationOutlookBand &&
      grantReconciliation.withinGrantReconciliationOutlookBand) ||
    grantReconciliation.withinGrantReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithSovereignGrantOutlook =
    sovereignBufferReconciliation.alignedWithFiscalBufferReconciliationBridge &&
    grantReconciliation.alignedWithReconciliationCouplingBridge &&
    (aggregateCoherenceGapPoints <= grantReconciliation.bridgeGapPoints + 2.8 ||
      grantReconciliation.withinGrantReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinGrantFiscalReconciliationOutlookBand) {
    warnings.push(`Grant–fiscal reconciliation outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithSovereignGrantOutlook) {
    warnings.push('Grant fiscal reconciliation outlook diverges from sovereign grant bridge.');
  }

  const narrative = withinGrantFiscalReconciliationOutlookBand
    ? `Grant–fiscal reconciliation outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Grant–fiscal reconciliation outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: GRANT_FISCAL_RECONCILIATION_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinGrantFiscalReconciliationOutlookBand,
    alignedWithSovereignGrantOutlook,
    narrative,
    warnings
  };
}
