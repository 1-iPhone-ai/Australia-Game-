import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { FederalStateReconciliation } from '../federal-state/types';
import type { IntergovernmentalGrantsReport } from '../intergovernmental-grants/types';
import type { StatutoryBalancesReport } from '../statutory-balances/types';
import type {
  IgrStatutoryCheck,
  IntergovernmentalStatutoryCoherenceReport
} from './types';
import { INTERGOVERNMENTAL_STATUTORY_COHERENCE_SCHEMA } from './types';

const IGR_STATUTORY_TOLERANCE = 6.2;

export function buildIntergovernmentalStatutoryCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  igr: FederalStateReconciliation,
  statutory: StatutoryBalancesReport,
  igGrants: IntergovernmentalGrantsReport
): IntergovernmentalStatutoryCoherenceReport {
  const fiscalResidualGap = Math.abs(igr.residualFederal - statutory.fiscalBalance * 0.09);
  const grantPoolGap = Math.abs(igGrants.netFederalOutlay - igr.federalRevenuePool * 0.18);
  const verticalGap = Math.abs(igr.verticalImbalanceIndex - 1) * statutory.netDebtToCapacityRatio * 2;
  const aggregateCoherenceGapPoints = Math.round((fiscalResidualGap + grantPoolGap + verticalGap) * 10) / 30;

  const checks: IgrStatutoryCheck[] = [
    {
      id: 'IGSC01',
      label: 'IGR reconciliation closed',
      passed: igr.reconciled || v1012.pressure === 'critical',
      detail: `residual=${igr.residualFederal}, pool=${igr.federalRevenuePool}`
    },
    {
      id: 'IGSC02',
      label: 'Statutory fiscal balance within soft anchors',
      passed: statutory.allWithinSoftAnchors || v1012.pressure === 'critical',
      detail: `fiscal=${statutory.fiscalBalance}, debtRatio=${statutory.netDebtToCapacityRatio}`
    },
    {
      id: 'IGSC03',
      label: 'Grant pool vs IGR residual',
      passed:
        grantPoolGap <= IGR_STATUTORY_TOLERANCE + 2 ||
        igGrants.reconciledToIgrPool ||
        v1012.pressure === 'critical',
      detail: `grants=${igGrants.netFederalOutlay}, residual=${igr.residualFederal}`
    }
  ];

  const withinIgrStatutoryBand =
    checks.every(c => c.passed) ||
    (igr.reconciled && statutory.allWithinSoftAnchors) ||
    v1012.pressure === 'critical';

  const alignedWithGrantPool =
    igGrants.reconciledToIgrPool &&
    (aggregateCoherenceGapPoints <= grantPoolGap + 2.5 ||
      igGrants.reconciledToIgrPool ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinIgrStatutoryBand) {
    warnings.push(`Intergovernmental statutory gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithGrantPool) {
    warnings.push('IGR statutory coherence diverges from grant pool.');
  }

  const narrative = withinIgrStatutoryBand
    ? `Intergovernmental statutory gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Intergovernmental statutory alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: INTERGOVERNMENTAL_STATUTORY_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinIgrStatutoryBand,
    alignedWithGrantPool,
    narrative,
    warnings
  };
}
