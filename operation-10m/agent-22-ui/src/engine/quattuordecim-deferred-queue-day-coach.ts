export interface QuattuordecimDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildQuattuordecimDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): QuattuordecimDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 14) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 14,
    coachCopy: `Day ${input.nextGameDay}: Fourteen coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
