import type {
  Agent25Wave43ProjectionHandoffBrief,
  Wave43IntegrationMonitor,
  Wave44GateTrajectorySnapshot,
  Wave44IntegrationMonitor,
} from './types.ts';

export function buildWave44IntegrationMonitor(args: {
  turn: number;
  wave43ProjectionBrief: Agent25Wave43ProjectionHandoffBrief;
  wave44GateTrajectory?: Wave44GateTrajectorySnapshot;
  wave43IntegrationMonitor: Wave43IntegrationMonitor;
}): Wave44IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m220DryRun =
    args.wave43ProjectionBrief.shouldProjectWave43 &&
    args.wave44GateTrajectory?.band === 'ready' &&
    args.wave43IntegrationMonitor.shouldRunO10m218DryRun;

  if (!args.wave43ProjectionBrief.shouldProjectWave43) {
    reasons.push('Wave 43 projection not cleared');
    shouldRunO10m220DryRun = false;
  }
  if (args.wave44GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 44 gate band ${args.wave44GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m220DryRun = false;
  }
  if (!args.wave43IntegrationMonitor.shouldRunO10m218DryRun) {
    reasons.push('O10-218 dry-run path blocked for wave 44 gate');
    shouldRunO10m220DryRun = false;
  }

  const summary = shouldRunO10m220DryRun
    ? `Wave 44 O10-220 dry-run gate ready (gate EMA ${args.wave44GateTrajectory?.wave44GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 44 integration deferred — ${reasons[0]}`
      : 'Wave 44 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m220DryRun,
    wave44GateBand: args.wave44GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
