export interface QuadDeferredQueueDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildQuadDeferredQueueDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): QuadDeferredQueueDayCoach {
  if (input.combinedQueueDepth !== 4) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 4,
    coachCopy: `Day ${input.nextGameDay}: Four coach announcements remain queued — stagger pacing protects focus during day advance.`,
  };
}
