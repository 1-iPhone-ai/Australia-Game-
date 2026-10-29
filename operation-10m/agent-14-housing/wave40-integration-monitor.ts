import type {
  Agent25Wave39ProjectionHandoffBrief,
  Wave39IntegrationMonitor,
  Wave40GateTrajectorySnapshot,
  Wave40IntegrationMonitor,
} from './types.ts';

export function buildWave40IntegrationMonitor(args: {
  turn: number;
  wave39ProjectionBrief: Agent25Wave39ProjectionHandoffBrief;
  wave40GateTrajectory?: Wave40GateTrajectorySnapshot;
  wave39IntegrationMonitor: Wave39IntegrationMonitor;
}): Wave40IntegrationMonitor {
  const reasons: string[] = [];
  let shouldRunO10m212DryRun =
    args.wave39ProjectionBrief.shouldProjectWave39 &&
    args.wave40GateTrajectory?.band === 'ready' &&
    args.wave39IntegrationMonitor.shouldRunO10m210DryRun;

  if (!args.wave39ProjectionBrief.shouldProjectWave39) {
    reasons.push('Wave 39 projection not cleared');
    shouldRunO10m212DryRun = false;
  }
  if (args.wave40GateTrajectory?.band !== 'ready') {
    reasons.push(`Wave 40 gate band ${args.wave40GateTrajectory?.band ?? 'missing'} (need ready)`);
    shouldRunO10m212DryRun = false;
  }
  if (!args.wave39IntegrationMonitor.shouldRunO10m210DryRun) {
    reasons.push('O10-210 dry-run path blocked for wave 40 gate');
    shouldRunO10m212DryRun = false;
  }

  const summary = shouldRunO10m212DryRun
    ? `Wave 40 O10-212 dry-run gate ready (gate EMA ${args.wave40GateTrajectory?.wave40GateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 40 integration deferred — ${reasons[0]}`
      : 'Wave 40 integration pending';

  return {
    turn: args.turn,
    shouldRunO10m212DryRun,
    wave40GateBand: args.wave40GateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
