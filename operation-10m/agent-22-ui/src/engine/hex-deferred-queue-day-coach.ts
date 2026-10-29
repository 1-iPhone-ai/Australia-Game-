export interface HexDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildHexDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): HexDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 6) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 6,
    coachCopy: `Day ${input.nextGameDay}: Six coach announcements remain queued — day-advance pacing will drip them across upcoming ticks.`,
  };
}
