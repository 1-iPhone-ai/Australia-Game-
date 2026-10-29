import type {
  Agent25Wave44ProjectionHandoffBrief,
  Wave44GateTrajectorySnapshot,
  Wave44IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave44ProjectionHandoffBrief(args: {
  turn: number;
  wave44IntegrationMonitor: Wave44IntegrationMonitor;
  wave44GateTrajectory?: Wave44GateTrajectorySnapshot;
}): Agent25Wave44ProjectionHandoffBrief {
  const shouldProjectWave44 =
    args.wave44IntegrationMonitor.shouldRunO10m220DryRun &&
    args.wave44GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave44) {
    headlines.push('Agent 25: project wave 44 module gate / O10-220 dry-run');
  } else {
    headlines.push('Agent 25 wave 44 projection deferred — integration gate not stable');
  }
  if (args.wave44GateTrajectory?.band === 'ready') {
    headlines.push('Wave 44 gate trajectory ready for O10-220 projection handoff');
  }
  if (args.wave44IntegrationMonitor.wave44GateBand === 'blocked') {
    headlines.push('Wave 44 gate blocked — hold O10-220 handoff');
  }

  const summary = `project=${shouldProjectWave44} o10m220=${args.wave44IntegrationMonitor.shouldRunO10m220DryRun} band=${args.wave44GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave44,
    shouldRunO10m220DryRun: args.wave44IntegrationMonitor.shouldRunO10m220DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
