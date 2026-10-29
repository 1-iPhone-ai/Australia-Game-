import type {
  Agent25Wave23ProjectionHandoffBrief,
  Wave23GateTrajectorySnapshot,
  Wave23IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave23ProjectionHandoffBrief(args: {
  turn: number;
  wave23IntegrationMonitor: Wave23IntegrationMonitor;
  wave23GateTrajectory?: Wave23GateTrajectorySnapshot;
}): Agent25Wave23ProjectionHandoffBrief {
  const shouldProjectWave23 =
    args.wave23IntegrationMonitor.shouldRunO10m178DryRun &&
    args.wave23GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave23) {
    headlines.push('Agent 25: project wave 23 module gate / O10-178 dry-run');
  } else {
    headlines.push('Agent 25 wave 23 projection deferred — integration gate not stable');
  }
  if (args.wave23GateTrajectory?.band === 'ready') {
    headlines.push('Wave 23 gate trajectory ready for O10-178 projection handoff');
  }
  if (args.wave23IntegrationMonitor.wave23GateBand === 'blocked') {
    headlines.push('Wave 23 gate blocked — hold O10-178 handoff');
  }

  const summary = `project=${shouldProjectWave23} o10m178=${args.wave23IntegrationMonitor.shouldRunO10m178DryRun} band=${args.wave23GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave23,
    shouldRunO10m178DryRun: args.wave23IntegrationMonitor.shouldRunO10m178DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
