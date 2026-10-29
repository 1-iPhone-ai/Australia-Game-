import type {
  Agent25Wave19ProjectionHandoffBrief,
  Wave19IntegrationMonitor,
  Wave20GateTrajectorySnapshot,
  Wave20IntegrationMonitor,
} from './types.ts';

export function buildWave20IntegrationMonitor(args: {
  turn: number;
  wave19ProjectionBrief: Agent25Wave19ProjectionHandoffBrief;
  wave20GateTrajectory?: Wave20GateTrajectorySnapshot;
  wave19IntegrationMonitor: Wave19IntegrationMonitor;
}): Wave20IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m171DryRun =
    args.wave19ProjectionBrief.shouldProjectWave19 &&
    args.wave20GateTrajectory?.band === 'ready' &&
    args.wave19IntegrationMonitor.shouldRunO10m169DryRun;

  if (!args.wave19ProjectionBrief.shouldProjectWave19) {
    reasons.push('Wave 19 projection not cleared');
    shouldRunO10m171DryRun = false;
  }
  if (args.wave20GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 20 gate band ${args.wave20GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m171DryRun = false;
  }
  if (!args.wave19IntegrationMonitor.shouldRunO10m169DryRun) {
    reasons.push('O10-169 dry-run path blocked for wave 20 gate');
    shouldRunO10m171DryRun = false;
  }

  const summary = shouldRunO10m171DryRun
    ? `Wave 20 O10-171 dry-run gate ready (gate EMA ${args.wave20GateTrajectory?.wave20GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 20 integration deferred — ${reasons[0]}`
      : 'Wave 20 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m171DryRun,
    wave20GateBand: args.wave20GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
