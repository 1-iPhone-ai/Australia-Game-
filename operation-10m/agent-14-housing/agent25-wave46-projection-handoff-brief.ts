import type {
  Agent25Wave46ProjectionHandoffBrief,
  Wave46GateTrajectorySnapshot,
  Wave46IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave46ProjectionHandoffBrief(args: {
  turn: number;
  wave46IntegrationMonitor: Wave46IntegrationMonitor;
  wave46GateTrajectory?: Wave46GateTrajectorySnapshot;
}): Agent25Wave46ProjectionHandoffBrief {
  const shouldProjectWave46 =
    args.wave46IntegrationMonitor.shouldRunO10m224DryRun &&
    args.wave46GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave46) {
    headlines.push('Agent 25: project wave 46 module gate / O10-224 dry-run');
  } else {
    headlines.push('Agent 25 wave 46 projection deferred — integration gate not stable');
  }
  if (args.wave46GateTrajectory?.band === 'ready') {
    headlines.push('Wave 46 gate trajectory ready for O10-224 projection handoff');
  }
  if (args.wave46IntegrationMonitor.wave46GateBand === 'blocked') {
    headlines.push('Wave 46 gate blocked — hold O10-224 handoff');
  }

  const summary = `project=${shouldProjectWave46} o10m224=${args.wave46IntegrationMonitor.shouldRunO10m224DryRun} band=${args.wave46GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave46,
    shouldRunO10m224DryRun: args.wave46IntegrationMonitor.shouldRunO10m224DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
