import type {
  Agent25Wave26ProjectionHandoffBrief,
  Wave26IntegrationMonitor,
  Wave27GateTrajectorySnapshot,
  Wave27IntegrationMonitor,
} from './types.ts';

export function buildWave27IntegrationMonitor(args: {
  turn: number;
  wave26ProjectionBrief: Agent25Wave26ProjectionHandoffBrief;
  wave27GateTrajectory?: Wave27GateTrajectorySnapshot;
  wave26IntegrationMonitor: Wave26IntegrationMonitor;
}): Wave27IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m186DryRun =
    args.wave26ProjectionBrief.shouldProjectWave26 &&
    args.wave27GateTrajectory?.band === 'ready' &&
    args.wave26IntegrationMonitor.shouldRunO10m184DryRun;

  if (!args.wave26ProjectionBrief.shouldProjectWave26) {
    reasons.push('Wave 26 projection not cleared');
    shouldRunO10m186DryRun = false;
  }
  if (args.wave27GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 27 gate band ${args.wave27GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m186DryRun = false;
  }
  if (!args.wave26IntegrationMonitor.shouldRunO10m184DryRun) {
    reasons.push('O10-184 dry-run path blocked for wave 27 gate');
    shouldRunO10m186DryRun = false;
  }

  const summary = shouldRunO10m186DryRun
    ? `Wave 27 O10-186 dry-run gate ready (gate EMA ${args.wave27GateTrajectory?.wave27GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 27 integration deferred — ${reasons[0]}`
      : 'Wave 27 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m186DryRun,
    wave27GateBand: args.wave27GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
