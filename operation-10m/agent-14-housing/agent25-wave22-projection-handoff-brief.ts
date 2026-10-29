import type {
  Agent25Wave22ProjectionHandoffBrief,
  Wave22GateTrajectorySnapshot,
  Wave22IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave22ProjectionHandoffBrief(args: {
  turn: number;
  wave22IntegrationMonitor: Wave22IntegrationMonitor;
  wave22GateTrajectory?: Wave22GateTrajectorySnapshot;
}): Agent25Wave22ProjectionHandoffBrief {
  const shouldProjectWave22 =
    args.wave22IntegrationMonitor.shouldRunO10m176DryRun &&
    args.wave22GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave22) {
    headlines.push('Agent 25: project wave 22 module gate / O10-176 dry-run');
  } else {
    headlines.push('Agent 25 wave 22 projection deferred — integration gate not stable');
  }
  if (args.wave22GateTrajectory?.band === 'ready') {
    headlines.push('Wave 22 gate trajectory ready for O10-176 projection handoff');
  }
  if (args.wave22IntegrationMonitor.wave22GateBand === 'blocked') {
    headlines.push('Wave 22 gate blocked — hold O10-176 handoff');
  }

  const summary = `project=${shouldProjectWave22} o10m176=${args.wave22IntegrationMonitor.shouldRunO10m176DryRun} band=${args.wave22GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave22,
    shouldRunO10m176DryRun: args.wave22IntegrationMonitor.shouldRunO10m176DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
