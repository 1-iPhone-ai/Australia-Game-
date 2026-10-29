export interface PacingDeferredSextDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacingDeferredSextDayCoach(input: {
  pacingDeferredCount: number;
  nextGameDay: number;
}): PacingDeferredSextDayCoach {
  if (input.pacingDeferredCount !== 6) {
    return { deferredCount: input.pacingDeferredCount, coachCopy: null };
  }
  return {
    deferredCount: 6,
    coachCopy: `Day ${input.nextGameDay}: Pacing held back six coach lines for the next calm delivery window.`,
  };
}
