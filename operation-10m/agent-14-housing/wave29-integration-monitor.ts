import type {
  Agent25Wave28ProjectionHandoffBrief,
  Wave28IntegrationMonitor,
  Wave29GateTrajectorySnapshot,
  Wave29IntegrationMonitor,
} from './types.ts';

export function buildWave29IntegrationMonitor(args: {
  turn: number;
  wave28ProjectionBrief: Agent25Wave28ProjectionHandoffBrief;
  wave29GateTrajectory?: Wave29GateTrajectorySnapshot;
  wave28IntegrationMonitor: Wave28IntegrationMonitor;
}): Wave29IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m190DryRun =
    args.wave28ProjectionBrief.shouldProjectWave28 &&
    args.wave29GateTrajectory?.band === 'ready' &&
    args.wave28IntegrationMonitor.shouldRunO10m188DryRun;

  if (!args.wave28ProjectionBrief.shouldProjectWave28) {
    reasons.push('Wave 28 projection not cleared');
    shouldRunO10m190DryRun = false;
  }
  if (args.wave29GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 29 gate band ${args.wave29GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m190DryRun = false;
  }
  if (!args.wave28IntegrationMonitor.shouldRunO10m188DryRun) {
    reasons.push('O10-188 dry-run path blocked for wave 29 gate');
    shouldRunO10m190DryRun = false;
  }

  const summary = shouldRunO10m190DryRun
    ? `Wave 29 O10-190 dry-run gate ready (gate EMA ${args.wave29GateTrajectory?.wave29GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 29 integration deferred — ${reasons[0]}`
      : 'Wave 29 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m190DryRun,
    wave29GateBand: args.wave29GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
