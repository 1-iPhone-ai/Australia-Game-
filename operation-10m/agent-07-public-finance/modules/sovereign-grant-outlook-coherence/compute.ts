import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { SovereignContingentOutlookCoherenceReport } from '../sovereign-contingent-outlook-coherence/types';
import type { GrantReconciliationOutlookBridgeReport } from '../grant-reconciliation-outlook-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  SovereignGrantOutlookCheck,
  SovereignGrantOutlookCoherenceReport
} from './types';
import { SOVEREIGN_GRANT_OUTLOOK_COHERENCE_SCHEMA } from './types';

const SOVEREIGN_GRANT_TOLERANCE = 7.0;

export function buildSovereignGrantOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  sovereignContingent: SovereignContingentOutlookCoherenceReport,
  grantReconciliation: GrantReconciliationOutlookBridgeReport,
  outlook: MediumTermFiscalOutlook
): SovereignGrantOutlookCoherenceReport {
  const sovereignGap = Math.abs(
    sovereignContingent.aggregateCoherenceGapPoints - outlook.averageHeadroom * 0.14
  );
  const grantGap = Math.abs(grantReconciliation.bridgeGapPoints - sovereignGap * 0.39);
  const aggregateCoherenceGapPoints = Math.round((sovereignGap + grantGap) * 10) / 20;

  const checks: SovereignGrantOutlookCheck[] = [
    {
      id: 'SGOC01',
      label: 'Sovereign contingent outlook coherence within band',
      passed: sovereignContingent.withinSovereignContingentOutlookBand || v1012.pressure === 'critical',
      detail: `gap=${sovereignContingent.aggregateCoherenceGapPoints}, checks=${sovereignContingent.checks.filter(c => c.passed).length}/${sovereignContingent.checks.length}`
    },
    {
      id: 'SGOC02',
      label: 'Grant reconciliation outlook bridge within band',
      passed:
        grantReconciliation.withinGrantReconciliationOutlookBand || v1012.pressure === 'critical',
      detail: `gap=${grantReconciliation.bridgeGapPoints}, checks=${grantReconciliation.checks.filter(c => c.passed).length}/${grantReconciliation.checks.length}`
    },
    {
      id: 'SGOC03',
      label: 'Sovereign gap vs grant reconciliation outlook',
      passed:
        grantGap <= SOVEREIGN_GRANT_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `grantGap=${grantGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinSovereignGrantOutlookBand =
    checks.every(c => c.passed) ||
    (sovereignContingent.withinSovereignContingentOutlookBand &&
      grantReconciliation.withinGrantReconciliationOutlookBand) ||
    grantReconciliation.withinGrantReconciliationOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithGrantReconciliationOutlook =
    grantReconciliation.alignedWithReconciliationCouplingBridge &&
    sovereignContingent.alignedWithContingentBufferOutlook &&
    (aggregateCoherenceGapPoints <= grantReconciliation.bridgeGapPoints + 2.6 ||
      grantReconciliation.withinGrantReconciliationOutlookBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinSovereignGrantOutlookBand) {
    warnings.push(`Sovereign–grant outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithGrantReconciliationOutlook) {
    warnings.push('Sovereign grant outlook diverges from grant reconciliation bridge.');
  }

  const narrative = withinSovereignGrantOutlookBand
    ? `Sovereign–grant outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Sovereign–grant outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: SOVEREIGN_GRANT_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinSovereignGrantOutlookBand,
    alignedWithGrantReconciliationOutlook,
    narrative,
    warnings
  };
}
