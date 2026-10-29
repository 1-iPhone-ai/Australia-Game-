import type {
  Agent25Wave43ProjectionHandoffBrief,
  Wave43GateTrajectorySnapshot,
  Wave43IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave43ProjectionHandoffBrief(args: {
  turn: number;
  wave43IntegrationMonitor: Wave43IntegrationMonitor;
  wave43GateTrajectory?: Wave43GateTrajectorySnapshot;
}): Agent25Wave43ProjectionHandoffBrief {
  const shouldProjectWave43 =
    args.wave43IntegrationMonitor.shouldRunO10m218DryRun &&
    args.wave43GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave43) {
    headlines.push('Agent 25: project wave 43 module gate / O10-218 dry-run');
  } else {
    headlines.push('Agent 25 wave 43 projection deferred — integration gate not stable');
  }
  if (args.wave43GateTrajectory?.band === 'ready') {
    headlines.push('Wave 43 gate trajectory ready for O10-218 projection handoff');
  }
  if (args.wave43IntegrationMonitor.wave43GateBand === 'blocked') {
    headlines.push('Wave 43 gate blocked — hold O10-218 handoff');
  }

  const summary = `project=${shouldProjectWave43} o10m218=${args.wave43IntegrationMonitor.shouldRunO10m218DryRun} band=${args.wave43GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave43,
    shouldRunO10m218DryRun: args.wave43IntegrationMonitor.shouldRunO10m218DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
