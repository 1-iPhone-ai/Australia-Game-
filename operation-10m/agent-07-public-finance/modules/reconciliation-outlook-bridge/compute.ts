import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ForwardEstimatesIntegrityReport } from '../forward-estimates-integrity/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { ReconciliationResilienceBridgeReport } from '../reconciliation-resilience-bridge/types';
import type { ReconciliationOutlookBridgeReport, ReconciliationOutlookCheck } from './types';
import { RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA } from './types';

const RECON_OUTLOOK_TOLERANCE = 6.2;

export function buildReconciliationOutlookBridgeReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  resilienceBridge: ReconciliationResilienceBridgeReport,
  forwardIntegrity: ForwardEstimatesIntegrityReport,
  outlook: MediumTermFiscalOutlook
): ReconciliationOutlookBridgeReport {
  const integrityGap = Math.abs(forwardIntegrity.aggregateRevisionGap - outlook.averageHeadroom * 0.11);
  const bridgeGap = Math.abs(resilienceBridge.bridgeGapPoints - integrityGap * 0.44);
  const bridgeGapPoints = Math.round((integrityGap + bridgeGap) * 10) / 20;

  const checks: ReconciliationOutlookCheck[] = [
    {
      id: 'ROB01',
      label: 'Reconciliation resilience bridge within band',
      passed: resilienceBridge.withinReconciliationResilienceBand || v1012.pressure === 'critical',
      detail: `gap=${resilienceBridge.bridgeGapPoints}, checks=${resilienceBridge.checks.filter(c => c.passed).length}/${resilienceBridge.checks.length}`
    },
    {
      id: 'ROB02',
      label: 'Forward estimates integrity passes',
      passed: forwardIntegrity.allPassed || v1012.pressure === 'critical',
      detail: `revision=${forwardIntegrity.aggregateRevisionGap}, drift=${forwardIntegrity.bandDriftPoints}`
    },
    {
      id: 'ROB03',
      label: 'Integrity revision vs outlook headroom',
      passed:
        integrityGap <= RECON_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `integrityGap=${integrityGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinReconciliationOutlookBand =
    checks.every(c => c.passed) ||
    (resilienceBridge.withinReconciliationResilienceBand && forwardIntegrity.allPassed) ||
    forwardIntegrity.allPassed ||
    v1012.pressure === 'critical';

  const alignedWithResilienceBridge =
    resilienceBridge.alignedWithRiskStressCoherence &&
    (bridgeGapPoints <= resilienceBridge.bridgeGapPoints + 2.5 ||
      resilienceBridge.withinReconciliationResilienceBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinReconciliationOutlookBand) {
    warnings.push(`Reconciliation outlook bridge gap ${bridgeGapPoints}.`);
  }
  if (!alignedWithResilienceBridge) {
    warnings.push('Reconciliation outlook diverges from resilience bridge.');
  }

  const narrative = withinReconciliationOutlookBand
    ? `Reconciliation outlook bridge gap ${bridgeGapPoints} within tolerance.`
    : `Reconciliation outlook alert: gap ${bridgeGapPoints}.`;

  return {
    schemaVersion: RECONCILIATION_OUTLOOK_BRIDGE_SCHEMA,
    turn,
    checks,
    bridgeGapPoints,
    withinReconciliationOutlookBand,
    alignedWithResilienceBridge,
    narrative,
    warnings
  };
}
