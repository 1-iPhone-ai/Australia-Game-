export interface AnnouncementQueueDepthDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildAnnouncementQueueDepthDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
  minDepth?: number;
}): AnnouncementQueueDepthDayCoach {
  const min = input.minDepth ?? 2;
  if (input.combinedQueueDepth < min) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  const noun = input.combinedQueueDepth === 1 ? 'announcement' : 'announcements';
  return {
    queueDepth: input.combinedQueueDepth,
    coachCopy: `Day ${input.nextGameDay}: ${input.combinedQueueDepth} coach ${noun} waiting in the delivery queue.`,
  };
}
