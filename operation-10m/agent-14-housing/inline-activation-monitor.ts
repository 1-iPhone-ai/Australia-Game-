import type {
  Agent25InlineReadinessBrief,
  InlineActivationMonitor,
  InlineMergeTrajectorySnapshot,
  TurnBoundaryActivationMonitor,
} from './types.ts';

export function buildInlineActivationMonitor(args: {
  turn: number;
  inlineBrief: Agent25InlineReadinessBrief;
  inlineMergeTrajectory?: InlineMergeTrajectorySnapshot;
  activationMonitor: TurnBoundaryActivationMonitor;
}): InlineActivationMonitor {
  const reasons: string[] = [];
  let shouldActivateInline =
    args.inlineBrief.shouldInlineChunk &&
    args.inlineMergeTrajectory?.band === 'ready' &&
    args.activationMonitor.shouldActivateTurnBoundary;

  if (!args.inlineBrief.shouldInlineChunk) {
    reasons.push('Inline readiness not set');
    shouldActivateInline = false;
  }
  if (args.inlineMergeTrajectory?.band !== 'ready') {
    reasons.push(`Inline merge band ${args.inlineMergeTrajectory?.band ?? 'missing'} (need ready)`);
    shouldActivateInline = false;
  }
  if (!args.activationMonitor.shouldActivateTurnBoundary) {
    reasons.push('Turn boundary activation blocked');
    shouldActivateInline = false;
  }

  const summary = shouldActivateInline
    ? `Inline activation: ready at OP10M anchor (merge EMA ${args.inlineMergeTrajectory?.inlineMergeEma ?? 'n/a'})`
    : reasons.length > 0
      ? `Inline activation blocked — ${reasons[0]}`
      : 'Inline activation pending';

  return {
    turn: args.turn,
    shouldActivateInline,
    inlineMergeBand: args.inlineMergeTrajectory?.band ?? 'pending',
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
