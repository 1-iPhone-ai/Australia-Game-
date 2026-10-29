import type {
  Agent25Wave37ProjectionHandoffBrief,
  Wave37GateTrajectorySnapshot,
  Wave37IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave37ProjectionHandoffBrief(args: {
  turn: number;
  wave37IntegrationMonitor: Wave37IntegrationMonitor;
  wave37GateTrajectory?: Wave37GateTrajectorySnapshot;
}): Agent25Wave37ProjectionHandoffBrief {
  const shouldProjectWave37 =
    args.wave37IntegrationMonitor.shouldRunO10m206DryRun &&
    args.wave37GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave37) {
    headlines.push('Agent 25: project wave 37 module gate / O10-206 dry-run');
  } else {
    headlines.push('Agent 25 wave 37 projection deferred — integration gate not stable');
  }
  if (args.wave37GateTrajectory?.band === 'ready') {
    headlines.push('Wave 37 gate trajectory ready for O10-206 projection handoff');
  }
  if (args.wave37IntegrationMonitor.wave37GateBand === 'blocked') {
    headlines.push('Wave 37 gate blocked — hold O10-206 handoff');
  }

  const summary = `project=${shouldProjectWave37} o10m206=${args.wave37IntegrationMonitor.shouldRunO10m206DryRun} band=${args.wave37GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave37,
    shouldRunO10m206DryRun: args.wave37IntegrationMonitor.shouldRunO10m206DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
