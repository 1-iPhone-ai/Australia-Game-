import type {
  Agent25Wave41ProjectionHandoffBrief,
  Wave41IntegrationMonitor,
  Wave42GateTrajectorySnapshot,
  Wave42IntegrationMonitor,
} from './types.ts';

export function buildWave42IntegrationMonitor(args: {
  turn: number;
  wave41ProjectionBrief: Agent25Wave41ProjectionHandoffBrief;
  wave42GateTrajectory?: Wave42GateTrajectorySnapshot;
  wave41IntegrationMonitor: Wave41IntegrationMonitor;
}): Wave42IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m216DryRun =
    args.wave41ProjectionBrief.shouldProjectWave41 &&
    args.wave42GateTrajectory?.band === 'ready' &&
    args.wave41IntegrationMonitor.shouldRunO10m214DryRun;

  if (!args.wave41ProjectionBrief.shouldProjectWave41) {
    reasons.push('Wave 41 projection not cleared');
    shouldRunO10m216DryRun = false;
  }
  if (args.wave42GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 42 gate band ${args.wave42GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m216DryRun = false;
  }
  if (!args.wave41IntegrationMonitor.shouldRunO10m214DryRun) {
    reasons.push('O10-214 dry-run path blocked for wave 42 gate');
    shouldRunO10m216DryRun = false;
  }

  const summary = shouldRunO10m216DryRun
    ? `Wave 42 O10-216 dry-run gate ready (gate EMA ${args.wave42GateTrajectory?.wave42GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 42 integration deferred — ${reasons[0]}`
      : 'Wave 42 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m216DryRun,
    wave42GateBand: args.wave42GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
