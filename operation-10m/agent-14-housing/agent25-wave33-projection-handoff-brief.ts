import type {
  Agent25Wave33ProjectionHandoffBrief,
  Wave33GateTrajectorySnapshot,
  Wave33IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave33ProjectionHandoffBrief(args: {
  turn: number;
  wave33IntegrationMonitor: Wave33IntegrationMonitor;
  wave33GateTrajectory?: Wave33GateTrajectorySnapshot;
}): Agent25Wave33ProjectionHandoffBrief {
  const shouldProjectWave33 =
    args.wave33IntegrationMonitor.shouldRunO10m198DryRun &&
    args.wave33GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave33) {
    headlines.push('Agent 25: project wave 33 module gate / O10-198 dry-run');
  } else {
    headlines.push('Agent 25 wave 33 projection deferred — integration gate not stable');
  }
  if (args.wave33GateTrajectory?.band === 'ready') {
    headlines.push('Wave 33 gate trajectory ready for O10-198 projection handoff');
  }
  if (args.wave33IntegrationMonitor.wave33GateBand === 'blocked') {
    headlines.push('Wave 33 gate blocked — hold O10-198 handoff');
  }

  const summary = `project=${shouldProjectWave33} o10m198=${args.wave33IntegrationMonitor.shouldRunO10m198DryRun} band=${args.wave33GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave33,
    shouldRunO10m198DryRun: args.wave33IntegrationMonitor.shouldRunO10m198DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
