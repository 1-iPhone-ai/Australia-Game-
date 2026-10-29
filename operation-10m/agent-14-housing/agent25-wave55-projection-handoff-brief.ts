import type {
  Agent25Wave55ProjectionHandoffBrief,
  Wave55GateTrajectorySnapshot,
  Wave55IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave55ProjectionHandoffBrief(args: {
  turn: number;
  wave55IntegrationMonitor: Wave55IntegrationMonitor;
  wave55GateTrajectory?: Wave55GateTrajectorySnapshot;
}): Agent25Wave55ProjectionHandoffBrief {
  const shouldProjectWave55 =
    args.wave55IntegrationMonitor.shouldRunO10m247DryRun &&
    args.wave55GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave55) {
    headlines.push('Agent 25: project wave 55 module gate / O10-247 dry-run');
  } else {
    headlines.push('Agent 25 wave 55 projection deferred — integration gate not stable');
  }
  if (args.wave55GateTrajectory?.band === 'ready') {
    headlines.push('Wave 55 gate trajectory ready for O10-247 projection handoff');
  }
  if (args.wave55IntegrationMonitor.wave55GateBand === 'blocked') {
    headlines.push('Wave 55 gate blocked — hold O10-247 handoff');
  }

  const summary = `project=${shouldProjectWave55} o10m247=${args.wave55IntegrationMonitor.shouldRunO10m247DryRun} band=${args.wave55GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave55,
    shouldRunO10m247DryRun: args.wave55IntegrationMonitor.shouldRunO10m247DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
