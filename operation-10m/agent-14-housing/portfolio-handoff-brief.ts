import type {
  CommitGatingAdvice,
  PortfolioHandoffBrief,
  PortfolioResumptionPlan,
  ResumptionTrajectorySnapshot,
  WellbeingRecoveryReadinessBrief,
} from './types.ts';

export function composePortfolioHandoffBrief(args: {
  turn: number;
  resumptionPlan: PortfolioResumptionPlan;
  commitGating: CommitGatingAdvice;
  recoveryBrief: WellbeingRecoveryReadinessBrief;
  resumptionTrajectory?: ResumptionTrajectorySnapshot;
}): PortfolioHandoffBrief {
  const shouldSignalHandoff =
    !args.commitGating.shouldBlockAllCommits &&
    args.recoveryBrief.readinessBand !== 'not_ready' &&
    (args.resumptionTrajectory?.trajectory === 'improving' ||
      args.resumptionPlan.actions.length > 0);

  const headlines: string[] = [];
  if (shouldSignalHandoff) {
    headlines.push('Portfolio handoff: sequenced programs ready for national wire-in');
  } else {
    headlines.push('Portfolio handoff deferred — finish gating preconditions');
  }
  if (args.resumptionPlan.actions.length > 0) {
    headlines.push(`${args.resumptionPlan.actions.length} resumption actions queued`);
  }
  if (args.commitGating.allowedNewCommits > 0) {
    headlines.push(`Capacity allows ${args.commitGating.allowedNewCommits} gated commits`);
  }

  const summary = `handoff=${shouldSignalHandoff} allowed=${args.commitGating.allowedNewCommits} hold=${args.resumptionPlan.shouldHoldNewCommits}`;

  return {
    turn: args.turn,
    shouldSignalHandoff,
    queuedResumptionActions: args.resumptionPlan.actions.length,
    allowedNewCommits: args.commitGating.allowedNewCommits,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
