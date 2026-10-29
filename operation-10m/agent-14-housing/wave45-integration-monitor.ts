import type {
  Agent25Wave44ProjectionHandoffBrief,
  Wave44IntegrationMonitor,
  Wave45GateTrajectorySnapshot,
  Wave45IntegrationMonitor,
} from './types.ts';

export function buildWave45IntegrationMonitor(args: {
  turn: number;
  wave44ProjectionBrief: Agent25Wave44ProjectionHandoffBrief;
  wave45GateTrajectory?: Wave45GateTrajectorySnapshot;
  wave44IntegrationMonitor: Wave44IntegrationMonitor;
}): Wave45IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m222DryRun =
    args.wave44ProjectionBrief.shouldProjectWave44 &&
    args.wave45GateTrajectory?.band === 'ready' &&
    args.wave44IntegrationMonitor.shouldRunO10m220DryRun;

  if (!args.wave44ProjectionBrief.shouldProjectWave44) {
    reasons.push('Wave 44 projection not cleared');
    shouldRunO10m222DryRun = false;
  }
  if (args.wave45GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 45 gate band ${args.wave45GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m222DryRun = false;
  }
  if (!args.wave44IntegrationMonitor.shouldRunO10m220DryRun) {
    reasons.push('O10-220 dry-run path blocked for wave 45 gate');
    shouldRunO10m222DryRun = false;
  }

  const summary = shouldRunO10m222DryRun
    ? `Wave 45 O10-222 dry-run gate ready (gate EMA ${args.wave45GateTrajectory?.wave45GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 45 integration deferred — ${reasons[0]}`
      : 'Wave 45 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m222DryRun,
    wave45GateBand: args.wave45GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
