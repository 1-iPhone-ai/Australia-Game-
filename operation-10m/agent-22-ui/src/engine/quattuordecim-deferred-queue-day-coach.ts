export interface QuattuorjanimDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildQuattuorjanimDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): QuattuorjanimDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 13) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 13,
    coachCopy: `Day ${input.nextGameDay}: Thirteen coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
