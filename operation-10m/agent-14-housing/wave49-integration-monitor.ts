import type {
  Agent25Wave48ProjectionHandoffBrief,
  Wave48IntegrationMonitor,
  Wave49GateTrajectorySnapshot,
  Wave49IntegrationMonitor,
} from './types.ts';

export function buildWave49IntegrationMonitor(args: {
  turn: number;
  wave48ProjectionBrief: Agent25Wave48ProjectionHandoffBrief;
  wave49GateTrajectory?: Wave49GateTrajectorySnapshot;
  wave48IntegrationMonitor: Wave48IntegrationMonitor;
}): Wave49IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m227DryRun =
    args.wave48ProjectionBrief.shouldProjectWave48 &&
    args.wave49GateTrajectory?.band === 'ready' &&
    args.wave48IntegrationMonitor.shouldRunO10m226DryRun;

  if (!args.wave48ProjectionBrief.shouldProjectWave48) {
    reasons.push('Wave 48 projection not cleared');
    shouldRunO10m227DryRun = false;
  }
  if (args.wave49GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 49 gate band ${args.wave49GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m227DryRun = false;
  }
  if (!args.wave48IntegrationMonitor.shouldRunO10m226DryRun) {
    reasons.push('O10-226 dry-run path blocked for wave 49 gate');
    shouldRunO10m227DryRun = false;
  }

  const summary = shouldRunO10m227DryRun
    ? `Wave 49 O10-227 dry-run gate ready (gate EMA ${args.wave49GateTrajectory?.wave49GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 49 integration deferred — ${reasons[0]}`
      : 'Wave 49 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m227DryRun,
    wave49GateBand: args.wave49GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
