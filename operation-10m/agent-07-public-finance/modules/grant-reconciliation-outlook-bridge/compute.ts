import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { GrantClawbackOutlookBridgeReport } from '../grant-clawback-outlook-bridge/types';
import type { ReconciliationCouplingOutlookBridgeReport } from '../reconciliation-coupling-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  GrantReconciliationOutlookBridgeReport,
  GrantReconciliationOutlookCheck
} from './types';
import { GRANT_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA } from './types';

const GRANT_RECONCILIATION_TOLERANCE = 6.8;

export function buildGrantReconciliationOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  grantClawbackOutlook: GrantClawbackOutlookBridgeReport,
  reconciliationCoupling: ReconciliationCouplingOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): GrantReconciliationOutlookBridgeReport {
  const outlookDebt = outlook.projections[0]?.debtServiceLoad ?? v1012.debtServiceLoad;
  const grantGap = Math.abs(grantClawbackOutlook.bridgeGapPoints - outlookDebt * 0.12);
  const reconciliationGap = Math.abs(reconciliationCoupling.bridgeGapPoints - grantGap * 0.44);
  const bridgeGapPoints = Math.round((grantGap + reconciliationGap) * 10) / 20;

  const checks: GrantReconciliationOutlookCheck[] = [
    {
      id: 'GROB01',
      label: 'Grant clawback outlook bridge within band',
      passed: grantClawbackOutlook.withinGrantClawbackOutlookBand || v1012.pressure === 'critical',
      observed: grantClawbackOutlook.bridgeGapPoints,
      tolerance: 7.6
    },
    {
      id: 'GROB02',
      label: 'Reconciliation coupling outlook bridge within band',
      passed:
        reconciliationCoupling.withinReconciliationCouplingOutlookBand || v1012.pressure === 'critical',
      observed: reconciliationCoupling.bridgeGapPoints,
      tolerance: 8.2
    },
    {
      id: 'GROB03',
      label: 'Grant gap vs reconciliation coupling outlook',
      passed:
        reconciliationGap <= GRANT_RECONCILIATION_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: reconciliationGap,
      tolerance: GRANT_RECONCILIATION_TOLERANCE + 2
    }
  ];

  const withinGrantReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (grantClawbackOutlook.withinGrantClawbackOutlookBand &&
      reconciliationCoupling.withinReconciliationCouplingOutlookBand) ||
    grantClawbackOutlook.withinGrantClawbackOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithReconciliationCouplingBridge =
    reconciliationCoupling.alignedWithCouplingOutlookBridge &&
    grantClawbackOutlook.alignedWithClawbackForward &&
    (bridgeGapPoints <= reconciliationCoupling.bridgeGapPoints + 2.3 ||
      reconciliationCoupling.withinReconciliationCouplingOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinGrantReconciliationOutlookBand) {
    warnings.push(`Grant–reconciliation outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithReconciliationCouplingBridge) {
    warnings.push('Grant reconciliation outlook diverges from reconciliation coupling bridge.');
  }

  const narrative = withinGrantReconciliationOutlookBand
    ? `Grant–reconciliation outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Grant–reconciliation outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: GRANT_RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinGrantReconciliationOutlookBand,
    alignedWithReconciliationCouplingBridge,
    narrative,
    warnings
  };
}
