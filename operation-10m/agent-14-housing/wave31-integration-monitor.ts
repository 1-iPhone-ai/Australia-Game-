import type {
  Agent25Wave30ProjectionHandoffBrief,
  Wave30IntegrationMonitor,
  Wave31GateTrajectorySnapshot,
  Wave31IntegrationMonitor,
} from './types.ts';

export function buildWave31IntegrationMonitor(args: {
  turn: number;
  wave30ProjectionBrief: Agent25Wave30ProjectionHandoffBrief;
  wave31GateTrajectory?: Wave31GateTrajectorySnapshot;
  wave30IntegrationMonitor: Wave30IntegrationMonitor;
}): Wave31IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m194DryRun =
    args.wave30ProjectionBrief.shouldProjectWave30 &&
    args.wave31GateTrajectory?.band === 'ready' &&
    args.wave30IntegrationMonitor.shouldRunO10m192DryRun;

  if (!args.wave30ProjectionBrief.shouldProjectWave30) {
    reasons.push('Wave 30 projection not cleared');
    shouldRunO10m194DryRun = false;
  }
  if (args.wave31GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 31 gate band ${args.wave31GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m194DryRun = false;
  }
  if (!args.wave30IntegrationMonitor.shouldRunO10m192DryRun) {
    reasons.push('O10-192 dry-run path blocked for wave 31 gate');
    shouldRunO10m194DryRun = false;
  }

  const summary = shouldRunO10m194DryRun
    ? `Wave 31 O10-194 dry-run gate ready (gate EMA ${args.wave31GateTrajectory?.wave31GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 31 integration deferred — ${reasons[0]}`
      : 'Wave 31 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m194DryRun,
    wave31GateBand: args.wave31GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
