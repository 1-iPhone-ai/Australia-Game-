import type {
  Agent25InlineReadinessBrief,
  AssemblyMergeTrajectorySnapshot,
  ChunkAnchorAlignmentMonitor,
} from './types.ts';

export function composeAgent25InlineReadinessBrief(args: {
  turn: number;
  anchorMonitor: ChunkAnchorAlignmentMonitor;
  assemblyMergeTrajectory?: AssemblyMergeTrajectorySnapshot;
}): Agent25InlineReadinessBrief {
  const shouldInlineChunk =
    args.anchorMonitor.anchorAligned && args.assemblyMergeTrajectory?.band === 'ready';

  const headlines: string[] = [];
  if (shouldInlineChunk) {
    headlines.push('Agent 25: inline chunk at O10M_AGENT14_CAPACITY_DELAY_ANCHOR');
  } else {
    headlines.push('Agent 25 inline deferred — anchor or merge trajectory not ready');
  }
  if (args.anchorMonitor.trajectoryCoverage > 0) {
    headlines.push(
      `${args.anchorMonitor.trajectoryCoverage}/${args.anchorMonitor.requiredTrajectoryCount} persisted trajectories aligned`
    );
  }
  if (args.assemblyMergeTrajectory?.trajectory === 'improving') {
    headlines.push('Assembly merge trajectory improving');
  }

  const summary = `inline=${shouldInlineChunk} anchor=${args.anchorMonitor.anchorAligned} mergeBand=${args.assemblyMergeTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldInlineChunk,
    anchorAligned: args.anchorMonitor.anchorAligned,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
