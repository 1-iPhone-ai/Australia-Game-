import type {
  Agent25Wave55ProjectionHandoffBrief,
  Wave55IntegrationMonitor,
  Wave56GateTrajectorySnapshot,
  Wave56IntegrationMonitor,
} from './types.ts';

export function buildWave56IntegrationMonitor(args: {
  turn: number;
  wave55ProjectionBrief: Agent25Wave55ProjectionHandoffBrief;
  wave56GateTrajectory?: Wave56GateTrajectorySnapshot;
  wave55IntegrationMonitor: Wave55IntegrationMonitor;
}): Wave56IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m254DryRun =
    args.wave55ProjectionBrief.shouldProjectWave55 &&
    args.wave56GateTrajectory?.band === 'ready' &&
    args.wave55IntegrationMonitor.shouldRunO10m247DryRun;

  if (!args.wave55ProjectionBrief.shouldProjectWave55) {
    reasons.push('Wave 55 projection not cleared');
    shouldRunO10m254DryRun = false;
  }
  if (args.wave56GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 56 gate band ${args.wave56GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m254DryRun = false;
  }
  if (!args.wave55IntegrationMonitor.shouldRunO10m247DryRun) {
    reasons.push('O10-247 dry-run path blocked for wave 56 gate');
    shouldRunO10m254DryRun = false;
  }

  const summary = shouldRunO10m254DryRun
    ? `Wave 56 O10-254 dry-run gate ready (gate EMA ${args.wave56GateTrajectory?.wave56GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 56 integration deferred — ${reasons[0]}`
      : 'Wave 56 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m254DryRun,
    wave56GateBand: args.wave56GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
