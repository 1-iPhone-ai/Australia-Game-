export interface FlushedDeferredQueueDayCoach {
  flushedCount: number;
  coachCopy: string | null;
}

export function buildFlushedDeferredQueueDayCoach(input: {
  flushedCount: number;
  nextGameDay: number;
}): FlushedDeferredQueueDayCoach {
  if (input.flushedCount <= 0) {
    return { flushedCount: 0, coachCopy: null };
  }
  const noun = input.flushedCount === 1 ? 'line' : 'lines';
  return {
    flushedCount: input.flushedCount,
    coachCopy: `Day ${input.nextGameDay}: Cleared ${input.flushedCount} deferred coach ${noun} from the pacing queue.`,
  };
}
