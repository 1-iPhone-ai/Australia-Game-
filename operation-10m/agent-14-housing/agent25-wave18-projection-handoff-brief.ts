import type {
  Agent25Wave18ProjectionHandoffBrief,
  ProjectionGateTrajectorySnapshot,
  Wave18ProjectionMonitor,
} from './types.ts';

export function composeAgent25Wave18ProjectionHandoffBrief(args: {
  turn: number;
  wave18ProjectionMonitor: Wave18ProjectionMonitor;
  projectionGateTrajectory?: ProjectionGateTrajectorySnapshot;
}): Agent25Wave18ProjectionHandoffBrief {
  const shouldProjectWave18 =
    args.wave18ProjectionMonitor.shouldRunO10m167DryRun &&
    args.projectionGateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave18) {
    headlines.push('Agent 25: project wave 18 module gate / O10-167 dry-run');
  } else {
    headlines.push('Agent 25 wave 18 projection deferred — gate path not stable');
  }
  if (args.projectionGateTrajectory?.band === 'ready') {
    headlines.push('Projection gate trajectory ready for O10-167 integration handoff');
  }
  if (args.wave18ProjectionMonitor.projectionGateBand === 'blocked') {
    headlines.push('Projection gate blocked — hold O10-167 handoff');
  }

  const summary = `project=${shouldProjectWave18} o10m167=${args.wave18ProjectionMonitor.shouldRunO10m167DryRun} band=${args.projectionGateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave18,
    shouldRunO10m167DryRun: args.wave18ProjectionMonitor.shouldRunO10m167DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
