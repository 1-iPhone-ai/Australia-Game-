import type {
  Agent25Wave46ProjectionHandoffBrief,
  Wave46IntegrationMonitor,
  Wave47GateTrajectorySnapshot,
  Wave47IntegrationMonitor,
} from './types.ts';

export function buildWave47IntegrationMonitor(args: {
  turn: number;
  wave46ProjectionBrief: Agent25Wave46ProjectionHandoffBrief;
  wave47GateTrajectory?: Wave47GateTrajectorySnapshot;
  wave46IntegrationMonitor: Wave46IntegrationMonitor;
}): Wave47IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m225DryRun =
    args.wave46ProjectionBrief.shouldProjectWave46 &&
    args.wave47GateTrajectory?.band === 'ready' &&
    args.wave46IntegrationMonitor.shouldRunO10m224DryRun;

  if (!args.wave46ProjectionBrief.shouldProjectWave46) {
    reasons.push('Wave 46 projection not cleared');
    shouldRunO10m225DryRun = false;
  }
  if (args.wave47GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 47 gate band ${args.wave47GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m225DryRun = false;
  }
  if (!args.wave46IntegrationMonitor.shouldRunO10m224DryRun) {
    reasons.push('O10-224 dry-run path blocked for wave 47 gate');
    shouldRunO10m225DryRun = false;
  }

  const summary = shouldRunO10m225DryRun
    ? `Wave 47 O10-225 dry-run gate ready (gate EMA ${args.wave47GateTrajectory?.wave47GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 47 integration deferred — ${reasons[0]}`
      : 'Wave 47 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m225DryRun,
    wave47GateBand: args.wave47GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
