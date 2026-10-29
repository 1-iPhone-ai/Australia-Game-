import type {
  Agent25Wave17ProjectionHandoffBrief,
  InlineActivationMonitor,
  InlineMergeTrajectorySnapshot,
} from './types.ts';

export function composeAgent25Wave17ProjectionHandoffBrief(args: {
  turn: number;
  inlineActivationMonitor: InlineActivationMonitor;
  inlineMergeTrajectory?: InlineMergeTrajectorySnapshot;
}): Agent25Wave17ProjectionHandoffBrief {
  const shouldProjectWave17 =
    args.inlineActivationMonitor.shouldActivateInline &&
    args.inlineMergeTrajectory?.trajectory !== 'deteriorating';

  const headlines: string[] = [];
  if (shouldProjectWave17) {
    headlines.push('Agent 25: project wave 17 module gate after inline activation');
  } else {
    headlines.push('Agent 25 wave 17 projection deferred — inline path not stable');
  }
  if (args.inlineMergeTrajectory?.band === 'ready') {
    headlines.push('Inline merge trajectory ready for O10-164 dry-run');
  }
  if (args.inlineActivationMonitor.inlineMergeBand === 'blocked') {
    headlines.push('Inline merge band blocked — hold projection handoff');
  }

  const summary = `project=${shouldProjectWave17} inline=${args.inlineActivationMonitor.shouldActivateInline} band=${args.inlineMergeTrajectory?.band ?? 'n/a'}`;

  return {
    turn: args.turn,
    shouldProjectWave17,
    shouldActivateInline: args.inlineActivationMonitor.shouldActivateInline,
    headlines: headlines.slice(0, 3),
    summary,
  };
}
