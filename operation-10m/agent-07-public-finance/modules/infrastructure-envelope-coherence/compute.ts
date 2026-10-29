import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { GrantForwardAlignmentReport } from '../grant-forward-alignment/types';
import type { InfrastructureFinancingSummary } from '../infrastructure-financing/types';
import type { InfrastructureFiscalLoadReport } from '../infrastructure-fiscal-load/types';
import type { InfraEnvelopeCheck, InfrastructureEnvelopeCoherenceReport } from './types';
import { INFRASTRUCTURE_ENVELOPE_COHERENCE_SCHEMA } from './types';

const COHERENCE_GAP_TOLERANCE = 5.6;

export function buildInfrastructureEnvelopeCoherenceReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  infraLoad: InfrastructureFiscalLoadReport,
  infraSummary: InfrastructureFinancingSummary,
  grantForward: GrantForwardAlignmentReport
): InfrastructureEnvelopeCoherenceReport {
  const planCapitalGap = Math.abs(infraSummary.aggregateCapital - infraLoad.aggregateCapital);
  const serviceGap = Math.abs(infraSummary.aggregateServiceLoad - infraLoad.aggregateServiceLoad);
  const grantGap = Math.abs(grantForward.aggregateAlignmentGapPoints - infraLoad.loadToCapacityRatio * 2.2);

  const aggregateCoherenceGapPoints =
    Math.round((planCapitalGap + serviceGap + grantGap) * 10) / 30;

  const checks: InfraEnvelopeCheck[] = [
    {
      id: 'IEC01',
      label: 'Financing plans vs fiscal load capital',
      passed:
        planCapitalGap <= COHERENCE_GAP_TOLERANCE + 2 ||
        infraLoad.withinPortfolioLoadCap ||
        v1012.pressure === 'critical',
      detail: `gap=${planCapitalGap}, load=${infraLoad.aggregateCapital}`
    },
    {
      id: 'IEC02',
      label: 'Service load aligned across stacks',
      passed:
        serviceGap <= COHERENCE_GAP_TOLERANCE ||
        infraLoad.feasibleUnderEnvelope ||
        v1012.pressure === 'critical',
      detail: `serviceGap=${serviceGap}, plans=${infraSummary.aggregateServiceLoad}`
    },
    {
      id: 'IEC03',
      label: 'Load ratio vs grant forward band',
      passed:
        grantGap <= COHERENCE_GAP_TOLERANCE + 1.8 ||
        grantForward.withinGrantForwardBand ||
        v1012.pressure === 'critical',
      detail: `ratio=${infraLoad.loadToCapacityRatio}, grantGap=${grantForward.aggregateAlignmentGapPoints}`
    }
  ];

  const withinEnvelopeCoherence =
    checks.every(c => c.passed) ||
    (infraLoad.withinPortfolioLoadCap && infraLoad.feasibleUnderEnvelope) ||
    v1012.pressure === 'critical';

  const alignedWithGrantForward =
    grantForward.alignedWithExpenditureFramework &&
    (aggregateCoherenceGapPoints <= grantForward.aggregateAlignmentGapPoints + 2.5 ||
      grantForward.withinGrantForwardBand ||
      v1012.pressure === 'critical');

  const warnings: string[] = [];
  if (!withinEnvelopeCoherence) {
    warnings.push(`Infrastructure envelope coherence gap ${aggregateCoherenceGapPoints}.`);
  }
  if (!alignedWithGrantForward) {
    warnings.push('Infrastructure envelope diverges from grant forward alignment.');
  }

  const narrative = withinEnvelopeCoherence
    ? `Infrastructure envelope coherence gap ${aggregateCoherenceGapPoints} within tolerance.`
    : `Infrastructure envelope alert: gap ${aggregateCoherenceGapPoints}.`;

  return {
    schemaVersion: INFRASTRUCTURE_ENVELOPE_COHERENCE_SCHEMA,
    turn,
    checks,
    aggregateCoherenceGapPoints,
    withinEnvelopeCoherence,
    alignedWithGrantForward,
    narrative,
    warnings
  };
}
