import type {
  Agent25Wave45ProjectionHandoffBrief,
  Wave45GateTrajectorySnapshot,
  Wave45IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave45ProjectionHandoffBrief(args: {
  turn: number;
  wave45IntegrationMonitor: Wave45IntegrationMonitor;
  wave45GateTrajectory?: Wave45GateTrajectorySnapshot;
}): Agent25Wave45ProjectionHandoffBrief {
  const shouldProjectWave45 =
    args.wave45IntegrationMonitor.shouldRunO10m222DryRun &&
    args.wave45GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave45) {
    headlines.push('Agent 25: project wave 45 module gate / O10-222 dry-run');
  } else {
    headlines.push('Agent 25 wave 45 projection deferred — integration gate not stable');
  }
  if (args.wave45GateTrajectory?.band === 'ready') {
    headlines.push('Wave 45 gate trajectory ready for O10-222 projection handoff');
  }
  if (args.wave45IntegrationMonitor.wave45GateBand === 'blocked') {
    headlines.push('Wave 45 gate blocked — hold O10-222 handoff');
  }

  const summary = `project=${shouldProjectWave45} o10m222=${args.wave45IntegrationMonitor.shouldRunO10m222DryRun} band=${args.wave45GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave45,
    shouldRunO10m222DryRun: args.wave45IntegrationMonitor.shouldRunO10m222DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
