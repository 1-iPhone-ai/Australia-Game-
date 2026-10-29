import type {
  Agent25Wave57ProjectionHandoffBrief,
  Wave57IntegrationMonitor,
  Wave60GateTrajectorySnapshot,
  Wave60IntegrationMonitor,
} from './types.ts';

export function buildWave60IntegrationMonitor(args: {
  turn: number;
  wave57ProjectionBrief: Agent25Wave57ProjectionHandoffBrief;
  wave60GateTrajectory?: Wave60GateTrajectorySnapshot;
  wave57IntegrationMonitor: Wave57IntegrationMonitor;
}): Wave60IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m265DryRun =
    args.wave57ProjectionBrief.shouldProjectWave57 &&
    args.wave60GateTrajectory?.band === 'ready' &&
    args.wave57IntegrationMonitor.shouldRunO10m263DryRun;

  if (!args.wave57ProjectionBrief.shouldProjectWave57) {
    reasons.push('Wave 57 projection not cleared');
    shouldRunO10m265DryRun = false;
  }
  if (args.wave60GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 60 gate band ${args.wave60GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m265DryRun = false;
  }
  if (!args.wave57IntegrationMonitor.shouldRunO10m263DryRun) {
    reasons.push('O10-263 dry-run path blocked for wave 58 gate');
    shouldRunO10m265DryRun = false;
  }

  const summary = shouldRunO10m265DryRun
    ? `Wave 60 O10-265 dry-run gate ready (gate EMA ${args.wave60GateTrajectory?.wave60GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 60 integration deferred — ${reasons[0]}`
      : 'Wave 60 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m265DryRun,
    wave60GateBand: args.wave60GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
