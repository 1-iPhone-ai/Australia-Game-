import type {
  Agent25Wave47ProjectionHandoffBrief,
  Wave47GateTrajectorySnapshot,
  Wave47IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave47ProjectionHandoffBrief(args: {
  turn: number;
  wave47IntegrationMonitor: Wave47IntegrationMonitor;
  wave47GateTrajectory?: Wave47GateTrajectorySnapshot;
}): Agent25Wave47ProjectionHandoffBrief {
  const shouldProjectWave47 =
    args.wave47IntegrationMonitor.shouldRunO10m225DryRun &&
    args.wave47GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave47) {
    headlines.push('Agent 25: project wave 47 module gate / O10-225 dry-run');
  } else {
    headlines.push('Agent 25 wave 47 projection deferred — integration gate not stable');
  }
  if (args.wave47GateTrajectory?.band === 'ready') {
    headlines.push('Wave 47 gate trajectory ready for O10-225 projection handoff');
  }
  if (args.wave47IntegrationMonitor.wave47GateBand === 'blocked') {
    headlines.push('Wave 47 gate blocked — hold O10-225 handoff');
  }

  const summary = `project=${shouldProjectWave47} o10m225=${args.wave47IntegrationMonitor.shouldRunO10m225DryRun} band=${args.wave47GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave47,
    shouldRunO10m225DryRun: args.wave47IntegrationMonitor.shouldRunO10m225DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
