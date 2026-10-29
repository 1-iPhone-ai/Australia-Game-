export interface QuattuordecimDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildQuattuordecimDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): QuattuordecimDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 13) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 13,
    coachCopy: `Day ${input.nextGameDay}: Fourteen coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
