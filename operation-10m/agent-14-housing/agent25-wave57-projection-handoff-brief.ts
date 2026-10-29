import type {
  Agent25Wave57ProjectionHandoffBrief,
  Wave57GateTrajectorySnapshot,
  Wave57IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave57ProjectionHandoffBrief(args: {
  turn: number;
  wave57IntegrationMonitor: Wave57IntegrationMonitor;
  wave57GateTrajectory?: Wave57GateTrajectorySnapshot;
}): Agent25Wave57ProjectionHandoffBrief {
  const shouldProjectWave57 =
    args.wave57IntegrationMonitor.shouldRunO10m257DryRun &&
    args.wave57GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave57) {
    headlines.push('Agent 25: project wave 57 module gate / O10-257 dry-run');
  } else {
    headlines.push('Agent 25 wave 57 projection deferred — integration gate not stable');
  }
  if (args.wave57GateTrajectory?.band === 'ready') {
    headlines.push('Wave 57 gate trajectory ready for O10-257 projection handoff');
  }
  if (args.wave57IntegrationMonitor.wave57GateBand === 'blocked') {
    headlines.push('Wave 57 gate blocked — hold O10-257 handoff');
  }

  const summary = `project=${shouldProjectWave57} o10m257=${args.wave57IntegrationMonitor.shouldRunO10m257DryRun} band=${args.wave57GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave57,
    shouldRunO10m257DryRun: args.wave57IntegrationMonitor.shouldRunO10m257DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
