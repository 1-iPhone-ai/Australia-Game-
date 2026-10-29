import type {
  Agent25Wave53ProjectionHandoffBrief,
  Wave53GateTrajectorySnapshot,
  Wave53IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave53ProjectionHandoffBrief(args: {
  turn: number;
  wave53IntegrationMonitor: Wave53IntegrationMonitor;
  wave53GateTrajectory?: Wave53GateTrajectorySnapshot;
}): Agent25Wave53ProjectionHandoffBrief {
  const shouldProjectWave53 =
    args.wave53IntegrationMonitor.shouldRunO10m237DryRun &&
    args.wave53GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave53) {
    headlines.push('Agent 25: project wave 53 module gate / O10-237 dry-run');
  } else {
    headlines.push('Agent 25 wave 53 projection deferred — integration gate not stable');
  }
  if (args.wave53GateTrajectory?.band === 'ready') {
    headlines.push('Wave 53 gate trajectory ready for O10-237 projection handoff');
  }
  if (args.wave53IntegrationMonitor.wave53GateBand === 'blocked') {
    headlines.push('Wave 53 gate blocked — hold O10-237 handoff');
  }

  const summary = `project=${shouldProjectWave53} o10m237=${args.wave53IntegrationMonitor.shouldRunO10m237DryRun} band=${args.wave53GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave53,
    shouldRunO10m237DryRun: args.wave53IntegrationMonitor.shouldRunO10m237DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
