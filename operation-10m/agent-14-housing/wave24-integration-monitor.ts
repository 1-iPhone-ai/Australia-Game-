import type {
  Agent25Wave23ProjectionHandoffBrief,
  Wave23IntegrationMonitor,
  Wave24GateTrajectorySnapshot,
  Wave24IntegrationMonitor,
} from './types.ts';

export function buildWave24IntegrationMonitor(args: {
  turn: number;
  wave23ProjectionBrief: Agent25Wave23ProjectionHandoffBrief;
  wave24GateTrajectory?: Wave24GateTrajectorySnapshot;
  wave23IntegrationMonitor: Wave23IntegrationMonitor;
}): Wave24IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m180DryRun =
    args.wave23ProjectionBrief.shouldProjectWave23 &&
    args.wave24GateTrajectory?.band === 'ready' &&
    args.wave23IntegrationMonitor.shouldRunO10m178DryRun;

  if (!args.wave23ProjectionBrief.shouldProjectWave23) {
    reasons.push('Wave 23 projection not cleared');
    shouldRunO10m180DryRun = false;
  }
  if (args.wave24GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 24 gate band ${args.wave24GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m180DryRun = false;
  }
  if (!args.wave23IntegrationMonitor.shouldRunO10m178DryRun) {
    reasons.push('O10-178 dry-run path blocked for wave 24 gate');
    shouldRunO10m180DryRun = false;
  }

  const summary = shouldRunO10m180DryRun
    ? `Wave 24 O10-180 dry-run gate ready (gate EMA ${args.wave24GateTrajectory?.wave24GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 24 integration deferred — ${reasons[0]}`
      : 'Wave 24 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m180DryRun,
    wave24GateBand: args.wave24GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
