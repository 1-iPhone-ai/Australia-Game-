import type { V1012FiscalSnapshot, BudgetEnvelope } from '../fiscal-outcomes/types';
import type { InfrastructureFinancingSummary } from '../infrastructure-financing/types';
import type { InfrastructureFiscalLoadLine, InfrastructureFiscalLoadReport } from './types';
import { INFRASTRUCTURE_FISCAL_LOAD_SCHEMA } from './types';

const LOAD_RATIO_CAP = 0.38;

export function buildInfrastructureFiscalLoadReport(
  turn: number,
  v1012: V1012FiscalSnapshot,
  infraSummary: InfrastructureFinancingSummary,
  envelope: BudgetEnvelope
): InfrastructureFiscalLoadReport {
  const envelopeCapacityPoints = envelope.totalCapacityPoints;
  const lines: InfrastructureFiscalLoadLine[] = infraSummary.plans.map(plan => {
    const serviceLoadPoints =
      Math.round(plan.stack.reduce((s, l) => s + l.serviceLoadDelta, 0) * 10) / 10;
    const envelopeShare =
      envelopeCapacityPoints <= 0 ? 0 : Math.round((serviceLoadPoints / envelopeCapacityPoints) * 1000) / 1000;
    return {
      projectId: plan.projectId,
      capitalPoints: plan.totalCapitalPoints,
      serviceLoadPoints,
      envelopeShare,
      withinLoadBand: envelopeShare <= 0.12 || v1012.pressure === 'critical'
    };
  });

  const aggregateCapital = infraSummary.aggregateCapital;
  const aggregateServiceLoad = infraSummary.aggregateServiceLoad;
  const loadToCapacityRatio =
    envelopeCapacityPoints <= 0
      ? 0
      : Math.round((aggregateServiceLoad / envelopeCapacityPoints) * 1000) / 1000;

  const withinPortfolioLoadCap =
    loadToCapacityRatio <= LOAD_RATIO_CAP ||
    v1012.pressure === 'critical' ||
    (v1012.pressure === 'strained' && loadToCapacityRatio <= LOAD_RATIO_CAP * 1.1);

  const feasibleUnderEnvelope =
    infraSummary.plans.every(p => p.feasible) || withinPortfolioLoadCap || v1012.pressure === 'critical';

  const warnings: string[] = [];
  if (!withinPortfolioLoadCap) {
    warnings.push(`Infra service load ratio ${loadToCapacityRatio} exceeds ${LOAD_RATIO_CAP}.`);
  }
  if (!feasibleUnderEnvelope) {
    warnings.push('At least one infrastructure plan infeasible under envelope.');
  }

  const narrative = withinPortfolioLoadCap
    ? `Infrastructure fiscal load ${loadToCapacityRatio} of envelope; service ${aggregateServiceLoad}.`
    : `Infrastructure load alert: ratio ${loadToCapacityRatio}.`;

  return {
    schemaVersion: INFRASTRUCTURE_FISCAL_LOAD_SCHEMA,
    turn,
    lines,
    aggregateCapital,
    aggregateServiceLoad,
    envelopeCapacityPoints,
    loadToCapacityRatio,
    withinPortfolioLoadCap,
    feasibleUnderEnvelope,
    narrative,
    warnings
  };
}
