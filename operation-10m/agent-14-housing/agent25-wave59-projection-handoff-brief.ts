import type {
  Agent25Wave59ProjectionHandoffBrief,
  Wave59GateTrajectorySnapshot,
  Wave59IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave59ProjectionHandoffBrief(args: {
  turn: number;
  wave59IntegrationMonitor: Wave59IntegrationMonitor;
  wave59GateTrajectory?: Wave59GateTrajectorySnapshot;
}): Agent25Wave59ProjectionHandoffBrief {
  const shouldProjectWave59 =
    args.wave59IntegrationMonitor.shouldRunO10m263DryRun &&
    args.wave59GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave59) {
    headlines.push('Agent 25: project wave 57 module gate / O10-263 dry-run');
  } else {
    headlines.push('Agent 25 wave 57 projection deferred — integration gate not stable');
  }
  if (args.wave59GateTrajectory?.band === 'ready') {
    headlines.push('Wave 59 gate trajectory ready for O10-263 projection handoff');
  }
  if (args.wave59IntegrationMonitor.wave59GateBand === 'blocked') {
    headlines.push('Wave 59 gate blocked — hold O10-263 handoff');
  }

  const summary = `project=${shouldProjectWave59} o10m257=${args.wave59IntegrationMonitor.shouldRunO10m263DryRun} band=${args.wave59GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave59,
    shouldRunO10m263DryRun: args.wave59IntegrationMonitor.shouldRunO10m263DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
