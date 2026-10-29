import type {
  Agent25Wave38ProjectionHandoffBrief,
  Wave38IntegrationMonitor,
  Wave39GateTrajectorySnapshot,
  Wave39IntegrationMonitor,
} from './types.ts';

export function buildWave39IntegrationMonitor(args: {
  turn: number;
  wave38ProjectionBrief: Agent25Wave38ProjectionHandoffBrief;
  wave39GateTrajectory?: Wave39GateTrajectorySnapshot;
  wave38IntegrationMonitor: Wave38IntegrationMonitor;
}): Wave39IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m210DryRun =
    args.wave38ProjectionBrief.shouldProjectWave38 &&
    args.wave39GateTrajectory?.band === 'ready' &&
    args.wave38IntegrationMonitor.shouldRunO10m208DryRun;

  if (!args.wave38ProjectionBrief.shouldProjectWave38) {
    reasons.push('Wave 38 projection not cleared');
    shouldRunO10m210DryRun = false;
  }
  if (args.wave39GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 39 gate band ${args.wave39GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m210DryRun = false;
  }
  if (!args.wave38IntegrationMonitor.shouldRunO10m208DryRun) {
    reasons.push('O10-208 dry-run path blocked for wave 39 gate');
    shouldRunO10m210DryRun = false;
  }

  const summary = shouldRunO10m210DryRun
    ? `Wave 39 O10-210 dry-run gate ready (gate EMA ${args.wave39GateTrajectory?.wave39GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 39 integration deferred — ${reasons[0]}`
      : 'Wave 39 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m210DryRun,
    wave39GateBand: args.wave39GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
