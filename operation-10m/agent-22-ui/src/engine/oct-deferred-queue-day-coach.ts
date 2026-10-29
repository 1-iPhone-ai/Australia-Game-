export interface OctDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildOctDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): OctDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 8) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 8,
    coachCopy: `Day ${input.nextGameDay}: Eight coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
