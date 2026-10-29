import type {
  Agent25Wave35ProjectionHandoffBrief,
  Wave35GateTrajectorySnapshot,
  Wave35IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave35ProjectionHandoffBrief(args: {
  turn: number;
  wave35IntegrationMonitor: Wave35IntegrationMonitor;
  wave35GateTrajectory?: Wave35GateTrajectorySnapshot;
}): Agent25Wave35ProjectionHandoffBrief {
  const shouldProjectWave35 =
    args.wave35IntegrationMonitor.shouldRunO10m202DryRun &&
    args.wave35GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave35) {
    headlines.push('Agent 25: project wave 35 module gate / O10-202 dry-run');
  } else {
    headlines.push('Agent 25 wave 35 projection deferred — integration gate not stable');
  }
  if (args.wave35GateTrajectory?.band === 'ready') {
    headlines.push('Wave 35 gate trajectory ready for O10-202 projection handoff');
  }
  if (args.wave35IntegrationMonitor.wave35GateBand === 'blocked') {
    headlines.push('Wave 35 gate blocked — hold O10-202 handoff');
  }

  const summary = `project=${shouldProjectWave35} o10m202=${args.wave35IntegrationMonitor.shouldRunO10m202DryRun} band=${args.wave35GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave35,
    shouldRunO10m202DryRun: args.wave35IntegrationMonitor.shouldRunO10m202DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
