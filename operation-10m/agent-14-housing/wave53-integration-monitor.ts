import type {
  Agent25Wave52ProjectionHandoffBrief,
  Wave52IntegrationMonitor,
  Wave53GateTrajectorySnapshot,
  Wave53IntegrationMonitor,
} from './types.ts';

export function buildWave53IntegrationMonitor(args: {
  turn: number;
  wave52ProjectionBrief: Agent25Wave52ProjectionHandoffBrief;
  wave53GateTrajectory?: Wave53GateTrajectorySnapshot;
  wave52IntegrationMonitor: Wave52IntegrationMonitor;
}): Wave53IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m237DryRun =
    args.wave52ProjectionBrief.shouldProjectWave52 &&
    args.wave53GateTrajectory?.band === 'ready' &&
    args.wave52IntegrationMonitor.shouldRunO10m233DryRun;

  if (!args.wave52ProjectionBrief.shouldProjectWave52) {
    reasons.push('Wave 52 projection not cleared');
    shouldRunO10m237DryRun = false;
  }
  if (args.wave53GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 53 gate band ${args.wave53GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m237DryRun = false;
  }
  if (!args.wave52IntegrationMonitor.shouldRunO10m233DryRun) {
    reasons.push('O10-233 dry-run path blocked for wave 53 gate');
    shouldRunO10m237DryRun = false;
  }

  const summary = shouldRunO10m237DryRun
    ? `Wave 53 O10-237 dry-run gate ready (gate EMA ${args.wave53GateTrajectory?.wave53GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 53 integration deferred — ${reasons[0]}`
      : 'Wave 53 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m237DryRun,
    wave53GateBand: args.wave53GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
