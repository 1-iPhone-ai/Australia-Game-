import type {
  Agent25Wave56ProjectionHandoffBrief,
  Wave56IntegrationMonitor,
  Wave57GateTrajectorySnapshot,
  Wave57IntegrationMonitor,
} from './types.ts';

export function buildWave57IntegrationMonitor(args: {
  turn: number;
  wave56ProjectionBrief: Agent25Wave56ProjectionHandoffBrief;
  wave57GateTrajectory?: Wave57GateTrajectorySnapshot;
  wave56IntegrationMonitor: Wave56IntegrationMonitor;
}): Wave57IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m257DryRun =
    args.wave56ProjectionBrief.shouldProjectWave56 &&
    args.wave57GateTrajectory?.band === 'ready' &&
    args.wave56IntegrationMonitor.shouldRunO10m254DryRun;

  if (!args.wave56ProjectionBrief.shouldProjectWave56) {
    reasons.push('Wave 56 projection not cleared');
    shouldRunO10m257DryRun = false;
  }
  if (args.wave57GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 57 gate band ${args.wave57GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m257DryRun = false;
  }
  if (!args.wave56IntegrationMonitor.shouldRunO10m254DryRun) {
    reasons.push('O10-254 dry-run path blocked for wave 57 gate');
    shouldRunO10m257DryRun = false;
  }

  const summary = shouldRunO10m257DryRun
    ? `Wave 57 O10-257 dry-run gate ready (gate EMA ${args.wave57GateTrajectory?.wave57GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 57 integration deferred — ${reasons[0]}`
      : 'Wave 57 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m257DryRun,
    wave57GateBand: args.wave57GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
