import type {
  CapacityReliefSchedule,
  GovernanceTrajectorySnapshot,
  ReliefDispatchAction,
  ReliefDispatchPlan,
  WellbeingInterventionPriorityQueue,
} from './types.ts';

export function buildReliefDispatchPlan(args: {
  turn: number;
  reliefSchedule: CapacityReliefSchedule;
  interventionQueue: WellbeingInterventionPriorityQueue;
  governanceTrajectory?: GovernanceTrajectorySnapshot;
  limit?: number;
}): ReliefDispatchPlan {
  const limit = args.limit ?? 5;
  const actions: ReliefDispatchAction[] = [];

  for (const item of args.reliefSchedule.items) {
    const priority =
      item.reliefTurnOffset === 0
        ? ('immediate' as const)
        : item.reliefTurnOffset >= 3
          ? ('hold' as const)
          : ('deferred' as const);
    actions.push({
      programId: item.programId,
      regionId: item.regionId,
      pillar: item.pillar,
      priority,
      targetTurn: args.turn + item.reliefTurnOffset,
      rationale: item.rationale,
    });
  }

  if (actions.length < limit && args.interventionQueue.shouldExpedite) {
    for (const item of args.interventionQueue.items) {
      if (item.fitsCapacity) {
        actions.push({
          programId: item.programId,
          regionId: item.regionId,
          pillar: item.pillar,
          priority: 'immediate',
          targetTurn: args.turn,
          rationale: `Expedite — ${item.rationale}`,
        });
      }
      if (actions.length >= limit) break;
    }
  }

  const shouldHoldCommits =
    args.reliefSchedule.shouldDeferNewCommits ||
    args.governanceTrajectory?.trajectory === 'deteriorating';

  const summary =
    actions.length === 0
      ? shouldHoldCommits
        ? 'Relief dispatch: hold new commits until governance stabilizes'
        : 'Relief dispatch plan clear'
      : `Dispatch ${actions.length} relief actions (${actions.filter((a) => a.priority === 'immediate').length} immediate)`;

  return {
    turn: args.turn,
    shouldHoldCommits,
    actions: actions.slice(0, limit),
    summary,
  };
}
