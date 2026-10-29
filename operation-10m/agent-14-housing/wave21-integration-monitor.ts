import type {
  Agent25Wave20ProjectionHandoffBrief,
  Wave20IntegrationMonitor,
  Wave21GateTrajectorySnapshot,
  Wave21IntegrationMonitor,
} from './types.ts';

export function buildWave21IntegrationMonitor(args: {
  turn: number;
  wave20ProjectionBrief: Agent25Wave20ProjectionHandoffBrief;
  wave21GateTrajectory?: Wave21GateTrajectorySnapshot;
  wave20IntegrationMonitor: Wave20IntegrationMonitor;
}): Wave21IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m174DryRun =
    args.wave20ProjectionBrief.shouldProjectWave20 &&
    args.wave21GateTrajectory?.band === 'ready' &&
    args.wave20IntegrationMonitor.shouldRunO10m171DryRun;

  if (!args.wave20ProjectionBrief.shouldProjectWave20) {
    reasons.push('Wave 20 projection not cleared');
    shouldRunO10m174DryRun = false;
  }
  if (args.wave21GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 21 gate band ${args.wave21GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m174DryRun = false;
  }
  if (!args.wave20IntegrationMonitor.shouldRunO10m171DryRun) {
    reasons.push('O10-171 dry-run path blocked for wave 21 gate');
    shouldRunO10m174DryRun = false;
  }

  const summary = shouldRunO10m174DryRun
    ? `Wave 21 O10-174 dry-run gate ready (gate EMA ${args.wave21GateTrajectory?.wave21GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 21 integration deferred — ${reasons[0]}`
      : 'Wave 21 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m174DryRun,
    wave21GateBand: args.wave21GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
