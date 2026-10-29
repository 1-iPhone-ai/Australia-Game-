import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { MediumTermRevenueAnchorReport } from '../medium-term-revenue-anchor/types';
import type { RevenueForwardReconciliationReport } from '../revenue-forward-reconciliation/types';
import type { RevenueIntegrityAuditReport } from '../revenue-integrity-audit/types';
import type { IntegrityForwardCheck, RevenueIntegrityForwardBridgeReport } from './types';
import { REVENUE_INTEGRITY_FORWARD_BRIDGE_SCHEMA } from './types';

const BRIDGE_GAP_TOLERANCE = 5.4;

export function buildRevenueIntegrityForwardBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  integrityAudit: RevenueIntegrityAuditReport,
  revenueForward: RevenueForwardReconciliationReport,
  revenueAnchor: MediumTermRevenueAnchorReport
): RevenueIntegrityForwardBridgeReport {
  const auditForwardGap = Math.abs(integrityAudit.aggregateDeltaGap - revenueForward.aggregateGapPoints);
  const anchorGap = Math.abs(revenueAnchor.anchorDriftPoints - revenueForward.aggregateGapPoints * 0.45);
  const bridgeGapPoints = Math.round((auditForwardGap + anchorGap) * 10) / 20;

  const checks: IntegrityForwardCheck[] = [
    {
      id: 'RIFB01',
      label: 'Integrity audit vs forward reconciliation',
      passed:
        auditForwardGap <= BRIDGE_GAP_TOLERANCE + 2 ||
        integrityAudit.allPassed ||
        v1012.pressure === 'critical',
      detail: `auditGap=${integrityAudit.aggregateDeltaGap}, forward=${revenueForward.aggregateGapPoints}`
    },
    {
      id: 'RIFB02',
      label: 'Forward reconciliation passes',
      passed: revenueForward.allPassed || v1012.pressure === 'critical',
      detail: `checks=${revenueForward.checks.filter(c => c.passed).length}/${revenueForward.checks.length}`
    },
    {
      id: 'RIFB03',
      label: 'Anchor drift vs integrity delta',
      passed:
        anchorGap <= BRIDGE_GAP_TOLERANCE + 1.5 ||
        revenueAnchor.withinAnchorBand ||
        v1012.pressure === 'critical',
      detail: `drift=${revenueAnchor.anchorDriftPoints}, delta=${integrityAudit.aggregateDeltaGap}`
    }
  ];

  const withinIntegrityForwardBand =
    checks.every(c => c.passed) ||
    (integrityAudit.allPassed && revenueForward.allPassed) ||
    v1012.pressure === 'critical';

  const alignedWithRevenueAnchor =
    revenueAnchor.alignedWithForwardReconciliation &&
    (bridgeGapPoints <= revenueAnchor.anchorDriftPoints + 2.2 ||
      revenueAnchor.withinAnchorBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinIntegrityForwardBand) {
    warnings.push(`Revenue integrity forward bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithRevenueAnchor) {
    warnings.push('Integrity forward bridge diverges from revenue anchor.');
  }

  const narrative = withinIntegrityForwardBand
    ? `Revenue integrity forward bridge gap ${bridgeGapPoints} within tolerance.`
    : `Integrity forward alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: REVENUE_INTEGRITY_FORWARD_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinIntegrityForwardBand,
    alignedWithRevenueAnchor,
    narrative,
    warnings
  };
}
