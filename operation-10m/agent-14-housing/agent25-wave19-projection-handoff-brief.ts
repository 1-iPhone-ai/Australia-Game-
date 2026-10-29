import type {
  Agent25Wave19ProjectionHandoffBrief,
  Wave19GateTrajectorySnapshot,
  Wave19IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave19ProjectionHandoffBrief(args: {
  turn: number;
  wave19IntegrationMonitor: Wave19IntegrationMonitor;
  wave19GateTrajectory?: Wave19GateTrajectorySnapshot;
}): Agent25Wave19ProjectionHandoffBrief {
  const shouldProjectWave19 =
    args.wave19IntegrationMonitor.shouldRunO10m169DryRun &&
    args.wave19GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave19) {
    headlines.push('Agent 25: project wave 19 module gate / O10-169 dry-run');
  } else {
    headlines.push('Agent 25 wave 19 projection deferred — integration gate not stable');
  }
  if (args.wave19GateTrajectory?.band === 'ready') {
    headlines.push('Wave 19 gate trajectory ready for O10-169 projection handoff');
  }
  if (args.wave19IntegrationMonitor.wave19GateBand === 'blocked') {
    headlines.push('Wave 19 gate blocked — hold O10-169 handoff');
  }

  const summary = `project=${shouldProjectWave19} o10m169=${args.wave19IntegrationMonitor.shouldRunO10m169DryRun} band=${args.wave19GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave19,
    shouldRunO10m169DryRun: args.wave19IntegrationMonitor.shouldRunO10m169DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
