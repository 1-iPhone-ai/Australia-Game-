export interface PacingDeferredSeptDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacingDeferredSeptDayCoach(input: {
  pacingDeferredCount: number;
  nextGameDay: number;
}): PacingDeferredSeptDayCoach {
  if (input.pacingDeferredCount !== 7) {
    return { deferredCount: input.pacingDeferredCount, coachCopy: null };
  }
  return {
    deferredCount: 7,
    coachCopy: `Day ${input.nextGameDay}: Pacing held back seven coach lines for the next calm delivery window.`,
  };
}
