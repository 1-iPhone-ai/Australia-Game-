import type {
  Agent25Wave38ProjectionHandoffBrief,
  Wave38GateTrajectorySnapshot,
  Wave38IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave38ProjectionHandoffBrief(args: {
  turn: number;
  wave38IntegrationMonitor: Wave38IntegrationMonitor;
  wave38GateTrajectory?: Wave38GateTrajectorySnapshot;
}): Agent25Wave38ProjectionHandoffBrief {
  const shouldProjectWave38 =
    args.wave38IntegrationMonitor.shouldRunO10m208DryRun &&
    args.wave38GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave38) {
    headlines.push('Agent 25: project wave 38 module gate / O10-208 dry-run');
  } else {
    headlines.push('Agent 25 wave 38 projection deferred — integration gate not stable');
  }
  if (args.wave38GateTrajectory?.band === 'ready') {
    headlines.push('Wave 38 gate trajectory ready for O10-208 projection handoff');
  }
  if (args.wave38IntegrationMonitor.wave38GateBand === 'blocked') {
    headlines.push('Wave 38 gate blocked — hold O10-208 handoff');
  }

  const summary = `project=${shouldProjectWave38} o10m208=${args.wave38IntegrationMonitor.shouldRunO10m208DryRun} band=${args.wave38GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave38,
    shouldRunO10m208DryRun: args.wave38IntegrationMonitor.shouldRunO10m208DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
