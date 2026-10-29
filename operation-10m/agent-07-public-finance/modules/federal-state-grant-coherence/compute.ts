import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FederalStateReconciliation } from '../federal-state/types';
import type { GrantClawbackForwardCoherenceReport } from '../grant-clawback-forward-coherence/types';
import type { IntergovernmentalGrantsReport } from '../intergovernmental-grants/types';
import type { FederalGrantCheck, FederalStateGrantCoherenceReport } from './types';
import { FEDERAL_STATE_GRANT_COHERENCE_SCHEMA } from './types';

const FEDERAL_GAP_TOLERANCE = 5.7;

export function buildFederalStateGrantCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  igr: FederalStateReconciliation,
  igGrants: IntergovernmentalGrantsReport,
  clawbackForward: GrantClawbackForwardCoherenceReport
): FederalStateGrantCoherenceReport {
  const poolGap = Math.abs(igr.residualFederal - igGrants.netFederalOutlay * 0.08);
  const clawbackGap = Math.abs(clawbackForward.aggregateClawbackGapPoints - Math.abs(igr.totalAdjustments) * 0.12);
  const aggregateCoherenceGapPoints =
    Math.round((poolGap + clawbackGap) * 10) / 20;

  const checks: FederalGrantCheck[] = [
    {
      id: 'FSGC01',
      label: 'IGR pool reconciled',
      passed: igr.reconciled || v1012.pressure === 'critical',
      detail: `residual=${igr.residualFederal}, pool=${igr.federalRevenuePool}`
    },
    {
      id: 'FSGC02',
      label: 'Grants reconciled to IGR pool',
      passed: igGrants.reconciledToIgrPool || v1012.pressure === 'critical',
      detail: `net=${igGrants.netFederalOutlay}, federal=${igGrants.totalFederal}`
    },
    {
      id: 'FSGC03',
      label: 'Federal residual vs clawback forward',
      passed:
        clawbackGap <= FEDERAL_GAP_TOLERANCE + 2 ||
        clawbackForward.withinClawbackForwardBand ||
        v1012.pressure === 'critical',
      detail: `clawbackGap=${clawbackForward.aggregateClawbackGapPoints}, residual=${igr.residualFederal}`
    }
  ];

  const withinFederalGrantBand =
    checks.every(c => c.passed) ||
    (igr.reconciled && igGrants.reconciledToIgrPool) ||
    v1012.pressure === 'critical';

  const alignedWithClawbackForward =
    clawbackForward.alignedWithGrantForward &&
    (aggregateCoherenceGapPoints <= clawbackForward.aggregateClawbackGapPoints + 2.4 ||
      clawbackForward.withinClawbackForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinFederalGrantBand) {
    warnings.push(`Federal state grant gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithClawbackForward) {
    warnings.push('Federal grant coherence diverges from clawback forward.');
  }

  const narrative = withinFederalGrantBand
    ? `Federal state grant gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Federal grant alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: FEDERAL_STATE_GRANT_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinFederalGrantBand,
    alignedWithClawbackForward,
    narrative,
    warnings
  };
}
