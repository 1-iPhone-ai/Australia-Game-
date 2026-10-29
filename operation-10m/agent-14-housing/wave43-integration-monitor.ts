import type {
  Agent25Wave42ProjectionHandoffBrief,
  Wave42IntegrationMonitor,
  Wave43GateTrajectorySnapshot,
  Wave43IntegrationMonitor,
} from './types.ts';

export function buildWave43IntegrationMonitor(args: {
  turn: number;
  wave42ProjectionBrief: Agent25Wave42ProjectionHandoffBrief;
  wave43GateTrajectory?: Wave43GateTrajectorySnapshot;
  wave42IntegrationMonitor: Wave42IntegrationMonitor;
}): Wave43IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m218DryRun =
    args.wave42ProjectionBrief.shouldProjectWave42 &&
    args.wave43GateTrajectory?.band === 'ready' &&
    args.wave42IntegrationMonitor.shouldRunO10m216DryRun;

  if (!args.wave42ProjectionBrief.shouldProjectWave42) {
    reasons.push('Wave 42 projection not cleared');
    shouldRunO10m218DryRun = false;
  }
  if (args.wave43GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 43 gate band ${args.wave43GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m218DryRun = false;
  }
  if (!args.wave42IntegrationMonitor.shouldRunO10m216DryRun) {
    reasons.push('O10-216 dry-run path blocked for wave 43 gate');
    shouldRunO10m218DryRun = false;
  }

  const summary = shouldRunO10m218DryRun
    ? `Wave 43 O10-218 dry-run gate ready (gate EMA ${args.wave43GateTrajectory?.wave43GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 43 integration deferred — ${reasons[0]}`
      : 'Wave 43 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m218DryRun,
    wave43GateBand: args.wave43GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
