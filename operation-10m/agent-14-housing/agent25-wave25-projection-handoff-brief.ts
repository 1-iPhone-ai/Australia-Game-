import type {
  Agent25Wave25ProjectionHandoffBrief,
  Wave25GateTrajectorySnapshot,
  Wave25IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave25ProjectionHandoffBrief(args: {
  turn: number;
  wave25IntegrationMonitor: Wave25IntegrationMonitor;
  wave25GateTrajectory?: Wave25GateTrajectorySnapshot;
}): Agent25Wave25ProjectionHandoffBrief {
  const shouldProjectWave25 =
    args.wave25IntegrationMonitor.shouldRunO10m182DryRun &&
    args.wave25GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave25) {
    headlines.push('Agent 25: project wave 25 module gate / O10-182 dry-run');
  } else {
    headlines.push('Agent 25 wave 25 projection deferred — integration gate not stable');
  }
  if (args.wave25GateTrajectory?.band === 'ready') {
    headlines.push('Wave 25 gate trajectory ready for O10-182 projection handoff');
  }
  if (args.wave25IntegrationMonitor.wave25GateBand === 'blocked') {
    headlines.push('Wave 25 gate blocked — hold O10-182 handoff');
  }

  const summary = `project=${shouldProjectWave25} o10m182=${args.wave25IntegrationMonitor.shouldRunO10m182DryRun} band=${args.wave25GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave25,
    shouldRunO10m182DryRun: args.wave25IntegrationMonitor.shouldRunO10m182DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
