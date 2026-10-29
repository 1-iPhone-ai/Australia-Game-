import type {
  Agent25Wave22ProjectionHandoffBrief,
  Wave22IntegrationMonitor,
  Wave23GateTrajectorySnapshot,
  Wave23IntegrationMonitor,
} from './types.ts';

export function buildWave23IntegrationMonitor(args: {
  turn: number;
  wave22ProjectionBrief: Agent25Wave22ProjectionHandoffBrief;
  wave23GateTrajectory?: Wave23GateTrajectorySnapshot;
  wave22IntegrationMonitor: Wave22IntegrationMonitor;
}): Wave23IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m178DryRun =
    args.wave22ProjectionBrief.shouldProjectWave22 &&
    args.wave23GateTrajectory?.band === 'ready' &&
    args.wave22IntegrationMonitor.shouldRunO10m176DryRun;

  if (!args.wave22ProjectionBrief.shouldProjectWave22) {
    reasons.push('Wave 22 projection not cleared');
    shouldRunO10m178DryRun = false;
  }
  if (args.wave23GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 23 gate band ${args.wave23GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m178DryRun = false;
  }
  if (!args.wave22IntegrationMonitor.shouldRunO10m176DryRun) {
    reasons.push('O10-176 dry-run path blocked for wave 23 gate');
    shouldRunO10m178DryRun = false;
  }

  const summary = shouldRunO10m178DryRun
    ? `Wave 23 O10-178 dry-run gate ready (gate EMA ${args.wave23GateTrajectory?.wave23GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 23 integration deferred — ${reasons[0]}`
      : 'Wave 23 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m178DryRun,
    wave23GateBand: args.wave23GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
