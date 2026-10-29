export interface PacingDeferredTripleDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacingDeferredTripleDayCoach(input: {
  pacingDeferredCount: number;
  nextGameDay: number;
}): PacingDeferredTripleDayCoach {
  if (input.pacingDeferredCount !== 3) {
    return { deferredCount: input.pacingDeferredCount, coachCopy: null };
  }
  return {
    deferredCount: 3,
    coachCopy: `Day ${input.nextGameDay}: Pacing held back three coach lines for the next calm delivery window.`,
  };
}
