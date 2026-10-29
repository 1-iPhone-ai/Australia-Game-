import type {
  Agent25Wave57ProjectionHandoffBrief,
  Wave57IntegrationMonitor,
  Wave59GateTrajectorySnapshot,
  Wave59IntegrationMonitor,
} from './types.ts';

export function buildWave59IntegrationMonitor(args: {
  turn: number;
  wave57ProjectionBrief: Agent25Wave57ProjectionHandoffBrief;
  wave59GateTrajectory?: Wave59GateTrajectorySnapshot;
  wave57IntegrationMonitor: Wave57IntegrationMonitor;
}): Wave59IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m263DryRun =
    args.wave57ProjectionBrief.shouldProjectWave57 &&
    args.wave59GateTrajectory?.band === 'ready' &&
    args.wave57IntegrationMonitor.shouldRunO10m260DryRun;

  if (!args.wave57ProjectionBrief.shouldProjectWave57) {
    reasons.push('Wave 57 projection not cleared');
    shouldRunO10m263DryRun = false;
  }
  if (args.wave59GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 59 gate band ${args.wave59GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m263DryRun = false;
  }
  if (!args.wave57IntegrationMonitor.shouldRunO10m260DryRun) {
    reasons.push('O10-260 dry-run path blocked for wave 58 gate');
    shouldRunO10m263DryRun = false;
  }

  const summary = shouldRunO10m263DryRun
    ? `Wave 59 O10-263 dry-run gate ready (gate EMA ${args.wave59GateTrajectory?.wave59GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 59 integration deferred — ${reasons[0]}`
      : 'Wave 59 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m263DryRun,
    wave59GateBand: args.wave59GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
