export interface FlushRehydrateBatchDayCoach {
  flushedCount: number;
  coachCopy: string | null;
}

export function buildFlushRehydrateBatchDayCoach(input: {
  flushedCount: number;
  nextGameDay: number;
}): FlushRehydrateBatchDayCoach {
  if (input.flushedCount < 2) {
    return { flushedCount: input.flushedCount, coachCopy: null };
  }
  return {
    flushedCount: input.flushedCount,
    coachCopy: `Day ${input.nextGameDay}: Rehydrated ${input.flushedCount} deferred coach lines into today's immediate delivery batch.`,
  };
}
