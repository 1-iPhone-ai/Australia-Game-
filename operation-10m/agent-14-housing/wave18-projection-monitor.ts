import type {
  Agent25Wave17ProjectionHandoffBrief,
  InlineActivationMonitor,
  ProjectionGateTrajectorySnapshot,
  Wave18ProjectionMonitor,
} from './types.ts';

export function buildWave18ProjectionMonitor(args: {
  turn: number;
  wave17ProjectionBrief: Agent25Wave17ProjectionHandoffBrief;
  projectionGateTrajectory?: ProjectionGateTrajectorySnapshot;
  inlineActivationMonitor: InlineActivationMonitor;
}): Wave18ProjectionMonitor {
  const reasons: string[] = [];
  let shouldRunO10m167DryRun =
    args.wave17ProjectionBrief.shouldProjectWave17 &&
    args.projectionGateTrajectory?.band === 'ready' &&
    args.inlineActivationMonitor.shouldActivateInline;

  if (!args.wave17ProjectionBrief.shouldProjectWave17) {
    reasons.push('Wave 17 projection not cleared');
    shouldRunO10m167DryRun = false;
  }
  if (args.projectionGateTrajectory?.band !== 'ready') {
    reasons.push(
      `Projection gate band ${args.projectionGateTrajectory?.band ?? 'missing'} (need ready)`
    );
    shouldRunO10m167DryRun = false;
  }
  if (!args.inlineActivationMonitor.shouldActivateInline) {
    reasons.push('Inline activation blocked for wave 18 gate');
    shouldRunO10m167DryRun = false;
  }

  const summary = shouldRunO10m167DryRun
    ? `Wave 18 O10-167 dry-run gate ready (gate EMA ${args.projectionGateTrajectory?.projectionGateEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Wave 18 projection deferred — ${reasons[0]}`
      : 'Wave 18 projection pending';

  return {
    turn: args.turn,
    shouldRunO10m167DryRun,
    projectionGateBand: args.projectionGateTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
