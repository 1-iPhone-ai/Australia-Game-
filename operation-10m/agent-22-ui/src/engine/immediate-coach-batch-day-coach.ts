export interface ImmediateCoachBatchDayCoach {
  immediateCount: number;
  coachCopy: string | null;
}

export function buildImmediateCoachBatchDayCoach(input: {
  immediateCoachLineCount: number;
  nextGameDay: number;
}): ImmediateCoachBatchDayCoach {
  const count = input.immediateCoachLineCount;
  if (count <= 0) {
    return { immediateCount: 0, coachCopy: null };
  }
  const noun = count === 1 ? 'line' : 'lines';
  return {
    immediateCount: count,
    coachCopy: `Day ${input.nextGameDay}: ${count} coach ${noun} ready for immediate screen reader delivery.`,
  };
}
