import type { V1012FiscalSnapshot } from '../fiscal-outcomes/types';
import type { DebtRolloverEvent, DebtRolloverInputs, DebtRolloverPlan, MaturityTranche } from './types';
import { DEBT_ROLLOVER_SCHEMA } from './types';

function isDue(tranche: MaturityTranche, turn: number): boolean {
  return turn >= tranche.maturityTurn;
}

export function resolveDebtRollover(inputs: DebtRolloverInputs): DebtRolloverPlan {
  const { turn, v1012, tranches, computeTrajectory } = inputs;
  const events: DebtRolloverEvent[] = [];
  const warnings: string[] = [];
  let working: V1012FiscalSnapshot = { ...v1012, turn };
  let liquidityStress = false;

  for (const tranche of tranches) {
    if (!isDue(tranche, turn)) {
      events.push({
        trancheId: tranche.id,
        turn,
        outcome: 'not_due',
        principalBefore: tranche.principalPoints,
        principalAfter: tranche.principalPoints,
        serviceLoadBefore: working.debtServiceLoad,
        serviceLoadAfter: working.debtServiceLoad,
        headroomDelta: 0,
        explanation: `Maturity turn ${tranche.maturityTurn} not reached.`
      });
      continue;
    }

    if (!v1012.debtEnabled) {
      events.push({
        trancheId: tranche.id,
        turn,
        outcome: 'partially_retired',
        principalBefore: tranche.principalPoints,
        principalAfter: 0,
        serviceLoadBefore: working.debtServiceLoad,
        serviceLoadAfter: Math.max(0, working.debtServiceLoad - tranche.couponLoad),
        headroomDelta: 2,
        explanation: 'Debt disabled — tranche retired from sovereign stack.'
      });
      working = {
        ...working,
        debtLevel: Math.max(0, working.debtLevel - tranche.principalPoints * 0.2),
        debtServiceLoad: Math.max(0, working.debtServiceLoad - tranche.couponLoad),
        fiscalHeadroom: working.fiscalHeadroom + 2
      };
      continue;
    }

    const headroom = working.fiscalHeadroom;
    const rolledTooOften = tranche.rolledCount >= 3;
    const critical = working.pressure === 'critical' || headroom < -12;

    let outcome: DebtRolloverEvent['outcome'] = 'rolled_at_market';
    let serviceLoadAfter = working.debtServiceLoad;
    let principalAfter = tranche.principalPoints;
    let headroomDelta = -1;
    let explanation = 'Standard market rollover.';

    if (critical && tranche.tenor === 'short') {
      outcome = 'failed_liquidity';
      liquidityStress = true;
      serviceLoadAfter = working.debtServiceLoad + tranche.couponLoad * 0.5;
      headroomDelta = -6;
      explanation = 'Critical headroom — short tranche rollover failed; liquidity stress event.';
      warnings.push(`Tranche ${tranche.id} failed rollover under critical headroom.`);
    } else if (rolledTooOften) {
      outcome = 'rolled_with_penalty';
      serviceLoadAfter = working.debtServiceLoad + tranche.couponLoad * 0.35;
      headroomDelta = -3;
      explanation = 'Repeated rollovers — penalty coupon uplift applied.';
    } else if (headroom < 0 && tranche.principalPoints > 15) {
      outcome = 'partially_retired';
      principalAfter = Math.round(tranche.principalPoints * 0.6);
      serviceLoadAfter = working.debtServiceLoad + tranche.couponLoad * 0.1;
      headroomDelta = 1;
      explanation = 'Negative headroom — partial retirement with smaller re-issue.';
    } else if (tranche.tenor === 'long') {
      serviceLoadAfter = working.debtServiceLoad + tranche.couponLoad * 0.05;
      headroomDelta = -0.5;
      explanation = 'Long tenor rolled — modest service load increase.';
    }

    events.push({
      trancheId: tranche.id,
      turn,
      outcome,
      principalBefore: tranche.principalPoints,
      principalAfter,
      serviceLoadBefore: working.debtServiceLoad,
      serviceLoadAfter,
      headroomDelta,
      explanation
    });

    working = {
      ...working,
      debtLevel:
        outcome === 'partially_retired'
          ? Math.max(0, working.debtLevel - tranche.principalPoints * 0.15)
          : working.debtLevel,
      debtServiceLoad: serviceLoadAfter,
      fiscalHeadroom: working.fiscalHeadroom + headroomDelta,
      pressure:
        working.fiscalHeadroom + headroomDelta >= 0
          ? working.pressure === 'critical'
            ? 'strained'
            : working.pressure
          : 'critical'
    };
  }

  return {
    schemaVersion: DEBT_ROLLOVER_SCHEMA,
    turn,
    events,
    trajectoryAfter: computeTrajectory(working),
    liquidityStress,
    warnings
  };
}

export function defaultMaturityLadder(turn: number): MaturityTranche[] {
  return [
    {
      id: 'tranche_short_1',
      tenor: 'short',
      principalPoints: 8,
      couponLoad: 1.2,
      maturityTurn: turn,
      rolledCount: 0
    },
    {
      id: 'tranche_med_1',
      tenor: 'medium',
      principalPoints: 18,
      couponLoad: 2.1,
      maturityTurn: turn + 2,
      rolledCount: 1
    },
    {
      id: 'tranche_long_1',
      tenor: 'long',
      principalPoints: 30,
      couponLoad: 2.8,
      maturityTurn: turn,
      rolledCount: 4
    }
  ];
}
