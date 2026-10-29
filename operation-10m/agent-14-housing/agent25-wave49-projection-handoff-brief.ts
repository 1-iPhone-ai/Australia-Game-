import type {
  Agent25Wave49ProjectionHandoffBrief,
  Wave49GateTrajectorySnapshot,
  Wave49IntegrationMonitor,
} from './types.ts';

export function composeAgent25Wave49ProjectionHandoffBrief(args: {
  turn: number;
  wave49IntegrationMonitor: Wave49IntegrationMonitor;
  wave49GateTrajectory?: Wave49GateTrajectorySnapshot;
}): Agent25Wave49ProjectionHandoffBrief {
  const shouldProjectWave49 =
    args.wave49IntegrationMonitor.shouldRunO10m227DryRun &&
    args.wave49GateTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave49) {
    headlines.push('Agent 25: project wave 49 module gate / O10-227 dry-run');
  } else {
    headlines.push('Agent 25 wave 49 projection deferred — integration gate not stable');
  }
  if (args.wave49GateTrajectory?.band === 'ready') {
    headlines.push('Wave 49 gate trajectory ready for O10-227 projection handoff');
  }
  if (args.wave49IntegrationMonitor.wave49GateBand === 'blocked') {
    headlines.push('Wave 49 gate blocked — hold O10-227 handoff');
  }

  const summary = `project=${shouldProjectWave49} o10m227=${args.wave49IntegrationMonitor.shouldRunO10m227DryRun} band=${args.wave49GateTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave49,
    shouldRunO10m227DryRun: args.wave49IntegrationMonitor.shouldRunO10m227DryRun,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
