import type {
  Agent25Wave51ProjectionHandoffBrief,
  Wave51IntegrationMonitor,
  Wave52GateTrajectorySnapshot,
  Wave52IntegrationMonitor,
} from './types.ts';

export function buildWave52IntegrationMonitor(args: {
  turn: number;
  wave51ProjectionBrief: Agent25Wave51ProjectionHandoffBrief;
  wave52GateTrajectory?: Wave52GateTrajectorySnapshot;
  wave51IntegrationMonitor: Wave51IntegrationMonitor;
}): Wave52IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m233DryRun =
    args.wave51ProjectionBrief.shouldProjectWave51 &&
    args.wave52GateTrajectory?.band === 'ready' &&
    args.wave51IntegrationMonitor.shouldRunO10m231DryRun;

  if (!args.wave51ProjectionBrief.shouldProjectWave51) {
    reasons.push('Wave 51 projection not cleared');
    shouldRunO10m233DryRun = false;
  }
  if (args.wave52GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 52 gate band ${args.wave52GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m233DryRun = false;
  }
  if (!args.wave51IntegrationMonitor.shouldRunO10m231DryRun) {
    reasons.push('O10-231 dry-run path blocked for wave 52 gate');
    shouldRunO10m233DryRun = false;
  }

  const summary = shouldRunO10m233DryRun
    ? `Wave 52 O10-233 dry-run gate ready (gate EMA ${args.wave52GateTrajectory?.wave52GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 52 integration deferred — ${reasons[0]}`
      : 'Wave 52 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m233DryRun,
    wave52GateBand: args.wave52GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
