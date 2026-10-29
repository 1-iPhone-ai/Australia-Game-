import type {
  Agent25Wave42ProjectionHandoffBrief,
  Wave42GateTrajectorySnapshot,
  Wave42IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave42ProjectionHandoffBrief(args: {
  turn: number;
  wave42IntegrationMonitor: Wave42IntegrationMonitor;
  wave42GateTrajectory?: Wave42GateTrajectorySnapshot;
}): Agent25Wave42ProjectionHandoffBrief {
  const shouldProjectWave42 =
    args.wave42IntegrationMonitor.shouldRunO10m216DryRun &&
    args.wave42GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave42) {
    headlines.push('Agent 25: project wave 42 module gate / O10-216 dry-run');
  } else {
    headlines.push('Agent 25 wave 42 projection deferred — integration gate not stable');
  }
  if (args.wave42GateTrajectory?.band === 'ready') {
    headlines.push('Wave 42 gate trajectory ready for O10-216 projection handoff');
  }
  if (args.wave42IntegrationMonitor.wave42GateBand === 'blocked') {
    headlines.push('Wave 42 gate blocked — hold O10-216 handoff');
  }

  const summary = `project=${shouldProjectWave42} o10m216=${args.wave42IntegrationMonitor.shouldRunO10m216DryRun} band=${args.wave42GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave42,
    shouldRunO10m216DryRun: args.wave42IntegrationMonitor.shouldRunO10m216DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
