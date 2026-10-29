import type {
  Agent25Wave41ProjectionHandoffBrief,
  Wave41GateTrajectorySnapshot,
  Wave41IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave41ProjectionHandoffBrief(args: {
  turn: number;
  wave41IntegrationMonitor: Wave41IntegrationMonitor;
  wave41GateTrajectory?: Wave41GateTrajectorySnapshot;
}): Agent25Wave41ProjectionHandoffBrief {
  const shouldProjectWave41 =
    args.wave41IntegrationMonitor.shouldRunO10m214DryRun &&
    args.wave41GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave41) {
    headlines.push('Agent 25: project wave 41 module gate / O10-214 dry-run');
  } else {
    headlines.push('Agent 25 wave 41 projection deferred — integration gate not stable');
  }
  if (args.wave41GateTrajectory?.band === 'ready') {
    headlines.push('Wave 41 gate trajectory ready for O10-214 projection handoff');
  }
  if (args.wave41IntegrationMonitor.wave41GateBand === 'blocked') {
    headlines.push('Wave 41 gate blocked — hold O10-214 handoff');
  }

  const summary = `project=${shouldProjectWave41} o10m214=${args.wave41IntegrationMonitor.shouldRunO10m214DryRun} band=${args.wave41GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave41,
    shouldRunO10m214DryRun: args.wave41IntegrationMonitor.shouldRunO10m214DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
