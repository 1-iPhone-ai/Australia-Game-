export interface DedupSuppressedBatchDayCoach {
  suppressedCount: number;
  coachCopy: string | null;
}

export function buildDedupSuppressedBatchDayCoach(input: {
  suppressedCount: number;
  nextGameDay: number;
}): DedupSuppressedBatchDayCoach {
  if (input.suppressedCount <= 0) {
    return { suppressedCount: 0, coachCopy: null };
  }
  const noun = input.suppressedCount === 1 ? 'line' : 'lines';
  return {
    suppressedCount: input.suppressedCount,
    coachCopy: `Day ${input.nextGameDay}: ${input.suppressedCount} duplicate coach ${noun} skipped to protect screen reader calm.`,
  };
}
