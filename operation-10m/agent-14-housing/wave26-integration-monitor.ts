import type {
  Agent25Wave25ProjectionHandoffBrief,
  Wave25IntegrationMonitor,
  Wave26GateTrajectorySnapshot,
  Wave26IntegrationMonitor,
} from './types.ts';

export function buildWave26IntegrationMonitor(args: {
  turn: number;
  wave25ProjectionBrief: Agent25Wave25ProjectionHandoffBrief;
  wave26GateTrajectory?: Wave26GateTrajectorySnapshot;
  wave25IntegrationMonitor: Wave25IntegrationMonitor;
}): Wave26IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m184DryRun =
    args.wave25ProjectionBrief.shouldProjectWave25 &&
    args.wave26GateTrajectory?.band === 'ready' &&
    args.wave25IntegrationMonitor.shouldRunO10m182DryRun;

  if (!args.wave25ProjectionBrief.shouldProjectWave25) {
    reasons.push('Wave 25 projection not cleared');
    shouldRunO10m184DryRun = false;
  }
  if (args.wave26GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 26 gate band ${args.wave26GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m184DryRun = false;
  }
  if (!args.wave25IntegrationMonitor.shouldRunO10m182DryRun) {
    reasons.push('O10-182 dry-run path blocked for wave 26 gate');
    shouldRunO10m184DryRun = false;
  }

  const summary = shouldRunO10m184DryRun
    ? `Wave 26 O10-184 dry-run gate ready (gate EMA ${args.wave26GateTrajectory?.wave26GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 26 integration deferred — ${reasons[0]}`
      : 'Wave 26 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m184DryRun,
    wave26GateBand: args.wave26GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
