import type {
  Agent25Wave49ProjectionHandoffBrief,
  Wave49IntegrationMonitor,
  Wave50GateTrajectorySnapshot,
  Wave50IntegrationMonitor,
} from './types.ts';

export function buildWave50IntegrationMonitor(args: {
  turn: number;
  wave49ProjectionBrief: Agent25Wave49ProjectionHandoffBrief;
  wave50GateTrajectory?: Wave50GateTrajectorySnapshot;
  wave49IntegrationMonitor: Wave49IntegrationMonitor;
}): Wave50IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m229DryRun =
    args.wave49ProjectionBrief.shouldProjectWave49 &&
    args.wave50GateTrajectory?.band === 'ready' &&
    args.wave49IntegrationMonitor.shouldRunO10m227DryRun;

  if (!args.wave49ProjectionBrief.shouldProjectWave49) {
    reasons.push('Wave 49 projection not cleared');
    shouldRunO10m229DryRun = false;
  }
  if (args.wave50GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 50 gate band ${args.wave50GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m229DryRun = false;
  }
  if (!args.wave49IntegrationMonitor.shouldRunO10m227DryRun) {
    reasons.push('O10-227 dry-run path blocked for wave 50 gate');
    shouldRunO10m229DryRun = false;
  }

  const summary = shouldRunO10m229DryRun
    ? `Wave 50 O10-229 dry-run gate ready (gate EMA ${args.wave50GateTrajectory?.wave50GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 50 integration deferred — ${reasons[0]}`
      : 'Wave 50 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m229DryRun,
    wave50GateBand: args.wave50GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
