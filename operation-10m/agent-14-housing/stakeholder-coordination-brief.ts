import type {
  GovernanceTrajectorySnapshot,
  ReliefDispatchPlan,
  StakeholderCoordinationBrief,
  WellbeingGovernancePanel,
} from './types.ts';

export function composeStakeholderCoordinationBrief(args: {
  turn: number;
  governancePanel: WellbeingGovernancePanel;
  governanceTrajectory?: GovernanceTrajectorySnapshot;
  reliefDispatchPlan: ReliefDispatchPlan;
}): StakeholderCoordinationBrief {
  const trajectory = args.governanceTrajectory?.trajectory ?? 'flat';
  const reliefActions = args.reliefDispatchPlan.actions.length;
  const shouldEngageStakeholders =
    args.governancePanel.band === 'crisis' ||
    args.governancePanel.band === 'misaligned' ||
    trajectory === 'deteriorating' ||
    args.reliefDispatchPlan.shouldHoldCommits ||
    reliefActions >= 3;

  const headlines: string[] = [];
  if (shouldEngageStakeholders) {
    headlines.push('Stakeholder coordination recommended this turn');
  } else {
    headlines.push('Routine stakeholder touchpoints sufficient');
  }
  if (args.reliefDispatchPlan.shouldHoldCommits) {
    headlines.push('Hold portfolio commits until relief dispatch clears');
  }
  if (trajectory === 'improving' && args.governancePanel.band === 'aligned') {
    headlines.push('Governance trajectory improving — reduce escalation cadence');
  }

  const summary = `${args.governancePanel.band} governance / ${trajectory} trajectory — ${reliefActions} relief actions, engage=${shouldEngageStakeholders}`;

  return {
    turn: args.turn,
    governanceBand: args.governancePanel.band,
    trajectory,
    reliefActions,
    shouldEngageStakeholders,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
