import type {
  Agent25Wave32ProjectionHandoffBrief,
  Wave32IntegrationMonitor,
  Wave33GateTrajectorySnapshot,
  Wave33IntegrationMonitor,
} from './types.ts';

export function buildWave33IntegrationMonitor(args: {
  turn: number;
  wave32ProjectionBrief: Agent25Wave32ProjectionHandoffBrief;
  wave33GateTrajectory?: Wave33GateTrajectorySnapshot;
  wave32IntegrationMonitor: Wave32IntegrationMonitor;
}): Wave33IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m198DryRun =
    args.wave32ProjectionBrief.shouldProjectWave32 &&
    args.wave33GateTrajectory?.band === 'ready' &&
    args.wave32IntegrationMonitor.shouldRunO10m196DryRun;

  if (!args.wave32ProjectionBrief.shouldProjectWave32) {
    reasons.push('Wave 32 projection not cleared');
    shouldRunO10m198DryRun = false;
  }
  if (args.wave33GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 33 gate band ${args.wave33GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m198DryRun = false;
  }
  if (!args.wave32IntegrationMonitor.shouldRunO10m196DryRun) {
    reasons.push('O10-196 dry-run path blocked for wave 33 gate');
    shouldRunO10m198DryRun = false;
  }

  const summary = shouldRunO10m198DryRun
    ? `Wave 33 O10-198 dry-run gate ready (gate EMA ${args.wave33GateTrajectory?.wave33GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 33 integration deferred — ${reasons[0]}`
      : 'Wave 33 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m198DryRun,
    wave33GateBand: args.wave33GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
