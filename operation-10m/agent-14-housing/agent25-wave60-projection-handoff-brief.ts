import type {
  Agent25Wave60ProjectionHandoffBrief,
  Wave60GateTrajectorySnapshot,
  Wave60IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave60ProjectionHandoffBrief(args: {
  turn: number;
  wave60IntegrationMonitor: Wave60IntegrationMonitor;
  wave60GateTrajectory?: Wave60GateTrajectorySnapshot;
}): Agent25Wave60ProjectionHandoffBrief {
  const shouldProjectWave60 =
    args.wave60IntegrationMonitor.shouldRunO10m265DryRun &&
    args.wave60GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave60) {
    headlines.push('Agent 25: project wave 57 module gate / O10-265 dry-run');
  } else {
    headlines.push('Agent 25 wave 57 projection deferred — integration gate not stable');
  }
  if (args.wave60GateTrajectory?.band === 'ready') {
    headlines.push('Wave 60 gate trajectory ready for O10-265 projection handoff');
  }
  if (args.wave60IntegrationMonitor.wave60GateBand === 'blocked') {
    headlines.push('Wave 60 gate blocked — hold O10-265 handoff');
  }

  const summary = `project=${shouldProjectWave60} o10m257=${args.wave60IntegrationMonitor.shouldRunO10m265DryRun} band=${args.wave60GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave60,
    shouldRunO10m265DryRun: args.wave60IntegrationMonitor.shouldRunO10m265DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
