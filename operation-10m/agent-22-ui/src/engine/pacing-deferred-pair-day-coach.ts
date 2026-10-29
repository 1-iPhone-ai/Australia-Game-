export interface PacingDeferredPairDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacingDeferredPairDayCoach(input: {
  pacingDeferredCount: number;
  nextGameDay: number;
}): PacingDeferredPairDayCoach {
  if (input.pacingDeferredCount !== 2) {
    return { deferredCount: input.pacingDeferredCount, coachCopy: null };
  }
  return {
    deferredCount: 2,
    coachCopy: `Day ${input.nextGameDay}: Pacing held back two coach lines for the next calm delivery window.`,
  };
}
