import type {
  Agent25Wave33ProjectionHandoffBrief,
  Wave33IntegrationMonitor,
  Wave34GateTrajectorySnapshot,
  Wave34IntegrationMonitor,
} from './types.ts';

export function buildWave34IntegrationMonitor(args: {
  turn: number;
  wave33ProjectionBrief: Agent25Wave33ProjectionHandoffBrief;
  wave34GateTrajectory?: Wave34GateTrajectorySnapshot;
  wave33IntegrationMonitor: Wave33IntegrationMonitor;
}): Wave34IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m200DryRun =
    args.wave33ProjectionBrief.shouldProjectWave33 &&
    args.wave34GateTrajectory?.band === 'ready' &&
    args.wave33IntegrationMonitor.shouldRunO10m198DryRun;

  if (!args.wave33ProjectionBrief.shouldProjectWave33) {
    reasons.push('Wave 33 projection not cleared');
    shouldRunO10m200DryRun = false;
  }
  if (args.wave34GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 34 gate band ${args.wave34GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m200DryRun = false;
  }
  if (!args.wave33IntegrationMonitor.shouldRunO10m198DryRun) {
    reasons.push('O10-198 dry-run path blocked for wave 34 gate');
    shouldRunO10m200DryRun = false;
  }

  const summary = shouldRunO10m200DryRun
    ? `Wave 34 O10-200 dry-run gate ready (gate EMA ${args.wave34GateTrajectory?.wave34GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 34 integration deferred — ${reasons[0]}`
      : 'Wave 34 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m200DryRun,
    wave34GateBand: args.wave34GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
