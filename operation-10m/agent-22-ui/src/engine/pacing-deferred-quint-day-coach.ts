export interface PacingDeferredQuintDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacingDeferredQuintDayCoach(input: {
  pacingDeferredCount: number;
  nextGameDay: number;
}): PacingDeferredQuintDayCoach {
  if (input.pacingDeferredCount !== 5) {
    return { deferredCount: input.pacingDeferredCount, coachCopy: null };
  }
  return {
    deferredCount: 5,
    coachCopy: `Day ${input.nextGameDay}: Pacing held back five coach lines for the next calm delivery window.`,
  };
}
