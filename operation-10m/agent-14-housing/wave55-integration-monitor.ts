import type {
  Agent25Wave54ProjectionHandoffBrief,
  Wave54IntegrationMonitor,
  Wave55GateTrajectorySnapshot,
  Wave55IntegrationMonitor,
} from './types.ts';

export function buildWave55IntegrationMonitor(args: {
  turn: number;
  wave54ProjectionBrief: Agent25Wave54ProjectionHandoffBrief;
  wave55GateTrajectory?: Wave55GateTrajectorySnapshot;
  wave54IntegrationMonitor: Wave54IntegrationMonitor;
}): Wave55IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m247DryRun =
    args.wave54ProjectionBrief.shouldProjectWave54 &&
    args.wave55GateTrajectory?.band === 'ready' &&
    args.wave54IntegrationMonitor.shouldRunO10m240DryRun;

  if (!args.wave54ProjectionBrief.shouldProjectWave54) {
    reasons.push('Wave 54 projection not cleared');
    shouldRunO10m247DryRun = false;
  }
  if (args.wave55GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 55 gate band ${args.wave55GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m247DryRun = false;
  }
  if (!args.wave54IntegrationMonitor.shouldRunO10m240DryRun) {
    reasons.push('O10-240 dry-run path blocked for wave 55 gate');
    shouldRunO10m247DryRun = false;
  }

  const summary = shouldRunO10m247DryRun
    ? `Wave 55 O10-247 dry-run gate ready (gate EMA ${args.wave55GateTrajectory?.wave55GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 55 integration deferred — ${reasons[0]}`
      : 'Wave 55 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m247DryRun,
    wave55GateBand: args.wave55GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
