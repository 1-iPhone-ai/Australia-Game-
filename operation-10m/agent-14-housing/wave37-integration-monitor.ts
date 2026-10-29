import type {
  Agent25Wave36ProjectionHandoffBrief,
  Wave36IntegrationMonitor,
  Wave37GateTrajectorySnapshot,
  Wave37IntegrationMonitor,
} from './types.ts';

export function buildWave37IntegrationMonitor(args: {
  turn: number;
  wave36ProjectionBrief: Agent25Wave36ProjectionHandoffBrief;
  wave37GateTrajectory?: Wave37GateTrajectorySnapshot;
  wave36IntegrationMonitor: Wave36IntegrationMonitor;
}): Wave37IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m206DryRun =
    args.wave36ProjectionBrief.shouldProjectWave36 &&
    args.wave37GateTrajectory?.band === 'ready' &&
    args.wave36IntegrationMonitor.shouldRunO10m204DryRun;

  if (!args.wave36ProjectionBrief.shouldProjectWave36) {
    reasons.push('Wave 36 projection not cleared');
    shouldRunO10m206DryRun = false;
  }
  if (args.wave37GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 37 gate band ${args.wave37GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m206DryRun = false;
  }
  if (!args.wave36IntegrationMonitor.shouldRunO10m204DryRun) {
    reasons.push('O10-204 dry-run path blocked for wave 37 gate');
    shouldRunO10m206DryRun = false;
  }

  const summary = shouldRunO10m206DryRun
    ? `Wave 37 O10-206 dry-run gate ready (gate EMA ${args.wave37GateTrajectory?.wave37GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 37 integration deferred — ${reasons[0]}`
      : 'Wave 37 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m206DryRun,
    wave37GateBand: args.wave37GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
