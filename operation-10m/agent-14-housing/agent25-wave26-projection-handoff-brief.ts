import type {
  Agent25Wave26ProjectionHandoffBrief,
  Wave26GateTrajectorySnapshot,
  Wave26IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave26ProjectionHandoffBrief(args: {
  turn: number;
  wave26IntegrationMonitor: Wave26IntegrationMonitor;
  wave26GateTrajectory?: Wave26GateTrajectorySnapshot;
}): Agent25Wave26ProjectionHandoffBrief {
  const shouldProjectWave26 =
    args.wave26IntegrationMonitor.shouldRunO10m184DryRun &&
    args.wave26GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave26) {
    headlines.push('Agent 25: project wave 26 module gate / O10-184 dry-run');
  } else {
    headlines.push('Agent 25 wave 26 projection deferred — integration gate not stable');
  }
  if (args.wave26GateTrajectory?.band === 'ready') {
    headlines.push('Wave 26 gate trajectory ready for O10-184 projection handoff');
  }
  if (args.wave26IntegrationMonitor.wave26GateBand === 'blocked') {
    headlines.push('Wave 26 gate blocked — hold O10-184 handoff');
  }

  const summary = `project=${shouldProjectWave26} o10m184=${args.wave26IntegrationMonitor.shouldRunO10m184DryRun} band=${args.wave26GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave26,
    shouldRunO10m184DryRun: args.wave26IntegrationMonitor.shouldRunO10m184DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
