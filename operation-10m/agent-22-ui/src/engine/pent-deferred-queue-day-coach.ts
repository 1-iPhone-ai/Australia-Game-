export interface PentDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildPentDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): PentDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 5) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 5,
    coachCopy: `Day ${input.nextGameDay}: Five coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
