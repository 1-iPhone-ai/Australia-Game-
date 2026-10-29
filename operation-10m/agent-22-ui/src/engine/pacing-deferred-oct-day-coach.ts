export interface PacingDeferredOctDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacingDeferredOctDayCoach(input: {
  pacingDeferredCount: number;
  nextGameDay: number;
}): PacingDeferredOctDayCoach {
  if (input.pacingDeferredCount !== 8) {
    return { deferredCount: input.pacingDeferredCount, coachCopy: null };
  }
  return {
    deferredCount: 8,
    coachCopy: `Day ${input.nextGameDay}: Pacing held back eight coach lines for the next calm delivery window.`,
  };
}
