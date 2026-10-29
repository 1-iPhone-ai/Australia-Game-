import type {
  Agent25Wave21ProjectionHandoffBrief,
  Wave21IntegrationMonitor,
  Wave22GateTrajectorySnapshot,
  Wave22IntegrationMonitor,
} from './types.ts';

export function buildWave22IntegrationMonitor(args: {
  turn: number;
  wave21ProjectionBrief: Agent25Wave21ProjectionHandoffBrief;
  wave22GateTrajectory?: Wave22GateTrajectorySnapshot;
  wave21IntegrationMonitor: Wave21IntegrationMonitor;
}): Wave22IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m176DryRun =
    args.wave21ProjectionBrief.shouldProjectWave21 &&
    args.wave22GateTrajectory?.band === 'ready' &&
    args.wave21IntegrationMonitor.shouldRunO10m174DryRun;

  if (!args.wave21ProjectionBrief.shouldProjectWave21) {
    reasons.push('Wave 21 projection not cleared');
    shouldRunO10m176DryRun = false;
  }
  if (args.wave22GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 22 gate band ${args.wave22GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m176DryRun = false;
  }
  if (!args.wave21IntegrationMonitor.shouldRunO10m174DryRun) {
    reasons.push('O10-174 dry-run path blocked for wave 22 gate');
    shouldRunO10m176DryRun = false;
  }

  const summary = shouldRunO10m176DryRun
    ? `Wave 22 O10-176 dry-run gate ready (gate EMA ${args.wave22GateTrajectory?.wave22GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 22 integration deferred — ${reasons[0]}`
      : 'Wave 22 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m176DryRun,
    wave22GateBand: args.wave22GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
