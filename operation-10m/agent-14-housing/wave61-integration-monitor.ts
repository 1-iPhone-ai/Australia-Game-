import type {
  Agent25Wave57ProjectionHandoffBrief,
  Wave57IntegrationMonitor,
  Wave61GateTrajectorySnapshot,
  Wave61IntegrationMonitor,
} from './types.ts';

export function buildWave61IntegrationMonitor(args: {
  turn: number;
  wave57ProjectionBrief: Agent25Wave57ProjectionHandoffBrief;
  wave61GateTrajectory?: Wave61GateTrajectorySnapshot;
  wave57IntegrationMonitor: Wave57IntegrationMonitor;
}): Wave61IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m267DryRun =
    args.wave57ProjectionBrief.shouldProjectWave57 &&
    args.wave61GateTrajectory?.band === 'ready' &&
    args.wave57IntegrationMonitor.shouldRunO10m265DryRun;

  if (!args.wave57ProjectionBrief.shouldProjectWave57) {
    reasons.push('Wave 57 projection not cleared');
    shouldRunO10m267DryRun = false;
  }
  if (args.wave61GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 61 gate band ${args.wave61GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m267DryRun = false;
  }
  if (!args.wave57IntegrationMonitor.shouldRunO10m265DryRun) {
    reasons.push('O10-265 dry-run path blocked for wave 58 gate');
    shouldRunO10m267DryRun = false;
  }

  const summary = shouldRunO10m267DryRun
    ? `Wave 61 O10-267 dry-run gate ready (gate EMA ${args.wave61GateTrajectory?.wave61GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 61 integration deferred — ${reasons[0]}`
      : 'Wave 61 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m267DryRun,
    wave61GateBand: args.wave61GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
