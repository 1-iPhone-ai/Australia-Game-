export interface PacingDeferredQuadDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacingDeferredQuadDayCoach(input: {
  pacingDeferredCount: number;
  nextGameDay: number;
}): PacingDeferredQuadDayCoach {
  if (input.pacingDeferredCount !== 4) {
    return { deferredCount: input.pacingDeferredCount, coachCopy: null };
  }
  return {
    deferredCount: 4,
    coachCopy: `Day ${input.nextGameDay}: Pacing held back four coach lines for the next calm delivery window.`,
  };
}
