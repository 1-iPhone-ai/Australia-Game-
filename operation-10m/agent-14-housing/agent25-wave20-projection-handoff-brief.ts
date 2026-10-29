import type {
  Agent25Wave20ProjectionHandoffBrief,
  Wave20GateTrajectorySnapshot,
  Wave20IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave20ProjectionHandoffBrief(args: {
  turn: number;
  wave20IntegrationMonitor: Wave20IntegrationMonitor;
  wave20GateTrajectory?: Wave20GateTrajectorySnapshot;
}): Agent25Wave20ProjectionHandoffBrief {
  const shouldProjectWave20 =
    args.wave20IntegrationMonitor.shouldRunO10m171DryRun &&
    args.wave20GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave20) {
    headlines.push('Agent 25: project wave 20 module gate / O10-171 dry-run');
  } else {
    headlines.push('Agent 25 wave 20 projection deferred — tranche gate not stable');
  }
  if (args.wave20GateTrajectory?.band === 'ready') {
    headlines.push('Wave 20 gate trajectory ready for O10-171 projection handoff');
  }
  if (args.wave20IntegrationMonitor.wave20GateBand === 'blocked') {
    headlines.push('Wave 20 gate blocked — hold O10-171 handoff');
  }

  const summary = `project=${shouldProjectWave20} o10m171=${args.wave20IntegrationMonitor.shouldRunO10m171DryRun} band=${args.wave20GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave20,
    shouldRunO10m171DryRun: args.wave20IntegrationMonitor.shouldRunO10m171DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
