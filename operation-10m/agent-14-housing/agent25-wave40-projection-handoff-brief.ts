import type {
  Agent25Wave40ProjectionHandoffBrief,
  Wave40GateTrajectorySnapshot,
  Wave40IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave40ProjectionHandoffBrief(args: {
  turn: number;
  wave40IntegrationMonitor: Wave40IntegrationMonitor;
  wave40GateTrajectory?: Wave40GateTrajectorySnapshot;
}): Agent25Wave40ProjectionHandoffBrief {
  const shouldProjectWave40 =
    args.wave40IntegrationMonitor.shouldRunO10m212DryRun &&
    args.wave40GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave40) {
    headlines.push('Agent 25: project wave 40 module gate / O10-212 dry-run');
  } else {
    headlines.push('Agent 25 wave 40 projection deferred — integration gate not stable');
  }
  if (args.wave40GateTrajectory?.band === 'ready') {
    headlines.push('Wave 40 gate trajectory ready for O10-212 projection handoff');
  }
  if (args.wave40IntegrationMonitor.wave40GateBand === 'blocked') {
    headlines.push('Wave 40 gate blocked — hold O10-212 handoff');
  }

  const summary = `project=${shouldProjectWave40} o10m212=${args.wave40IntegrationMonitor.shouldRunO10m212DryRun} band=${args.wave40GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave40,
    shouldRunO10m212DryRun: args.wave40IntegrationMonitor.shouldRunO10m212DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
