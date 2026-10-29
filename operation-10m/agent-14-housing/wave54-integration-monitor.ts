import type {
  Agent25Wave53ProjectionHandoffBrief,
  Wave53IntegrationMonitor,
  Wave54GateTrajectorySnapshot,
  Wave54IntegrationMonitor,
} from './types.ts';

export function buildWave54IntegrationMonitor(args: {
  turn: number;
  wave53ProjectionBrief: Agent25Wave53ProjectionHandoffBrief;
  wave54GateTrajectory?: Wave54GateTrajectorySnapshot;
  wave53IntegrationMonitor: Wave53IntegrationMonitor;
}): Wave54IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m240DryRun =
    args.wave53ProjectionBrief.shouldProjectWave53 &&
    args.wave54GateTrajectory?.band === 'ready' &&
    args.wave53IntegrationMonitor.shouldRunO10m237DryRun;

  if (!args.wave53ProjectionBrief.shouldProjectWave53) {
    reasons.push('Wave 53 projection not cleared');
    shouldRunO10m240DryRun = false;
  }
  if (args.wave54GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 54 gate band ${args.wave54GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m240DryRun = false;
  }
  if (!args.wave53IntegrationMonitor.shouldRunO10m237DryRun) {
    reasons.push('O10-237 dry-run path blocked for wave 54 gate');
    shouldRunO10m240DryRun = false;
  }

  const summary = shouldRunO10m240DryRun
    ? `Wave 54 O10-240 dry-run gate ready (gate EMA ${args.wave54GateTrajectory?.wave54GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 54 integration deferred — ${reasons[0]}`
      : 'Wave 54 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m240DryRun,
    wave54GateBand: args.wave54GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
