import type {
  Agent25Wave57ProjectionHandoffBrief,
  Wave57IntegrationMonitor,
  Wave58GateTrajectorySnapshot,
  Wave58IntegrationMonitor,
} from './types.ts';

export function buildWave58IntegrationMonitor(args: {
  turn: number;
  wave57ProjectionBrief: Agent25Wave57ProjectionHandoffBrief;
  wave58GateTrajectory?: Wave58GateTrajectorySnapshot;
  wave57IntegrationMonitor: Wave57IntegrationMonitor;
}): Wave58IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m260DryRun =
    args.wave57ProjectionBrief.shouldProjectWave57 &&
    args.wave58GateTrajectory?.band === 'ready' &&
    args.wave57IntegrationMonitor.shouldRunO10m257DryRun;

  if (!args.wave57ProjectionBrief.shouldProjectWave57) {
    reasons.push('Wave 57 projection not cleared');
    shouldRunO10m260DryRun = false;
  }
  if (args.wave58GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 58 gate band ${args.wave58GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m260DryRun = false;
  }
  if (!args.wave57IntegrationMonitor.shouldRunO10m257DryRun) {
    reasons.push('O10-257 dry-run path blocked for wave 58 gate');
    shouldRunO10m260DryRun = false;
  }

  const summary = shouldRunO10m260DryRun
    ? `Wave 58 O10-260 dry-run gate ready (gate EMA ${args.wave58GateTrajectory?.wave58GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 58 integration deferred — ${reasons[0]}`
      : 'Wave 58 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m260DryRun,
    wave58GateBand: args.wave58GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
