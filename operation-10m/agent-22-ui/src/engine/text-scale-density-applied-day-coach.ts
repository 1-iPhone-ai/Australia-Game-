export interface TextScaleDensityAppliedDayCoach {
  applied: boolean;
  coachCopy: string | null;
}

export function buildTextScaleDensityAppliedDayCoach(input: {
  applied: boolean;
  nextGameDay: number;
}): TextScaleDensityAppliedDayCoach {
  if (!input.applied) {
    return { applied: false, coachCopy: null };
  }
  return {
    applied: true,
    coachCopy: `Day ${input.nextGameDay}: Text scale hint auto-applied a more readable UI density profile.`,
  };
}
