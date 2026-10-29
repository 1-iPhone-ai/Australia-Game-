import type {
  Agent25Wave24ProjectionHandoffBrief,
  Wave24IntegrationMonitor,
  Wave25GateTrajectorySnapshot,
  Wave25IntegrationMonitor,
} from './types.ts';

export function buildWave25IntegrationMonitor(args: {
  turn: number;
  wave24ProjectionBrief: Agent25Wave24ProjectionHandoffBrief;
  wave25GateTrajectory?: Wave25GateTrajectorySnapshot;
  wave24IntegrationMonitor: Wave24IntegrationMonitor;
}): Wave25IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m182DryRun =
    args.wave24ProjectionBrief.shouldProjectWave24 &&
    args.wave25GateTrajectory?.band === 'ready' &&
    args.wave24IntegrationMonitor.shouldRunO10m180DryRun;

  if (!args.wave24ProjectionBrief.shouldProjectWave24) {
    reasons.push('Wave 24 projection not cleared');
    shouldRunO10m182DryRun = false;
  }
  if (args.wave25GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 25 gate band ${args.wave25GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m182DryRun = false;
  }
  if (!args.wave24IntegrationMonitor.shouldRunO10m180DryRun) {
    reasons.push('O10-180 dry-run path blocked for wave 25 gate');
    shouldRunO10m182DryRun = false;
  }

  const summary = shouldRunO10m182DryRun
    ? `Wave 25 O10-182 dry-run gate ready (gate EMA ${args.wave25GateTrajectory?.wave25GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 25 integration deferred — ${reasons[0]}`
      : 'Wave 25 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m182DryRun,
    wave25GateBand: args.wave25GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
