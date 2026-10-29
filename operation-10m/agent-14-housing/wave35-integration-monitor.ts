import type {
  Agent25Wave34ProjectionHandoffBrief,
  Wave34IntegrationMonitor,
  Wave35GateTrajectorySnapshot,
  Wave35IntegrationMonitor,
} from './types.ts';

export function buildWave35IntegrationMonitor(args: {
  turn: number;
  wave34ProjectionBrief: Agent25Wave34ProjectionHandoffBrief;
  wave35GateTrajectory?: Wave35GateTrajectorySnapshot;
  wave34IntegrationMonitor: Wave34IntegrationMonitor;
}): Wave35IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m202DryRun =
    args.wave34ProjectionBrief.shouldProjectWave34 &&
    args.wave35GateTrajectory?.band === 'ready' &&
    args.wave34IntegrationMonitor.shouldRunO10m200DryRun;

  if (!args.wave34ProjectionBrief.shouldProjectWave34) {
    reasons.push('Wave 34 projection not cleared');
    shouldRunO10m202DryRun = false;
  }
  if (args.wave35GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 35 gate band ${args.wave35GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m202DryRun = false;
  }
  if (!args.wave34IntegrationMonitor.shouldRunO10m200DryRun) {
    reasons.push('O10-200 dry-run path blocked for wave 35 gate');
    shouldRunO10m202DryRun = false;
  }

  const summary = shouldRunO10m202DryRun
    ? `Wave 35 O10-202 dry-run gate ready (gate EMA ${args.wave35GateTrajectory?.wave35GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 35 integration deferred — ${reasons[0]}`
      : 'Wave 35 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m202DryRun,
    wave35GateBand: args.wave35GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
