import type {
  Agent25Wave35ProjectionHandoffBrief,
  Wave35IntegrationMonitor,
  Wave36GateTrajectorySnapshot,
  Wave36IntegrationMonitor,
} from './types.ts';

export function buildWave36IntegrationMonitor(args: {
  turn: number;
  wave35ProjectionBrief: Agent25Wave35ProjectionHandoffBrief;
  wave36GateTrajectory?: Wave36GateTrajectorySnapshot;
  wave35IntegrationMonitor: Wave35IntegrationMonitor;
}): Wave36IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m204DryRun =
    args.wave35ProjectionBrief.shouldProjectWave35 &&
    args.wave36GateTrajectory?.band === 'ready' &&
    args.wave35IntegrationMonitor.shouldRunO10m202DryRun;

  if (!args.wave35ProjectionBrief.shouldProjectWave35) {
    reasons.push('Wave 35 projection not cleared');
    shouldRunO10m204DryRun = false;
  }
  if (args.wave36GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 36 gate band ${args.wave36GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m204DryRun = false;
  }
  if (!args.wave35IntegrationMonitor.shouldRunO10m202DryRun) {
    reasons.push('O10-202 dry-run path blocked for wave 36 gate');
    shouldRunO10m204DryRun = false;
  }

  const summary = shouldRunO10m204DryRun
    ? `Wave 36 O10-204 dry-run gate ready (gate EMA ${args.wave36GateTrajectory?.wave36GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 36 integration deferred — ${reasons[0]}`
      : 'Wave 36 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m204DryRun,
    wave36GateBand: args.wave36GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
