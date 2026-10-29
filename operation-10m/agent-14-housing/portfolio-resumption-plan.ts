import type {
  FulfillmentAgingMonitor,
  PortfolioResumptionAction,
  PortfolioResumptionPlan,
  ReadinessTrajectorySnapshot,
  WellbeingInterventionPriorityQueue,
  WellbeingRecoveryReadinessBrief,
} from './types.ts';

export function buildPortfolioResumptionPlan(args: {
  turn: number;
  recoveryBrief: WellbeingRecoveryReadinessBrief;
  readinessTrajectory?: ReadinessTrajectorySnapshot;
  fulfillmentAging: FulfillmentAgingMonitor;
  interventionQueue?: WellbeingInterventionPriorityQueue;
  limit?: number;
}): PortfolioResumptionPlan {
  const limit = args.limit ?? 4;
  const shouldHoldNewCommits =
    !args.recoveryBrief.shouldResumePortfolioGrowth ||
    args.fulfillmentAging.shouldExpediteAging ||
    args.readinessTrajectory?.band === 'wide';

  const recommendedResumeTurn =
    shouldHoldNewCommits
      ? args.turn + (args.fulfillmentAging.overdueCount >= 2 ? 3 : 2)
      : args.turn;

  const actions: PortfolioResumptionAction[] = [];
  if (!shouldHoldNewCommits && args.interventionQueue) {
    for (const item of args.interventionQueue.items) {
      if (!item.fitsCapacity) continue;
      actions.push({
        programId: item.programId,
        regionId: item.regionId,
        pillar: item.pillar,
        priority: item.rank,
        rationale: `Resume — ${item.rationale}`,
      });
      if (actions.length >= limit) break;
    }
  }

  const summary = shouldHoldNewCommits
    ? `Portfolio resumption on hold until turn ${recommendedResumeTurn}`
    : actions.length > 0
      ? `Portfolio resumption: ${actions.length} sequenced programs from turn ${recommendedResumeTurn}`
      : 'Portfolio resumption clear with no queued programs';

  return {
    turn: args.turn,
    shouldHoldNewCommits,
    recommendedResumeTurn,
    actions,
    summary,
  };
}
