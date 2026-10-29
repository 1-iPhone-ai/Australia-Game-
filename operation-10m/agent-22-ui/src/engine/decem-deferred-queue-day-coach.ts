export interface DecemDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildDecemDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): DecemDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 10) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 10,
    coachCopy: `Day ${input.nextGameDay}: Ten coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
