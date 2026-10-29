import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ReconciliationOutlookBridgeReport } from '../reconciliation-outlook-bridge/types';
import type { DebtFiscalCouplingOutlookBridgeReport } from '../debt-fiscal-coupling-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  ReconciliationCouplingOutlookBridgeReport,
  ReconciliationCouplingOutlookCheck
} from './types';
import { RECONCILIATION_COUPLING_OUTLOOK_BRIDGE_SCHEMA } from './types';

const RECONCILIATION_COUPLING_TOLERANCE = 6.6;

export function buildReconciliationCouplingOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  reconciliationOutlook: ReconciliationOutlookBridgeReport,
  couplingOutlook: DebtFiscalCouplingOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): ReconciliationCouplingOutlookBridgeReport {
  const outlookHeadroom = outlook.averageHeadroom ?? v1012.fiscalHeadroom;
  const reconciliationGap = Math.abs(reconciliationOutlook.bridgeGapPoints - outlookHeadroom * 0.14);
  const couplingGap = Math.abs(couplingOutlook.bridgeGapPoints - reconciliationGap * 0.43);
  const bridgeGapPoints = Math.round((reconciliationGap + couplingGap) * 10) / 20;

  const checks: ReconciliationCouplingOutlookCheck[] = [
    {
      id: 'RCOB01',
      label: 'Reconciliation outlook bridge within band',
      passed: reconciliationOutlook.withinReconciliationOutlookBand || v1012.pressure === 'critical',
      observed: reconciliationOutlook.bridgeGapPoints,
      tolerance: 7.4
    },
    {
      id: 'RCOB02',
      label: 'Debt–fiscal coupling outlook bridge within band',
      passed: couplingOutlook.withinCouplingOutlookBand || v1012.pressure === 'critical',
      observed: couplingOutlook.bridgeGapPoints,
      tolerance: 8.5
    },
    {
      id: 'RCOB03',
      label: 'Reconciliation gap vs coupling outlook',
      passed:
        couplingGap <= RECONCILIATION_COUPLING_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: couplingGap,
      tolerance: RECONCILIATION_COUPLING_TOLERANCE + 2
    }
  ];

  const withinReconciliationCouplingOutlookBand =
    checks.every(c => c.passed) ||
    (reconciliationOutlook.withinReconciliationOutlookBand && couplingOutlook.withinCouplingOutlookBand) ||
    reconciliationOutlook.withinReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithCouplingOutlookBridge =
    couplingOutlook.alignedWithDebtServiceForward &&
    reconciliationOutlook.alignedWithResilienceBridge &&
    (bridgeGapPoints <= couplingOutlook.bridgeGapPoints + 2.4 ||
      couplingOutlook.withinCouplingOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinReconciliationCouplingOutlookBand) {
    warnings.push(`Reconciliation–coupling outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithCouplingOutlookBridge) {
    warnings.push('Reconciliation coupling outlook diverges from debt–fiscal coupling bridge.');
  }

  const narrative = withinReconciliationCouplingOutlookBand
    ? `Reconciliation–coupling outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Reconciliation–coupling outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: RECONCILIATION_COUPLING_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinReconciliationCouplingOutlookBand,
    alignedWithCouplingOutlookBridge,
    narrative,
    warnings
  };
}
