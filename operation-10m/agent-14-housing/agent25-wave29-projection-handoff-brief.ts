import type {
  Agent25Wave29ProjectionHandoffBrief,
  Wave29GateTrajectorySnapshot,
  Wave29IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave29ProjectionHandoffBrief(args: {
  turn: number;
  wave29IntegrationMonitor: Wave29IntegrationMonitor;
  wave29GateTrajectory?: Wave29GateTrajectorySnapshot;
}): Agent25Wave29ProjectionHandoffBrief {
  const shouldProjectWave29 =
    args.wave29IntegrationMonitor.shouldRunO10m190DryRun &&
    args.wave29GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave29) {
    headlines.push('Agent 25: project wave 29 module gate / O10-190 dry-run');
  } else {
    headlines.push('Agent 25 wave 29 projection deferred — integration gate not stable');
  }
  if (args.wave29GateTrajectory?.band === 'ready') {
    headlines.push('Wave 29 gate trajectory ready for O10-190 projection handoff');
  }
  if (args.wave29IntegrationMonitor.wave29GateBand === 'blocked') {
    headlines.push('Wave 29 gate blocked — hold O10-190 handoff');
  }

  const summary = `project=${shouldProjectWave29} o10m190=${args.wave29IntegrationMonitor.shouldRunO10m190DryRun} band=${args.wave29GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave29,
    shouldRunO10m190DryRun: args.wave29IntegrationMonitor.shouldRunO10m190DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
