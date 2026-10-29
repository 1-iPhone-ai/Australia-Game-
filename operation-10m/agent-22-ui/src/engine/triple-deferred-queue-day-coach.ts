export interface TripleDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildTripleDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): TripleDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 3) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 3,
    coachCopy: `Day ${input.nextGameDay}: Three coach announcements remain staggered — live region delivery will pace them across ticks.`,
  };
}
