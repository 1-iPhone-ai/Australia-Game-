import type {
  Agent25Wave58ProjectionHandoffBrief,
  Wave58GateTrajectorySnapshot,
  Wave58IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave58ProjectionHandoffBrief(args: {
  turn: number;
  wave58IntegrationMonitor: Wave58IntegrationMonitor;
  wave58GateTrajectory?: Wave58GateTrajectorySnapshot;
}): Agent25Wave58ProjectionHandoffBrief {
  const shouldProjectWave58 =
    args.wave58IntegrationMonitor.shouldRunO10m260DryRun &&
    args.wave58GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave58) {
    headlines.push('Agent 25: project wave 57 module gate / O10-260 dry-run');
  } else {
    headlines.push('Agent 25 wave 57 projection deferred — integration gate not stable');
  }
  if (args.wave58GateTrajectory?.band === 'ready') {
    headlines.push('Wave 58 gate trajectory ready for O10-260 projection handoff');
  }
  if (args.wave58IntegrationMonitor.wave58GateBand === 'blocked') {
    headlines.push('Wave 58 gate blocked — hold O10-260 handoff');
  }

  const summary = `project=${shouldProjectWave58} o10m257=${args.wave58IntegrationMonitor.shouldRunO10m260DryRun} band=${args.wave58GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave58,
    shouldRunO10m260DryRun: args.wave58IntegrationMonitor.shouldRunO10m260DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
