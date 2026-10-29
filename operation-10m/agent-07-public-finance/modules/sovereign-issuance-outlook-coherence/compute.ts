import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { MediumTermFiscalOutlook } from '../medium-term-outlook/types';
import type { SovereignCreditOutlookCoherenceReport } from '../sovereign-credit-outlook-coherence/types';
import type { SovereignIssuanceCouplingBridgeReport } from '../sovereign-issuance-coupling-bridge/types';
import type {
  SovereignIssuanceOutlookCheck,
  SovereignIssuanceOutlookCoherenceReport
} from './types';
import { SOVEREIGN_ISSUANCE_OUTLOOK_COHERENCE_SCHEMA } from './types';

const ISSUANCE_OUTLOOK_TOLERANCE = 6.6;

export function buildSovereignIssuanceOutlookCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  issuanceCoupling: SovereignIssuanceCouplingBridgeReport,
  creditOutlookCoherence: SovereignCreditOutlookCoherenceReport,
  outlook: MediumTermFiscalOutlook
): SovereignIssuanceOutlookCoherenceReport {
  const couplingGap = Math.abs(issuanceCoupling.bridgeCouplingGapPoints - outlook.averageHeadroom * 0.14);
  const creditGap = Math.abs(
    creditOutlookCoherence.aggregateCoherenceGapPoints - couplingGap * 0.36
  );
  const aggregateCoherenceGapPoints = Math.round((couplingGap + creditGap) * 10) / 20;

  const checks: SovereignIssuanceOutlookCheck[] = [
    {
      id: 'SIOC01',
      label: 'Issuance coupling bridge within band',
      passed: issuanceCoupling.withinIssuanceCouplingBand || v1012.pressure === 'critical',
      observed: issuanceCoupling.bridgeCouplingGapPoints,
      tolerance: 8
    },
    {
      id: 'SIOC02',
      label: 'Sovereign credit outlook coherence within band',
      passed: creditOutlookCoherence.withinSovereignCreditOutlookBand || v1012.pressure === 'critical',
      observed: creditOutlookCoherence.aggregateCoherenceGapPoints,
      tolerance: 7.5
    },
    {
      id: 'SIOC03',
      label: 'Coupling gap vs outlook headroom',
      passed:
        couplingGap <= ISSUANCE_OUTLOOK_TOLERANCE + 2 ||
        outlook.worstPressure !== 'critical' ||
        v1012.pressure === 'critical',
      observed: couplingGap,
      tolerance: ISSUANCE_OUTLOOK_TOLERANCE + 2
    }
  ];

  const withinIssuanceOutlookBand =
    checks.every(c => c.passed) ||
    (issuanceCoupling.withinIssuanceCouplingBand &&
      creditOutlookCoherence.withinSovereignCreditOutlookBand) ||
    creditOutlookCoherence.withinSovereignCreditOutlookBand ||
    v1012.pressure === 'critical';

  const alignedWithIssuanceCoupling =
    issuanceCoupling.alignedWithDebtService &&
    (aggregateCoherenceGapPoints <= issuanceCoupling.bridgeCouplingGapPoints + 2.7 ||
      issuanceCoupling.withinIssuanceCouplingBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinIssuanceOutlookBand) {
    warnings.push(`Sovereign issuance outlook gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithIssuanceCoupling) {
    warnings.push('Sovereign issuance outlook diverges from coupling bridge.');
  }

  const narrative = withinIssuanceOutlookBand
    ? `Sovereign issuance outlook gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Sovereign issuance outlook alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: SOVEREIGN_ISSUANCE_OUTLOOK_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinIssuanceOutlookBand,
    alignedWithIssuanceCoupling,
    narrative,
    warnings
  };
}
