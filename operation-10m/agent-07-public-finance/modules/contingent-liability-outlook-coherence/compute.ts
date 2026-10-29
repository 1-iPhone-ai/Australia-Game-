import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { ContingentLiabilityAssessment } from '../contingent-liabilities/types';
import type { ContingentLiabilityForwardBridgeReport } from '../contingent-liability-forward-bridge/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type {
  ContingentLiabilityOutlookCoherenceReport,
  ContingentOutlookCheck
} from './types';
import { CONTINGENT_LIABILITY_OUTLOOK_COHERENCE_SCHEMA } from './types';

const CONTINGENT_OUTLOOK_TOLERANCE = 6.4;

export function buildContingentLiabilityOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  contingent: ContingentLiabilityAssessment,
  contingentForward: ContingentLiabilityForwardBridgeReport,
  outlook: MediumTermFiscalOutlook
): ContingentLiabilityOutlookCoherenceReport {
  const exposureGap = Math.abs(contingent.expectedLossPoints - outlook.averageHeadroom * 0.18);
  const forwardGap = Math.abs(contingentForward.bridgeExposureGapPoints - exposureGap * 0.41);
  const aggregateCoherenceGapPoints = Math.round((exposureGap + forwardGap) * 10) / 20;

  const checks: ContingentOutlookCheck[] = [
    {
      id: 'CLOC01',
      label: 'Contingent liabilities within soft cap',
      passed: contingent.withinSoftCap || v1012.pressure === 'critical',
      observed: contingent.expectedLossPoints,
      tolerance: contingent.tailRiskPoints + 4
    },
    {
      id: 'CLOC02',
      label: 'Contingent forward bridge within band',
      passed: contingentForward.withinContingentForwardBand || v1012.pressure === 'critical',
      observed: contingentForward.bridgeExposureGapPoints,
      tolerance: 8
    },
    {
      id: 'CLOC03',
      label: 'Expected loss vs outlook headroom',
      passed:
        exposureGap <= CONTINGENT_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: exposureGap,
      tolerance: CONTINGENT_OUTLOOK_TOLERANCE + 2
    }
  ];

  const withinContingentOutlookBand =
    checks.every(c => c.passed) ||
    (contingent.withinSoftCap && contingentForward.withinContingentForwardBand) ||
    contingentForward.withinContingentForwardBand ||
    v1012.pressure === 'critical';

  const alignedWithContingentForwardBridge =
    contingentForward.alignedWithStressBridge &&
    (aggregateCoherenceGapPoints <= contingentForward.bridgeExposureGapPoints + 2.6 ||
      contingentForward.withinContingentForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinContingentOutlookBand) {
    warnings.push(`Contingent liability outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithContingentForwardBridge) {
    warnings.push('Contingent liability outlook diverges from forward bridge.');
  }

  const narrative = withinContingentOutlookBand
    ? `Contingent liability outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Contingent liability outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: CONTINGENT_LIABILITY_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinContingentOutlookBand,
    alignedWithContingentForwardBridge,
    narrative,
    warnings
  };
}
