import type {
  Agent25Wave29ProjectionHandoffBrief,
  Wave29IntegrationMonitor,
  Wave30GateTrajectorySnapshot,
  Wave30IntegrationMonitor,
} from './types.ts';

export function buildWave30IntegrationMonitor(args: {
  turn: number;
  wave29ProjectionBrief: Agent25Wave29ProjectionHandoffBrief;
  wave30GateTrajectory?: Wave30GateTrajectorySnapshot;
  wave29IntegrationMonitor: Wave29IntegrationMonitor;
}): Wave30IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m192DryRun =
    args.wave29ProjectionBrief.shouldProjectWave29 &&
    args.wave30GateTrajectory?.band === 'ready' &&
    args.wave29IntegrationMonitor.shouldRunO10m190DryRun;

  if (!args.wave29ProjectionBrief.shouldProjectWave29) {
    reasons.push('Wave 29 projection not cleared');
    shouldRunO10m192DryRun = false;
  }
  if (args.wave30GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 30 gate band ${args.wave30GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m192DryRun = false;
  }
  if (!args.wave29IntegrationMonitor.shouldRunO10m190DryRun) {
    reasons.push('O10-190 dry-run path blocked for wave 30 gate');
    shouldRunO10m192DryRun = false;
  }

  const summary = shouldRunO10m192DryRun
    ? `Wave 30 O10-192 dry-run gate ready (gate EMA ${args.wave30GateTrajectory?.wave30GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 30 integration deferred — ${reasons[0]}`
      : 'Wave 30 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m192DryRun,
    wave30GateBand: args.wave30GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
