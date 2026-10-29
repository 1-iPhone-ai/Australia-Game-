import type {
  Agent25Wave24ProjectionHandoffBrief,
  Wave24GateTrajectorySnapshot,
  Wave24IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave24ProjectionHandoffBrief(args: {
  turn: number;
  wave24IntegrationMonitor: Wave24IntegrationMonitor;
  wave24GateTrajectory?: Wave24GateTrajectorySnapshot;
}): Agent25Wave24ProjectionHandoffBrief {
  const shouldProjectWave24 =
    args.wave24IntegrationMonitor.shouldRunO10m180DryRun &&
    args.wave24GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave24) {
    headlines.push('Agent 25: project wave 24 module gate / O10-180 dry-run');
  } else {
    headlines.push('Agent 25 wave 24 projection deferred — integration gate not stable');
  }
  if (args.wave24GateTrajectory?.band === 'ready') {
    headlines.push('Wave 24 gate trajectory ready for O10-180 projection handoff');
  }
  if (args.wave24IntegrationMonitor.wave24GateBand === 'blocked') {
    headlines.push('Wave 24 gate blocked — hold O10-180 handoff');
  }

  const summary = `project=${shouldProjectWave24} o10m180=${args.wave24IntegrationMonitor.shouldRunO10m180DryRun} band=${args.wave24GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave24,
    shouldRunO10m180DryRun: args.wave24IntegrationMonitor.shouldRunO10m180DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
