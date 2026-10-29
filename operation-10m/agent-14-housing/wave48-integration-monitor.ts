import type {
  Agent25Wave47ProjectionHandoffBrief,
  Wave47IntegrationMonitor,
  Wave48GateTrajectorySnapshot,
  Wave48IntegrationMonitor,
} from './types.ts';

export function buildWave48IntegrationMonitor(args: {
  turn: number;
  wave47ProjectionBrief: Agent25Wave47ProjectionHandoffBrief;
  wave48GateTrajectory?: Wave48GateTrajectorySnapshot;
  wave47IntegrationMonitor: Wave47IntegrationMonitor;
}): Wave48IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m226DryRun =
    args.wave47ProjectionBrief.shouldProjectWave47 &&
    args.wave48GateTrajectory?.band === 'ready' &&
    args.wave47IntegrationMonitor.shouldRunO10m225DryRun;

  if (!args.wave47ProjectionBrief.shouldProjectWave47) {
    reasons.push('Wave 47 projection not cleared');
    shouldRunO10m226DryRun = false;
  }
  if (args.wave48GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 48 gate band ${args.wave48GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m226DryRun = false;
  }
  if (!args.wave47IntegrationMonitor.shouldRunO10m225DryRun) {
    reasons.push('O10-225 dry-run path blocked for wave 48 gate');
    shouldRunO10m226DryRun = false;
  }

  const summary = shouldRunO10m226DryRun
    ? `Wave 48 O10-226 dry-run gate ready (gate EMA ${args.wave48GateTrajectory?.wave48GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 48 integration deferred — ${reasons[0]}`
      : 'Wave 48 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m226DryRun,
    wave48GateBand: args.wave48GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
