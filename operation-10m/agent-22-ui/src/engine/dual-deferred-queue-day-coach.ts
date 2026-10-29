export interface DualDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildDualDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): DualDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 2) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 2,
    coachCopy: `Day ${input.nextGameDay}: Two coach announcements remain staggered in the delivery queue.`,
  };
}
