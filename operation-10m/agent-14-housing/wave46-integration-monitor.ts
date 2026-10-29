import type {
  Agent25Wave45ProjectionHandoffBrief,
  Wave45IntegrationMonitor,
  Wave46GateTrajectorySnapshot,
  Wave46IntegrationMonitor,
} from './types.ts';

export function buildWave46IntegrationMonitor(args: {
  turn: number;
  wave45ProjectionBrief: Agent25Wave45ProjectionHandoffBrief;
  wave46GateTrajectory?: Wave46GateTrajectorySnapshot;
  wave45IntegrationMonitor: Wave45IntegrationMonitor;
}): Wave46IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m224DryRun =
    args.wave45ProjectionBrief.shouldProjectWave45 &&
    args.wave46GateTrajectory?.band === 'ready' &&
    args.wave45IntegrationMonitor.shouldRunO10m222DryRun;

  if (!args.wave45ProjectionBrief.shouldProjectWave45) {
    reasons.push('Wave 45 projection not cleared');
    shouldRunO10m224DryRun = false;
  }
  if (args.wave46GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 46 gate band ${args.wave46GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m224DryRun = false;
  }
  if (!args.wave45IntegrationMonitor.shouldRunO10m222DryRun) {
    reasons.push('O10-222 dry-run path blocked for wave 46 gate');
    shouldRunO10m224DryRun = false;
  }

  const summary = shouldRunO10m224DryRun
    ? `Wave 46 O10-224 dry-run gate ready (gate EMA ${args.wave46GateTrajectory?.wave46GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 46 integration deferred — ${reasons[0]}`
      : 'Wave 46 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m224DryRun,
    wave46GateBand: args.wave46GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
