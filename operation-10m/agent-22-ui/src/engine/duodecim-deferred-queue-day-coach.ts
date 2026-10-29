export interface DuodecimDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildDuodecimDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): DuodecimDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 12) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 12,
    coachCopy: `Day ${input.nextGameDay}: Twelve coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
