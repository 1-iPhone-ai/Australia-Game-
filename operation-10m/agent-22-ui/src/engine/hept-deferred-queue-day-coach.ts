export interface HeptDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildHeptDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): HeptDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 7) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 7,
    coachCopy: `Day ${input.nextGameDay}: Seven coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
