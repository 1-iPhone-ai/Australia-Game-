import type {
  CoordinationTrajectorySnapshot,
  GovernanceTrajectorySnapshot,
  PortfolioStabilizationBrief,
  PortfolioStabilizationPath,
  ReliefExecutionMonitor,
  StakeholderCoordinationBrief,
} from './types.ts';

function resolvePath(
  execution: ReliefExecutionMonitor,
  coordination?: CoordinationTrajectorySnapshot,
  governance?: GovernanceTrajectorySnapshot
): PortfolioStabilizationPath {
  if (execution.shouldEscalateExecution || execution.backlogPressure >= 1.5) {
    return 'blocked';
  }
  if (
    coordination?.band === 'escalation' ||
    governance?.trajectory === 'deteriorating' ||
    execution.immediateDue >= 1
  ) {
    return 'watch';
  }
  return 'clear';
}

export function composePortfolioStabilizationBrief(args: {
  turn: number;
  reliefExecutionMonitor: ReliefExecutionMonitor;
  stakeholderBrief: StakeholderCoordinationBrief;
  coordinationTrajectory?: CoordinationTrajectorySnapshot;
  governanceTrajectory?: GovernanceTrajectorySnapshot;
}): PortfolioStabilizationBrief {
  const stabilizationPath = resolvePath(
    args.reliefExecutionMonitor,
    args.coordinationTrajectory,
    args.governanceTrajectory
  );
  const shouldPausePortfolioGrowth =
    stabilizationPath === 'blocked' ||
    args.reliefExecutionMonitor.shouldEscalateExecution ||
    args.stakeholderBrief.shouldEngageStakeholders;

  const headlines: string[] = [];
  if (stabilizationPath === 'blocked') {
    headlines.push('Portfolio stabilization blocked — defer growth commits');
  } else if (stabilizationPath === 'watch') {
    headlines.push('Portfolio stabilization on watch — sequence relief first');
  } else {
    headlines.push('Portfolio stabilization path clear');
  }
  if (args.coordinationTrajectory?.band === 'escalation') {
    headlines.push('Coordination pressure elevated — tighten cadence');
  }
  if (args.governanceTrajectory?.band === 'aligned' && stabilizationPath === 'clear') {
    headlines.push('Governance aligned — resume normal portfolio pacing');
  }

  const summary = `${stabilizationPath} path / execution escalate=${args.reliefExecutionMonitor.shouldEscalateExecution} pause=${shouldPausePortfolioGrowth}`;

  return {
    turn: args.turn,
    stabilizationPath,
    shouldPausePortfolioGrowth,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
