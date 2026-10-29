import type {
  Agent25Wave30ProjectionHandoffBrief,
  Wave30GateTrajectorySnapshot,
  Wave30IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave30ProjectionHandoffBrief(args: {
  turn: number;
  wave30IntegrationMonitor: Wave30IntegrationMonitor;
  wave30GateTrajectory?: Wave30GateTrajectorySnapshot;
}): Agent25Wave30ProjectionHandoffBrief {
  const shouldProjectWave30 =
    args.wave30IntegrationMonitor.shouldRunO10m192DryRun &&
    args.wave30GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave30) {
    headlines.push('Agent 25: project wave 30 module gate / O10-192 dry-run');
  } else {
    headlines.push('Agent 25 wave 30 projection deferred — integration gate not stable');
  }
  if (args.wave30GateTrajectory?.band === 'ready') {
    headlines.push('Wave 30 gate trajectory ready for O10-192 projection handoff');
  }
  if (args.wave30IntegrationMonitor.wave30GateBand === 'blocked') {
    headlines.push('Wave 30 gate blocked — hold O10-192 handoff');
  }

  const summary = `project=${shouldProjectWave30} o10m192=${args.wave30IntegrationMonitor.shouldRunO10m192DryRun} band=${args.wave30GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave30,
    shouldRunO10m192DryRun: args.wave30IntegrationMonitor.shouldRunO10m192DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
