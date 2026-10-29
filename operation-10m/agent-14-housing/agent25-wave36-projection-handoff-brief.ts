import type {
  Agent25Wave36ProjectionHandoffBrief,
  Wave36GateTrajectorySnapshot,
  Wave36IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave36ProjectionHandoffBrief(args: {
  turn: number;
  wave36IntegrationMonitor: Wave36IntegrationMonitor;
  wave36GateTrajectory?: Wave36GateTrajectorySnapshot;
}): Agent25Wave36ProjectionHandoffBrief {
  const shouldProjectWave36 =
    args.wave36IntegrationMonitor.shouldRunO10m204DryRun &&
    args.wave36GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave36) {
    headlines.push('Agent 25: project wave 36 module gate / O10-204 dry-run');
  } else {
    headlines.push('Agent 25 wave 36 projection deferred — integration gate not stable');
  }
  if (args.wave36GateTrajectory?.band === 'ready') {
    headlines.push('Wave 36 gate trajectory ready for O10-204 projection handoff');
  }
  if (args.wave36IntegrationMonitor.wave36GateBand === 'blocked') {
    headlines.push('Wave 36 gate blocked — hold O10-204 handoff');
  }

  const summary = `project=${shouldProjectWave36} o10m204=${args.wave36IntegrationMonitor.shouldRunO10m204DryRun} band=${args.wave36GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave36,
    shouldRunO10m204DryRun: args.wave36IntegrationMonitor.shouldRunO10m204DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
