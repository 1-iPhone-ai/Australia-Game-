import type {
  Agent25Wave27ProjectionHandoffBrief,
  Wave27GateTrajectorySnapshot,
  Wave27IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave27ProjectionHandoffBrief(args: {
  turn: number;
  wave27IntegrationMonitor: Wave27IntegrationMonitor;
  wave27GateTrajectory?: Wave27GateTrajectorySnapshot;
}): Agent25Wave27ProjectionHandoffBrief {
  const shouldProjectWave27 =
    args.wave27IntegrationMonitor.shouldRunO10m186DryRun &&
    args.wave27GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave27) {
    headlines.push('Agent 25: project wave 27 module gate / O10-186 dry-run');
  } else {
    headlines.push('Agent 25 wave 27 projection deferred — integration gate not stable');
  }
  if (args.wave27GateTrajectory?.band === 'ready') {
    headlines.push('Wave 27 gate trajectory ready for O10-186 projection handoff');
  }
  if (args.wave27IntegrationMonitor.wave27GateBand === 'blocked') {
    headlines.push('Wave 27 gate blocked — hold O10-186 handoff');
  }

  const summary = `project=${shouldProjectWave27} o10m186=${args.wave27IntegrationMonitor.shouldRunO10m186DryRun} band=${args.wave27GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave27,
    shouldRunO10m186DryRun: args.wave27IntegrationMonitor.shouldRunO10m186DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
