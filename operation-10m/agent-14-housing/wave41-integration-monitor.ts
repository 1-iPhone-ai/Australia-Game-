import type {
  Agent25Wave40ProjectionHandoffBrief,
  Wave40IntegrationMonitor,
  Wave41GateTrajectorySnapshot,
  Wave41IntegrationMonitor,
} from './types.ts';

export function buildWave41IntegrationMonitor(args: {
  turn: number;
  wave40ProjectionBrief: Agent25Wave40ProjectionHandoffBrief;
  wave41GateTrajectory?: Wave41GateTrajectorySnapshot;
  wave40IntegrationMonitor: Wave40IntegrationMonitor;
}): Wave41IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m214DryRun =
    args.wave40ProjectionBrief.shouldProjectWave40 &&
    args.wave41GateTrajectory?.band === 'ready' &&
    args.wave40IntegrationMonitor.shouldRunO10m212DryRun;

  if (!args.wave40ProjectionBrief.shouldProjectWave40) {
    reasons.push('Wave 40 projection not cleared');
    shouldRunO10m214DryRun = false;
  }
  if (args.wave41GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 41 gate band ${args.wave41GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m214DryRun = false;
  }
  if (!args.wave40IntegrationMonitor.shouldRunO10m212DryRun) {
    reasons.push('O10-212 dry-run path blocked for wave 41 gate');
    shouldRunO10m214DryRun = false;
  }

  const summary = shouldRunO10m214DryRun
    ? `Wave 41 O10-214 dry-run gate ready (gate EMA ${args.wave41GateTrajectory?.wave41GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 41 integration deferred — ${reasons[0]}`
      : 'Wave 41 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m214DryRun,
    wave41GateBand: args.wave41GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
