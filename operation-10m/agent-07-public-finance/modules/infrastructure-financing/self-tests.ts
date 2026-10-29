import { computeFiscalOutcomesLayer, createInitialFiscalOutcomesPersisted } from '../fiscal-outcomes/compute';
import { planInfrastructureFunding, summarizeInfrastructureFinancing } from './compute';
import type { InfrastructureProjectFundingRequest } from './types';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 6,
    revenueCapacity: partial.revenueCapacity ?? 63,
    fiscalHeadroom: partial.fiscalHeadroom ?? 9,
    pressure: partial.pressure ?? 'healthy',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 4,
    debtLevel: partial.debtLevel ?? 17,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 5,
    commitmentCount: partial.commitmentCount ?? 4,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

const sampleRequest = (overrides: Partial<InfrastructureProjectFundingRequest> = {}): InfrastructureProjectFundingRequest => ({
  projectId: 'infra_test_1',
  title: 'Test corridor',
  regionIds: ['r1'],
  capitalPoints: 12,
  maintenancePointsPerTurn: 2,
  strategicWeight: 0.6,
  preferredVehicle: 'sovereign_bond_series',
  ...overrides
});

export function runInfrastructureFinancingSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: Array<{ id: string; name: string; passed: boolean; detail: string }>;
} {
  const results: Array<{ id: string; name: string; passed: boolean; detail: string }> = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const v1012 = snap({});
  const persisted = createInitialFiscalOutcomesPersisted(v1012.turn);
  const { state } = computeFiscalOutcomesLayer({ turn: v1012.turn, v1012 }, persisted);

  const plan = planInfrastructureFunding(sampleRequest(), v1012, state.budget);
  record('IF01', 'Funding plan stacks capital', plan.stack.reduce((s, l) => s + l.capitalPoints, 0) === plan.totalCapitalPoints, `pts=${plan.totalCapitalPoints}`);
  record('IF02', 'Healthy snapshot feasible', plan.feasible, String(plan.feasible));

  const noDebt = planInfrastructureFunding(sampleRequest({ capitalPoints: 20 }), snap({ debtEnabled: false }), state.budget);
  record('IF03', 'Debt disabled uses grant-match warn path', noDebt.stack.some(l => l.vehicle === 'grant_match_federal'), noDebt.warnings.join(';'));

  const summary = summarizeInfrastructureFinancing(6, [sampleRequest(), sampleRequest({ projectId: 'infra_test_2', capitalPoints: 8 })], v1012, state.budget);
  record('IF04', 'Summary aggregates service load', summary.aggregateServiceLoad >= 0, `load=${summary.aggregateServiceLoad}`);
  record('IF05', 'Two-project portfolio plans', summary.plans.length === 2, `n=${summary.plans.length}`);

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
