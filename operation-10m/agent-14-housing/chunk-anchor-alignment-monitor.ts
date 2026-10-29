import type {
  Agent25AssemblyHandoffBrief,
  ChunkAnchorAlignmentMonitor,
  HandoffTrajectorySnapshot,
  IntegrationTrajectorySnapshot,
  ReadinessTrajectorySnapshot,
  ResumptionTrajectorySnapshot,
  WireInTrajectorySnapshot,
} from './types.ts';

export function buildChunkAnchorAlignmentMonitor(args: {
  turn: number;
  handoffBrief: Agent25AssemblyHandoffBrief;
  wireInTrajectory?: WireInTrajectorySnapshot;
  integrationTrajectory?: IntegrationTrajectorySnapshot;
  handoffTrajectory?: HandoffTrajectorySnapshot;
  resumptionTrajectory?: ResumptionTrajectorySnapshot;
  readinessTrajectory?: ReadinessTrajectorySnapshot;
}): ChunkAnchorAlignmentMonitor {
  const reasons: string[] = [];
  const trajectorySlots = [
    args.wireInTrajectory,
    args.integrationTrajectory,
    args.handoffTrajectory,
    args.resumptionTrajectory,
    args.readinessTrajectory,
  ];
  const trajectoryCoverage = trajectorySlots.filter(Boolean).length;
  const requiredTrajectoryCount = trajectorySlots.length;

  let anchorAligned =
    args.handoffBrief.shouldHandoffChunk &&
    args.wireInTrajectory?.band === 'active' &&
    trajectoryCoverage === requiredTrajectoryCount;

  if (!args.handoffBrief.shouldHandoffChunk) {
    reasons.push('Assembly handoff not set');
    anchorAligned = false;
  }
  if (args.wireInTrajectory?.band !== 'active') {
    reasons.push(`Wire-in band ${args.wireInTrajectory?.band ?? 'missing'} (need active)`);
    anchorAligned = false;
  }
  if (trajectoryCoverage < requiredTrajectoryCount) {
    reasons.push(`Trajectory coverage ${trajectoryCoverage}/${requiredTrajectoryCount}`);
    anchorAligned = false;
  }

  const summary = anchorAligned
    ? `OP10M anchor alignment: ${trajectoryCoverage}/${requiredTrajectoryCount} trajectories ready`
    : reasons.length > 0
      ? `Anchor alignment blocked — ${reasons[0]}`
      : 'Anchor alignment pending';

  return {
    turn: args.turn,
    anchorAligned,
    trajectoryCoverage,
    requiredTrajectoryCount,
    blockingReasons: reasons.slice(0, 3),
    summary,
  };
}
