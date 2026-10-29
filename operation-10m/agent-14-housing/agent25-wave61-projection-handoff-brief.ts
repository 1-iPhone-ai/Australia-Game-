import type {
  Agent25Wave61ProjectionHandoffBrief,
  Wave61GateTrajectorySnapshot,
  Wave61IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave61ProjectionHandoffBrief(args: {
  turn: number;
  wave61IntegrationMonitor: Wave61IntegrationMonitor;
  wave61GateTrajectory?: Wave61GateTrajectorySnapshot;
}): Agent25Wave61ProjectionHandoffBrief {
  const shouldProjectWave61 =
    args.wave61IntegrationMonitor.shouldRunO10m267DryRun &&
    args.wave61GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave61) {
    headlines.push('Agent 25: project wave 57 module gate / O10-267 dry-run');
  } else {
    headlines.push('Agent 25 wave 57 projection deferred — integration gate not stable');
  }
  if (args.wave61GateTrajectory?.band === 'ready') {
    headlines.push('Wave 61 gate trajectory ready for O10-267 projection handoff');
  }
  if (args.wave61IntegrationMonitor.wave61GateBand === 'blocked') {
    headlines.push('Wave 61 gate blocked — hold O10-267 handoff');
  }

  const summary = `project=${shouldProjectWave61} o10m257=${args.wave61IntegrationMonitor.shouldRunO10m267DryRun} band=${args.wave61GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave61,
    shouldRunO10m267DryRun: args.wave61IntegrationMonitor.shouldRunO10m267DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
