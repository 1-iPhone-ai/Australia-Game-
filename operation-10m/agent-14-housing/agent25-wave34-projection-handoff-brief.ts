import type {
  Agent25Wave34ProjectionHandoffBrief,
  Wave34GateTrajectorySnapshot,
  Wave34IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave34ProjectionHandoffBrief(args: {
  turn: number;
  wave34IntegrationMonitor: Wave34IntegrationMonitor;
  wave34GateTrajectory?: Wave34GateTrajectorySnapshot;
}): Agent25Wave34ProjectionHandoffBrief {
  const shouldProjectWave34 =
    args.wave34IntegrationMonitor.shouldRunO10m200DryRun &&
    args.wave34GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave34) {
    headlines.push('Agent 25: project wave 34 module gate / O10-200 dry-run');
  } else {
    headlines.push('Agent 25 wave 34 projection deferred — integration gate not stable');
  }
  if (args.wave34GateTrajectory?.band === 'ready') {
    headlines.push('Wave 34 gate trajectory ready for O10-200 projection handoff');
  }
  if (args.wave34IntegrationMonitor.wave34GateBand === 'blocked') {
    headlines.push('Wave 34 gate blocked — hold O10-200 handoff');
  }

  const summary = `project=${shouldProjectWave34} o10m200=${args.wave34IntegrationMonitor.shouldRunO10m200DryRun} band=${args.wave34GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave34,
    shouldRunO10m200DryRun: args.wave34IntegrationMonitor.shouldRunO10m200DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
