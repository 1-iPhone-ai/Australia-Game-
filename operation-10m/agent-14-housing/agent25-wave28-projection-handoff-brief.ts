import type {
  Agent25Wave28ProjectionHandoffBrief,
  Wave28GateTrajectorySnapshot,
  Wave28IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave28ProjectionHandoffBrief(args: {
  turn: number;
  wave28IntegrationMonitor: Wave28IntegrationMonitor;
  wave28GateTrajectory?: Wave28GateTrajectorySnapshot;
}): Agent25Wave28ProjectionHandoffBrief {
  const shouldProjectWave28 =
    args.wave28IntegrationMonitor.shouldRunO10m188DryRun &&
    args.wave28GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave28) {
    headlines.push('Agent 25: project wave 28 module gate / O10-188 dry-run');
  } else {
    headlines.push('Agent 25 wave 28 projection deferred — integration gate not stable');
  }
  if (args.wave28GateTrajectory?.band === 'ready') {
    headlines.push('Wave 28 gate trajectory ready for O10-188 projection handoff');
  }
  if (args.wave28IntegrationMonitor.wave28GateBand === 'blocked') {
    headlines.push('Wave 28 gate blocked — hold O10-188 handoff');
  }

  const summary = `project=${shouldProjectWave28} o10m188=${args.wave28IntegrationMonitor.shouldRunO10m188DryRun} band=${args.wave28GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave28,
    shouldRunO10m188DryRun: args.wave28IntegrationMonitor.shouldRunO10m188DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
