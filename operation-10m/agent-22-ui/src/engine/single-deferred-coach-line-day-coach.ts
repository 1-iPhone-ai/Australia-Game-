export interface SingleDeferredCoachLineDayCoach {
  queueDepth: number;
  coachCopy: string | null;
}

export function buildSingleDeferredCoachLineDayCoach(input: {
  combinedQueueDepth: number;
  nextGameDay: number;
}): SingleDeferredCoachLineDayCoach {
  if (input.combinedQueueDepth !== 1) {
    return { queueDepth: input.combinedQueueDepth, coachCopy: null };
  }
  return {
    queueDepth: 1,
    coachCopy: `Day ${input.nextGameDay}: One coach announcement remains queued for a later delivery tick.`,
  };
}
