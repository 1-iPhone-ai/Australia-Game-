import type {
  CommitGatingAdvice,
  PortfolioResumptionPlan,
  PublicServiceCapacitySnapshot,
  ResumptionTrajectorySnapshot,
} from './types.ts';

export function adviseCommitGating(args: {
  turn: number;
  resumptionPlan: PortfolioResumptionPlan;
  capacity: PublicServiceCapacitySnapshot;
  resumptionTrajectory?: ResumptionTrajectorySnapshot;
  rejectedCommitmentsCount?: number;
}): CommitGatingAdvice {
  const rejected = args.rejectedCommitmentsCount ?? 0;
  const shouldBlockAllCommits =
    args.resumptionPlan.shouldHoldNewCommits ||
    args.resumptionTrajectory?.band === 'high' ||
    args.capacity.bindingConstraint === 'workforce';

  let allowedNewCommits = 0;
  if (!shouldBlockAllCommits) {
    allowedNewCommits = Math.min(args.capacity.slotsFree, args.resumptionPlan.actions.length > 0 ? 2 : 1);
  }

  const reasons: string[] = [];
  if (shouldBlockAllCommits) {
    reasons.push('Resumption plan or capacity blocks new commits');
  }
  if (rejected > 0) {
    reasons.push(`${rejected} commitments rejected this turn`);
  }
  if (args.capacity.slotsFree === 0 && !shouldBlockAllCommits) {
    reasons.push('Program slots exhausted');
    allowedNewCommits = 0;
  }

  const summary = shouldBlockAllCommits
    ? `Commit gating: block all new commits (${reasons[0] ?? 'hold active'})`
    : allowedNewCommits > 0
      ? `Commit gating: up to ${allowedNewCommits} new commits allowed`
      : 'Commit gating: no spare capacity for new commits';

  return {
    turn: args.turn,
    shouldBlockAllCommits,
    allowedNewCommits,
    rejectedCommitmentsCount: rejected,
    bindingConstraint: args.capacity.bindingConstraint,
    reasons: reasons.slice(0, 3),
    summary,
  };
}
