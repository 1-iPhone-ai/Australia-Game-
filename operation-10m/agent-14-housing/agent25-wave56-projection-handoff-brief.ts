import type {
  Agent25Wave56ProjectionHandoffBrief,
  Wave56GateTrajectorySnapshot,
  Wave56IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave56ProjectionHandoffBrief(args: {
  turn: number;
  wave56IntegrationMonitor: Wave56IntegrationMonitor;
  wave56GateTrajectory?: Wave56GateTrajectorySnapshot;
}): Agent25Wave56ProjectionHandoffBrief {
  const shouldProjectWave56 =
    args.wave56IntegrationMonitor.shouldRunO10m254DryRun &&
    args.wave56GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave56) {
    headlines.push('Agent 25: project wave 56 module gate / O10-254 dry-run');
  } else {
    headlines.push('Agent 25 wave 56 projection deferred — integration gate not stable');
  }
  if (args.wave56GateTrajectory?.band === 'ready') {
    headlines.push('Wave 56 gate trajectory ready for O10-254 projection handoff');
  }
  if (args.wave56IntegrationMonitor.wave56GateBand === 'blocked') {
    headlines.push('Wave 56 gate blocked — hold O10-254 handoff');
  }

  const summary = `project=${shouldProjectWave56} o10m254=${args.wave56IntegrationMonitor.shouldRunO10m254DryRun} band=${args.wave56GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave56,
    shouldRunO10m254DryRun: args.wave56IntegrationMonitor.shouldRunO10m254DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
