import type {
  Agent25Wave31ProjectionHandoffBrief,
  Wave31GateTrajectorySnapshot,
  Wave31IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave31ProjectionHandoffBrief(args: {
  turn: number;
  wave31IntegrationMonitor: Wave31IntegrationMonitor;
  wave31GateTrajectory?: Wave31GateTrajectorySnapshot;
}): Agent25Wave31ProjectionHandoffBrief {
  const shouldProjectWave31 =
    args.wave31IntegrationMonitor.shouldRunO10m194DryRun &&
    args.wave31GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave31) {
    headlines.push('Agent 25: project wave 31 module gate / O10-194 dry-run');
  } else {
    headlines.push('Agent 25 wave 31 projection deferred — integration gate not stable');
  }
  if (args.wave31GateTrajectory?.band === 'ready') {
    headlines.push('Wave 31 gate trajectory ready for O10-194 projection handoff');
  }
  if (args.wave31IntegrationMonitor.wave31GateBand === 'blocked') {
    headlines.push('Wave 31 gate blocked — hold O10-194 handoff');
  }

  const summary = `project=${shouldProjectWave31} o10m194=${args.wave31IntegrationMonitor.shouldRunO10m194DryRun} band=${args.wave31GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave31,
    shouldRunO10m194DryRun: args.wave31IntegrationMonitor.shouldRunO10m194DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
