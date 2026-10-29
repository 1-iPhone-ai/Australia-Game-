import type {
  Agent25Wave37ProjectionHandoffBrief,
  Wave37IntegrationMonitor,
  Wave38GateTrajectorySnapshot,
  Wave38IntegrationMonitor,
} from './types.ts';

export function buildWave38IntegrationMonitor(args: {
  turn: number;
  wave37ProjectionBrief: Agent25Wave37ProjectionHandoffBrief;
  wave38GateTrajectory?: Wave38GateTrajectorySnapshot;
  wave37IntegrationMonitor: Wave37IntegrationMonitor;
}): Wave38IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m208DryRun =
    args.wave37ProjectionBrief.shouldProjectWave37 &&
    args.wave38GateTrajectory?.band === 'ready' &&
    args.wave37IntegrationMonitor.shouldRunO10m206DryRun;

  if (!args.wave37ProjectionBrief.shouldProjectWave37) {
    reasons.push('Wave 37 projection not cleared');
    shouldRunO10m208DryRun = false;
  }
  if (args.wave38GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 38 gate band ${args.wave38GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m208DryRun = false;
  }
  if (!args.wave37IntegrationMonitor.shouldRunO10m206DryRun) {
    reasons.push('O10-206 dry-run path blocked for wave 38 gate');
    shouldRunO10m208DryRun = false;
  }

  const summary = shouldRunO10m208DryRun
    ? `Wave 38 O10-208 dry-run gate ready (gate EMA ${args.wave38GateTrajectory?.wave38GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 38 integration deferred — ${reasons[0]}`
      : 'Wave 38 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m208DryRun,
    wave38GateBand: args.wave38GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
