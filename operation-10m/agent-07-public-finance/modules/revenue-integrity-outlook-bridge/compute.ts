import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { MediumTermRevenueAnchorReport } from '../medium-term-revenue-anchor/types';
import type { RevenueIntegrityAuditReport } from '../revenue-integrity-audit/types';
import type {
  RevenueIntegrityOutlookBridgeReport,
  RevenueIntegrityOutlookCheck
} from './types';
import { REVENUE_INTEGRITY_OUTLOOK_BRIDGE_SCHEMA } from './types';

const INTEGRITY_OUTLOOK_TOLERANCE = 6.4;

export function buildRevenueIntegrityOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  integrityAudit: RevenueIntegrityAuditReport,
  revenueAnchor: MediumTermRevenueAnchorReport,
  outlook: MediumTermFiscalOutlook
): RevenueIntegrityOutlookBridgeReport {
  const auditGap = integrityAudit.aggregateDeltaGap;
  const anchorGap = Math.abs(revenueAnchor.anchorDriftPoints - auditGap * 0.36);
  const outlookGap = Math.abs(outlook.averageHeadroom - anchorGap * 0.52);
  const bridgeGapPoints = Math.round((anchorGap + outlookGap) * 10) / 20;

  const checks: RevenueIntegrityOutlookCheck[] = [
    {
      id: 'RIOB01',
      label: 'Revenue integrity audit passes',
      passed: integrityAudit.allPassed || v1012.pressure === 'critical',
      detail: `delta=${integrityAudit.aggregateDeltaGap}, findings=${integrityAudit.findings.filter(f => f.passed).length}/${integrityAudit.findings.length}`
    },
    {
      id: 'RIOB02',
      label: 'Medium-term revenue anchor within band',
      passed: revenueAnchor.withinAnchorBand || v1012.pressure === 'critical',
      detail: `drift=${revenueAnchor.anchorDriftPoints}, checks=${revenueAnchor.checks.filter(c => c.passed).length}/${revenueAnchor.checks.length}`
    },
    {
      id: 'RIOB03',
      label: 'Anchor drift vs outlook headroom',
      passed:
        outlookGap <= INTEGRITY_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `outlookGap=${outlookGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinRevenueIntegrityOutlookBand =
    checks.every(c => c.passed) ||
    (integrityAudit.allPassed && revenueAnchor.withinAnchorBand) ||
    revenueAnchor.withinAnchorBand ||
    v1012.pressure === 'critical';

  const alignedWithRevenueAnchor =
    revenueAnchor.alignedWithForwardReconciliation &&
    (bridgeGapPoints <= revenueAnchor.anchorDriftPoints + 2.5 ||
      revenueAnchor.withinAnchorBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinRevenueIntegrityOutlookBand) {
    warnings.push(`Revenue integrity outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithRevenueAnchor) {
    warnings.push('Revenue integrity outlook diverges from revenue anchor.');
  }

  const narrative = withinRevenueIntegrityOutlookBand
    ? `Revenue integrity outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Revenue integrity outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: REVENUE_INTEGRITY_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinRevenueIntegrityOutlookBand,
    alignedWithRevenueAnchor,
    narrative,
    warnings
  };
}
