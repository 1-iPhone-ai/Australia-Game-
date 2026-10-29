export interface NovemDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildNovemDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): NovemDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 9) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 9,
    coachCopy: `Day ${input.nextGameDay}: Nine coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
