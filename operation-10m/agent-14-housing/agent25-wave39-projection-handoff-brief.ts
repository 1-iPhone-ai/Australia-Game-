import type {
  Agent25Wave39ProjectionHandoffBrief,
  Wave39GateTrajectorySnapshot,
  Wave39IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave39ProjectionHandoffBrief(args: {
  turn: number;
  wave39IntegrationMonitor: Wave39IntegrationMonitor;
  wave39GateTrajectory?: Wave39GateTrajectorySnapshot;
}): Agent25Wave39ProjectionHandoffBrief {
  const shouldProjectWave39 =
    args.wave39IntegrationMonitor.shouldRunO10m210DryRun &&
    args.wave39GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave39) {
    headlines.push('Agent 25: project wave 39 module gate / O10-210 dry-run');
  } else {
    headlines.push('Agent 25 wave 39 projection deferred — integration gate not stable');
  }
  if (args.wave39GateTrajectory?.band === 'ready') {
    headlines.push('Wave 39 gate trajectory ready for O10-210 projection handoff');
  }
  if (args.wave39IntegrationMonitor.wave39GateBand === 'blocked') {
    headlines.push('Wave 39 gate blocked — hold O10-210 handoff');
  }

  const summary = `project=${shouldProjectWave39} o10m210=${args.wave39IntegrationMonitor.shouldRunO10m210DryRun} band=${args.wave39GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave39,
    shouldRunO10m210DryRun: args.wave39IntegrationMonitor.shouldRunO10m210DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
