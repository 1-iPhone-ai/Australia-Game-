import type {
  Agent25Wave48ProjectionHandoffBrief,
  Wave48GateTrajectorySnapshot,
  Wave48IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave48ProjectionHandoffBrief(args: {
  turn: number;
  wave48IntegrationMonitor: Wave48IntegrationMonitor;
  wave48GateTrajectory?: Wave48GateTrajectorySnapshot;
}): Agent25Wave48ProjectionHandoffBrief {
  const shouldProjectWave48 =
    args.wave48IntegrationMonitor.shouldRunO10m226DryRun &&
    args.wave48GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave48) {
    headlines.push('Agent 25: project wave 48 module gate / O10-226 dry-run');
  } else {
    headlines.push('Agent 25 wave 48 projection deferred — integration gate not stable');
  }
  if (args.wave48GateTrajectory?.band === 'ready') {
    headlines.push('Wave 48 gate trajectory ready for O10-226 projection handoff');
  }
  if (args.wave48IntegrationMonitor.wave48GateBand === 'blocked') {
    headlines.push('Wave 48 gate blocked — hold O10-226 handoff');
  }

  const summary = `project=${shouldProjectWave48} o10m226=${args.wave48IntegrationMonitor.shouldRunO10m226DryRun} band=${args.wave48GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave48,
    shouldRunO10m226DryRun: args.wave48IntegrationMonitor.shouldRunO10m226DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
