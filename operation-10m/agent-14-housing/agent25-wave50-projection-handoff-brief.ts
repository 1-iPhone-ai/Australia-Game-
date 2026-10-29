import type {
  Agent25Wave50ProjectionHandoffBrief,
  Wave50GateTrajectorySnapshot,
  Wave50IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave50ProjectionHandoffBrief(args: {
  turn: number;
  wave50IntegrationMonitor: Wave50IntegrationMonitor;
  wave50GateTrajectory?: Wave50GateTrajectorySnapshot;
}): Agent25Wave50ProjectionHandoffBrief {
  const shouldProjectWave50 =
    args.wave50IntegrationMonitor.shouldRunO10m229DryRun &&
    args.wave50GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave50) {
    headlines.push('Agent 25: project wave 50 module gate / O10-229 dry-run');
  } else {
    headlines.push('Agent 25 wave 50 projection deferred — integration gate not stable');
  }
  if (args.wave50GateTrajectory?.band === 'ready') {
    headlines.push('Wave 50 gate trajectory ready for O10-231 projection handoff');
  }
  if (args.wave50IntegrationMonitor.wave50GateBand === 'blocked') {
    headlines.push('Wave 50 gate blocked — hold O10-231 handoff');
  }

  const summary = `project=${shouldProjectWave50} o10m229=${args.wave50IntegrationMonitor.shouldRunO10m229DryRun} band=${args.wave50GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave50,
    shouldRunO10m229DryRun: args.wave50IntegrationMonitor.shouldRunO10m229DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
