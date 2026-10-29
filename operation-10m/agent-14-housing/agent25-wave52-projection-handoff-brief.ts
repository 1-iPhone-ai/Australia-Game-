import type {
  Agent25Wave52ProjectionHandoffBrief,
  Wave52GateTrajectorySnapshot,
  Wave52IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave52ProjectionHandoffBrief(args: {
  turn: number;
  wave52IntegrationMonitor: Wave52IntegrationMonitor;
  wave52GateTrajectory?: Wave52GateTrajectorySnapshot;
}): Agent25Wave52ProjectionHandoffBrief {
  const shouldProjectWave52 =
    args.wave52IntegrationMonitor.shouldRunO10m233DryRun &&
    args.wave52GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave52) {
    headlines.push('Agent 25: project wave 52 module gate / O10-233 dry-run');
  } else {
    headlines.push('Agent 25 wave 52 projection deferred — integration gate not stable');
  }
  if (args.wave52GateTrajectory?.band === 'ready') {
    headlines.push('Wave 52 gate trajectory ready for O10-235 projection handoff');
  }
  if (args.wave52IntegrationMonitor.wave52GateBand === 'blocked') {
    headlines.push('Wave 52 gate blocked — hold O10-235 handoff');
  }

  const summary = `project=${shouldProjectWave52} o10m233=${args.wave52IntegrationMonitor.shouldRunO10m233DryRun} band=${args.wave52GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave52,
    shouldRunO10m233DryRun: args.wave52IntegrationMonitor.shouldRunO10m233DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
