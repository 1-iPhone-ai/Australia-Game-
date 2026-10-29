import { computeDebtOutcomeTrajectory } from '../fiscal-outcomes/debt-outcomes';
import { defaultMaturityLadder, resolveDebtRollover } from './compute';
import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';

export interface RolloverSelfTestResult {
  id: string;
  name: string;
  passed: boolean;
  detail: string;
}

function snap(partial: Partial<V1012FiscalSnapshot>): V1012FiscalSnapshot {
  return {
    turn: partial.turn ?? 10,
    revenueCapacity: partial.revenueCapacity ?? 58,
    fiscalHeadroom: partial.fiscalHeadroom ?? 4,
    pressure: partial.pressure ?? 'tight',
    sustainability: partial.sustainability ?? 'stable',
    debtServiceLoad: partial.debtServiceLoad ?? 8,
    debtLevel: partial.debtLevel ?? 32,
    debtEnabled: partial.debtEnabled ?? true,
    maintenanceLoad: partial.maintenanceLoad ?? 7,
    commitmentCount: partial.commitmentCount ?? 6,
    revenuePolicy: partial.revenuePolicy ?? 'balanced',
    reservePolicy: partial.reservePolicy ?? 'standard'
  };
}

export function runDebtRolloverSelfTests(): {
  passed: number;
  total: number;
  allPassed: boolean;
  results: RolloverSelfTestResult[];
} {
  const results: RolloverSelfTestResult[] = [];
  const record = (id: string, name: string, passed: boolean, detail: string) => {
    results.push({ id, name, passed, detail });
  };

  const turn = 10;
  const plan = resolveDebtRollover({
    turn,
    v1012: snap({ turn }),
    tranches: defaultMaturityLadder(turn),
    computeTrajectory: computeDebtOutcomeTrajectory
  });

  const longEvent = plan.events.find(e => e.trancheId === 'tranche_long_1');
  record(
    'DR01',
    'Over-rolled long tranche gets penalty outcome',
    longEvent?.outcome === 'rolled_with_penalty',
    `outcome=${longEvent?.outcome}`
  );

  const notDue = plan.events.find(e => e.trancheId === 'tranche_med_1');
  record('DR02', 'Medium tranche not due reports not_due', notDue?.outcome === 'not_due', notDue?.explanation ?? '');

  const criticalPlan = resolveDebtRollover({
    turn,
    v1012: snap({ turn, fiscalHeadroom: -14, pressure: 'critical' }),
    tranches: defaultMaturityLadder(turn),
    computeTrajectory: computeDebtOutcomeTrajectory
  });
  const shortFail = criticalPlan.events.find(e => e.trancheId === 'tranche_short_1');
  record(
    'DR03',
    'Critical headroom short tranche fails liquidity',
    shortFail?.outcome === 'failed_liquidity' && criticalPlan.liquidityStress,
    `outcome=${shortFail?.outcome}, stress=${criticalPlan.liquidityStress}`
  );

  const disabledPlan = resolveDebtRollover({
    turn,
    v1012: snap({ turn, debtEnabled: false }),
    tranches: defaultMaturityLadder(turn),
    computeTrajectory: computeDebtOutcomeTrajectory
  });
  record(
    'DR04',
    'Debt disabled retires due tranche',
    disabledPlan.events.some(e => e.outcome === 'partially_retired'),
    `events=${disabledPlan.events.map(e => e.outcome).join(',')}`
  );

  record(
    'DR05',
    'Trajectory computed after rollover',
    plan.trajectoryAfter !== null && plan.trajectoryAfter.sustainability !== undefined,
    `sustainability=${plan.trajectoryAfter?.sustainability}`
  );

  const passed = results.filter(r => r.passed).length;
  return { passed, total: results.length, allPassed: passed === results.length, results };
}
