import type {
  Agent25Wave51ProjectionHandoffBrief,
  Wave51GateTrajectorySnapshot,
  Wave51IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave51ProjectionHandoffBrief(args: {
  turn: number;
  wave51IntegrationMonitor: Wave51IntegrationMonitor;
  wave51GateTrajectory?: Wave51GateTrajectorySnapshot;
}): Agent25Wave51ProjectionHandoffBrief {
  const shouldProjectWave51 =
    args.wave51IntegrationMonitor.shouldRunO10m231DryRun &&
    args.wave51GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave51) {
    headlines.push('Agent 25: project wave 51 module gate / O10-231 dry-run');
  } else {
    headlines.push('Agent 25 wave 51 projection deferred — integration gate not stable');
  }
  if (args.wave51GateTrajectory?.band === 'ready') {
    headlines.push('Wave 51 gate trajectory ready for O10-233 projection handoff');
  }
  if (args.wave51IntegrationMonitor.wave51GateBand === 'blocked') {
    headlines.push('Wave 51 gate blocked — hold O10-233 handoff');
  }

  const summary = `project=${shouldProjectWave51} o10m231=${args.wave51IntegrationMonitor.shouldRunO10m231DryRun} band=${args.wave51GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave51,
    shouldRunO10m231DryRun: args.wave51IntegrationMonitor.shouldRunO10m231DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
