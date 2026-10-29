import type {
  Agent25Wave54ProjectionHandoffBrief,
  Wave54GateTrajectorySnapshot,
  Wave54IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave54ProjectionHandoffBrief(args: {
  turn: number;
  wave54IntegrationMonitor: Wave54IntegrationMonitor;
  wave54GateTrajectory?: Wave54GateTrajectorySnapshot;
}): Agent25Wave54ProjectionHandoffBrief {
  const shouldProjectWave54 =
    args.wave54IntegrationMonitor.shouldRunO10m240DryRun &&
    args.wave54GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave54) {
    headlines.push('Agent 25: project wave 54 module gate / O10-240 dry-run');
  } else {
    headlines.push('Agent 25 wave 54 projection deferred — integration gate not stable');
  }
  if (args.wave54GateTrajectory?.band === 'ready') {
    headlines.push('Wave 54 gate trajectory ready for O10-240 projection handoff');
  }
  if (args.wave54IntegrationMonitor.wave54GateBand === 'blocked') {
    headlines.push('Wave 54 gate blocked — hold O10-240 handoff');
  }

  const summary = `project=${shouldProjectWave54} o10m240=${args.wave54IntegrationMonitor.shouldRunO10m240DryRun} band=${args.wave54GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave54,
    shouldRunO10m240DryRun: args.wave54IntegrationMonitor.shouldRunO10m240DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
