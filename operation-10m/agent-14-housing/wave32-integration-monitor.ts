import type {
  Agent25Wave31ProjectionHandoffBrief,
  Wave31IntegrationMonitor,
  Wave32GateTrajectorySnapshot,
  Wave32IntegrationMonitor,
} from './types.ts';

export function buildWave32IntegrationMonitor(args: {
  turn: number;
  wave31ProjectionBrief: Agent25Wave31ProjectionHandoffBrief;
  wave32GateTrajectory?: Wave32GateTrajectorySnapshot;
  wave31IntegrationMonitor: Wave31IntegrationMonitor;
}): Wave32IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m196DryRun =
    args.wave31ProjectionBrief.shouldProjectWave31 &&
    args.wave32GateTrajectory?.band === 'ready' &&
    args.wave31IntegrationMonitor.shouldRunO10m194DryRun;

  if (!args.wave31ProjectionBrief.shouldProjectWave31) {
    reasons.push('Wave 31 projection not cleared');
    shouldRunO10m196DryRun = false;
  }
  if (args.wave32GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 32 gate band ${args.wave32GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m196DryRun = false;
  }
  if (!args.wave31IntegrationMonitor.shouldRunO10m194DryRun) {
    reasons.push('O10-194 dry-run path blocked for wave 32 gate');
    shouldRunO10m196DryRun = false;
  }

  const summary = shouldRunO10m196DryRun
    ? `Wave 32 O10-196 dry-run gate ready (gate EMA ${args.wave32GateTrajectory?.wave32GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 32 integration deferred — ${reasons[0]}`
      : 'Wave 32 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m196DryRun,
    wave32GateBand: args.wave32GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
