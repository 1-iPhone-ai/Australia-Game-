import type {
  Agent25AssemblyHandoffBrief,
  TurnBoundaryActivationMonitor,
  WireInTrajectorySnapshot,
} from './types.ts';

export function composeAgent25AssemblyHandoffBrief(args: {
  turn: number;
  activationMonitor: TurnBoundaryActivationMonitor;
  wireInTrajectory?: WireInTrajectorySnapshot;
}): Agent25AssemblyHandoffBrief {
  const shouldHandoffChunk =
    args.activationMonitor.shouldActivateTurnBoundary &&
    args.wireInTrajectory?.band === 'active';

  const headlines: string[] = [];
  if (shouldHandoffChunk) {
    headlines.push('Agent 25: merge chunk at OP10M anchor with persisted trajectories');
  } else {
    headlines.push('Agent 25 handoff deferred — turn boundary not active');
  }
  if (args.activationMonitor.dueCommitCount > 0) {
    headlines.push(`${args.activationMonitor.dueCommitCount} commits align with boundary activation`);
  }
  if (args.wireInTrajectory?.trajectory === 'improving') {
    headlines.push('Wire-in activation trajectory improving');
  }

  const summary = `handoff=${shouldHandoffChunk} activate=${args.activationMonitor.shouldActivateTurnBoundary} band=${args.wireInTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldHandoffChunk,
    shouldActivateTurnBoundary: args.activationMonitor.shouldActivateTurnBoundary,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
