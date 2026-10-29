export interface PacingDeferredJanDayCoach {
  deferredCount: number;
  coachCopy: string | null;
}

export function buildPacingDeferredJanDayCoach(input: {
  pacingDeferredCount: number;
  nextGameDay: number;
}): PacingDeferredJanDayCoach {
  if (input.pacingDeferredCount !== 8) {
    return { deferredCount: input.pacingDeferredCount, coachCopy: null };
  }
  return {
    deferredCount: 8,
    coachCopy: `Day ${input.nextGameDay}: Pacing held back eight coach lines for the next calm delivery window.`,
  };
}
