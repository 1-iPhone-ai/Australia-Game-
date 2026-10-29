import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FederalStateGrantCoherenceReport } from '../federal-state-grant-coherence/types';
import type { FederalStateReconciliation } from '../federal-state/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  FederalStateOutlookCheck,
  FederalStateOutlookCoherenceReport
} from './types';
import { FEDERAL_STATE_OUTLOOK_COHERENCE_SCHEMA } from './types';

const FEDERAL_OUTLOOK_TOLERANCE = 6.0;

export function buildFederalStateOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  igr: FederalStateReconciliation,
  federalGrantCoherence: FederalStateGrantCoherenceReport,
  outlook: MediumTermFiscalOutlook
): FederalStateOutlookCoherenceReport {
  const poolGap = Math.abs(igr.residualFederal - outlook.averageHeadroom * 0.14);
  const grantGap = Math.abs(federalGrantCoherence.aggregateCoherenceGapPoints - poolGap * 0.42);
  const aggregateCoherenceGapPoints = Math.round((poolGap + grantGap) * 10) / 20;

  const checks: FederalStateOutlookCheck[] = [
    {
      id: 'FSOC01',
      label: 'IGR pool reconciled',
      passed: igr.reconciled || v1012.pressure === 'critical',
      detail: `residual=${igr.residualFederal}, vii=${igr.verticalImbalanceIndex}`
    },
    {
      id: 'FSOC02',
      label: 'Federal grant coherence within band',
      passed: federalGrantCoherence.withinFederalGrantBand || v1012.pressure === 'critical',
      detail: `gap=${federalGrantCoherence.aggregateCoherenceGapPoints}, checks=${federalGrantCoherence.checks.filter(c => c.passed).length}/${federalGrantCoherence.checks.length}`
    },
    {
      id: 'FSOC03',
      label: 'Pool residual vs outlook headroom',
      passed:
        poolGap <= FEDERAL_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      detail: `poolGap=${poolGap}, headroom=${outlook.averageHeadroom}`
    }
  ];

  const withinFederalStateOutlookBand =
    checks.every(c => c.passed) ||
    (igr.reconciled && federalGrantCoherence.withinFederalGrantBand) ||
    federalGrantCoherence.withinFederalGrantBand ||
    v1012.pressure === 'critical';

  const alignedWithFederalGrantCoherence =
    federalGrantCoherence.alignedWithClawbackForward &&
    (aggregateCoherenceGapPoints <= federalGrantCoherence.aggregateCoherenceGapPoints + 2.5 ||
      federalGrantCoherence.withinFederalGrantBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinFederalStateOutlookBand) {
    warnings.push(`Federal state outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithFederalGrantCoherence) {
    warnings.push('Federal state outlook diverges from grant coherence.');
  }

  const narrative = withinFederalStateOutlookBand
    ? `Federal state outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Federal state outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: FEDERAL_STATE_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinFederalStateOutlookBand,
    alignedWithFederalGrantCoherence,
    narrative,
    warnings
  };
}
