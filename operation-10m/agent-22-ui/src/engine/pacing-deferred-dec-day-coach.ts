export interface PacingDeferredDecDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacingDeferredDecDayCoach(input: {
  pacingDeferredCount: number;
  nextGameDay: number;
}): PacingDeferredDecDayCoach {
  if (input.pacingDeferredCount !== 8) {
    return { deferredCount: input.pacingDeferredCount, coachCopy: null };
  }
  return {
    deferredCount: 8,
    coachCopy: `Day ${input.nextGameDay}: Pacing held back eight coach lines for the next calm delivery window.`,
  };
}
