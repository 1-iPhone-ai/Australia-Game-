import type {
  Agent25Wave50ProjectionHandoffBrief,
  Wave50IntegrationMonitor,
  Wave51GateTrajectorySnapshot,
  Wave51IntegrationMonitor,
} from './types.ts';

export function buildWave51IntegrationMonitor(args: {
  turn: number;
  wave50ProjectionBrief: Agent25Wave50ProjectionHandoffBrief;
  wave51GateTrajectory?: Wave51GateTrajectorySnapshot;
  wave50IntegrationMonitor: Wave50IntegrationMonitor;
}): Wave51IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m231DryRun =
    args.wave50ProjectionBrief.shouldProjectWave50 &&
    args.wave51GateTrajectory?.band === 'ready' &&
    args.wave50IntegrationMonitor.shouldRunO10m229DryRun;

  if (!args.wave50ProjectionBrief.shouldProjectWave50) {
    reasons.push('Wave 50 projection not cleared');
    shouldRunO10m231DryRun = false;
  }
  if (args.wave51GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 51 gate band ${args.wave51GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m231DryRun = false;
  }
  if (!args.wave50IntegrationMonitor.shouldRunO10m229DryRun) {
    reasons.push('O10-229 dry-run path blocked for wave 51 gate');
    shouldRunO10m231DryRun = false;
  }

  const summary = shouldRunO10m231DryRun
    ? `Wave 51 O10-231 dry-run gate ready (gate EMA ${args.wave51GateTrajectory?.wave51GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 51 integration deferred — ${reasons[0]}`
      : 'Wave 51 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m231DryRun,
    wave51GateBand: args.wave51GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
