import type {
  Agent25Wave27ProjectionHandoffBrief,
  Wave27IntegrationMonitor,
  Wave28GateTrajectorySnapshot,
  Wave28IntegrationMonitor,
} from './types.ts';

export function buildWave28IntegrationMonitor(args: {
  turn: number;
  wave27ProjectionBrief: Agent25Wave27ProjectionHandoffBrief;
  wave28GateTrajectory?: Wave28GateTrajectorySnapshot;
  wave27IntegrationMonitor: Wave27IntegrationMonitor;
}): Wave28IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m188DryRun =
    args.wave27ProjectionBrief.shouldProjectWave27 &&
    args.wave28GateTrajectory?.band === 'ready' &&
    args.wave27IntegrationMonitor.shouldRunO10m186DryRun;

  if (!args.wave27ProjectionBrief.shouldProjectWave27) {
    reasons.push('Wave 27 projection not cleared');
    shouldRunO10m188DryRun = false;
  }
  if (args.wave28GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 28 gate band ${args.wave28GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m188DryRun = false;
  }
  if (!args.wave27IntegrationMonitor.shouldRunO10m186DryRun) {
    reasons.push('O10-186 dry-run path blocked for wave 28 gate');
    shouldRunO10m188DryRun = false;
  }

  const summary = shouldRunO10m188DryRun
    ? `Wave 28 O10-188 dry-run gate ready (gate EMA ${args.wave28GateTrajectory?.wave28GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 28 integration deferred — ${reasons[0]}`
      : 'Wave 28 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m188DryRun,
    wave28GateBand: args.wave28GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
