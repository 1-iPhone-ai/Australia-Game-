import type {
  InfrastructureFinancingSummary,
  InfrastructureFundingPlan,
  InfrastructureProjectFundingRequest
} from './types';
import { INFRA_FINANCING_SCHEMA } from './types';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { NationalBudgetEnvelope } from '../fiscal-outcomes/types';

const VEHICLE_SERVICE_LOAD: Record<string, number> = {
  paygo_appropriation: 0,
  sovereign_bond_series: 0.08,
  state_borrowing_facility: 0.06,
  ppp_availability: 0.04,
  grant_match_federal: 0,
  off_budget_entity: 0.02,
  debt_funded_acceleration: 0.12
};

export function planInfrastructureFunding(
  request: InfrastructureProjectFundingRequest,
  v1012: V1012FiscalSnapshot,
  envelope: NationalBudgetEnvelope
): InfrastructureFundingPlan {
  const infraLine = envelope.lines.find(l => l.category === 'infrastructure_capital');
  const flex = infraLine?.flexPoints ?? 0;
  const warnings: string[] = [];
  const vehicle = request.preferredVehicle;
  let capitalFromPaygo = Math.min(request.capitalPoints, flex);
  let remainder = request.capitalPoints - capitalFromPaygo;

  const stack: InfrastructureFundingPlan['stack'] = [];
  if (capitalFromPaygo > 0) {
    stack.push({
      vehicle: 'paygo_appropriation',
      capitalPoints: capitalFromPaygo,
      serviceLoadDelta: 0,
      envelopeCategory: 'infrastructure_capital',
      warnOnly: false,
      explanation: `Pay-go from infrastructure envelope flex (${capitalFromPaygo} pts).`
    });
  }

  if (remainder > 0 && v1012.debtEnabled) {
    const debtVehicle =
      vehicle === 'debt_funded_acceleration' ? 'debt_funded_acceleration' : 'sovereign_bond_series';
    const load = remainder * (VEHICLE_SERVICE_LOAD[debtVehicle] ?? 0.08);
    stack.push({
      vehicle: debtVehicle,
      capitalPoints: remainder,
      serviceLoadDelta: Math.round(load * 10) / 10,
      envelopeCategory: 'debt_service_reserve',
      warnOnly: v1012.pressure !== 'critical',
      explanation: `Debt-funded tranche ${remainder} pts; service load +${load.toFixed(1)}.`
    });
    remainder = 0;
  } else if (remainder > 0) {
    stack.push({
      vehicle: 'grant_match_federal',
      capitalPoints: remainder,
      serviceLoadDelta: 0,
      envelopeCategory: 'infrastructure_capital',
      warnOnly: true,
      explanation: `Grant-match / staged funding for ${remainder} pts (debt disabled).`
    });
    warnings.push('Debt disabled — remainder staged via grant-match (warn-only).');
  }

  const aggregateService = stack.reduce((s, l) => s + l.serviceLoadDelta, 0);
  const fiscalHeadroomAfter = v1012.fiscalHeadroom - Math.round(request.capitalPoints * 0.04);
  const debtServiceAfter = v1012.debtServiceLoad + aggregateService;
  const feasible =
    fiscalHeadroomAfter > -18 &&
    (v1012.pressure !== 'critical' || request.capitalPoints <= flex + 5);

  if (v1012.pressure === 'critical' && request.capitalPoints > flex) {
    warnings.push('Critical fiscal pressure — large capital stack should be staged.');
  }
  if (debtServiceAfter > 20) {
    warnings.push('Projected debt service exceeds soft guard (20 pts).');
  }

  return {
    projectId: request.projectId,
    totalCapitalPoints: request.capitalPoints,
    stack,
    fiscalHeadroomAfter,
    debtServiceAfter,
    feasible,
    warnings
  };
}

export function summarizeInfrastructureFinancing(
  turn: number,
  requests: InfrastructureProjectFundingRequest[],
  v1012: V1012FiscalSnapshot,
  envelope: NationalBudgetEnvelope
): InfrastructureFinancingSummary {
  const plans = requests.map(r => planInfrastructureFunding(r, v1012, envelope));
  const aggregateCapital = plans.reduce((s, p) => s + p.totalCapitalPoints, 0);
  const aggregateServiceLoad = plans.reduce(
    (s, p) => s + p.stack.reduce((t, l) => t + l.serviceLoadDelta, 0),
    0
  );
  const bindingWarnings = plans.flatMap(p => p.warnings).filter(Boolean);

  return {
    schemaVersion: INFRA_FINANCING_SCHEMA,
    turn,
    plans,
    aggregateCapital,
    aggregateServiceLoad,
    bindingWarnings
  };
}
