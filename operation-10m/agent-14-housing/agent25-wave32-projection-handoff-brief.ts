import type {
  Agent25Wave32ProjectionHandoffBrief,
  Wave32GateTrajectorySnapshot,
  Wave32IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave32ProjectionHandoffBrief(args: {
  turn: number;
  wave32IntegrationMonitor: Wave32IntegrationMonitor;
  wave32GateTrajectory?: Wave32GateTrajectorySnapshot;
}): Agent25Wave32ProjectionHandoffBrief {
  const shouldProjectWave32 =
    args.wave32IntegrationMonitor.shouldRunO10m196DryRun &&
    args.wave32GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave32) {
    headlines.push('Agent 25: project wave 32 module gate / O10-196 dry-run');
  } else {
    headlines.push('Agent 25 wave 32 projection deferred — integration gate not stable');
  }
  if (args.wave32GateTrajectory?.band === 'ready') {
    headlines.push('Wave 32 gate trajectory ready for O10-196 projection handoff');
  }
  if (args.wave32IntegrationMonitor.wave32GateBand === 'blocked') {
    headlines.push('Wave 32 gate blocked — hold O10-196 handoff');
  }

  const summary = `project=${shouldProjectWave32} o10m196=${args.wave32IntegrationMonitor.shouldRunO10m196DryRun} band=${args.wave32GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave32,
    shouldRunO10m196DryRun: args.wave32IntegrationMonitor.shouldRunO10m196DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
