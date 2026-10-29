import type {
  Agent25Wave21ProjectionHandoffBrief,
  Wave21GateTrajectorySnapshot,
  Wave21IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave21ProjectionHandoffBrief(args: {
  turn: number;
  wave21IntegrationMonitor: Wave21IntegrationMonitor;
  wave21GateTrajectory?: Wave21GateTrajectorySnapshot;
}): Agent25Wave21ProjectionHandoffBrief {
  const shouldProjectWave21 =
    args.wave21IntegrationMonitor.shouldRunO10m174DryRun &&
    args.wave21GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave21) {
    headlines.push('Agent 25: project wave 21 module gate / O10-174 dry-run');
  } else {
    headlines.push('Agent 25 wave 21 projection deferred — integration gate not stable');
  }
  if (args.wave21GateTrajectory?.band === 'ready') {
    headlines.push('Wave 21 gate trajectory ready for O10-174 projection handoff');
  }
  if (args.wave21IntegrationMonitor.wave21GateBand === 'blocked') {
    headlines.push('Wave 21 gate blocked — hold O10-174 handoff');
  }

  const summary = `project=${shouldProjectWave21} o10m174=${args.wave21IntegrationMonitor.shouldRunO10m174DryRun} band=${args.wave21GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave21,
    shouldRunO10m174DryRun: args.wave21IntegrationMonitor.shouldRunO10m174DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
