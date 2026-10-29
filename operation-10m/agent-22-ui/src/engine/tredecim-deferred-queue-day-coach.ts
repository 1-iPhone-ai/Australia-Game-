export interface TredecimDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildTredecimDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): TredecimDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 13) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 13,
    coachCopy: `Day ${input.nextGameDay}: Thirteen coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
