import type {
  Agent25Wave18ProjectionHandoffBrief,
  Wave18ProjectionMonitor,
  Wave19GateTrajectorySnapshot,
  Wave19IntegrationMonitor,
} from './types.ts';

export function buildWave19IntegrationMonitor(args: {
  turn: number;
  wave18ProjectionBrief: Agent25Wave18ProjectionHandoffBrief;
  wave19GateTrajectory?: Wave19GateTrajectorySnapshot;
  wave18ProjectionMonitor: Wave18ProjectionMonitor;
}): Wave19IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m169DryRun =
    args.wave18ProjectionBrief.shouldProjectWave18 &&
    args.wave19GateTrajectory?.band === 'ready' &&
    args.wave18ProjectionMonitor.shouldRunO10m167DryRun;

  if (!args.wave18ProjectionBrief.shouldProjectWave18) {
    reasons.push('Wave 18 projection not cleared');
    shouldRunO10m169DryRun = false;
  }
  if (args.wave19GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 19 gate band ${args.wave19GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m169DryRun = false;
  }
  if (!args.wave18ProjectionMonitor.shouldRunO10m167DryRun) {
    reasons.push('O10-167 dry-run path blocked for wave 19 gate');
    shouldRunO10m169DryRun = false;
  }

  const summary = shouldRunO10m169DryRun
    ? `Wave 19 O10-169 dry-run gate ready (gate EMA ${args.wave19GateTrajectory?.wave19GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 19 integration deferred — ${reasons[0]}`
      : 'Wave 19 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m169DryRun,
    wave19GateBand: args.wave19GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
