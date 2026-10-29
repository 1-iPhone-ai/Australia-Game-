export interface LegacyNavRememberAppliedDayCoach {
  rememberedCount: number;
  coachCopy: string | null;
}

export function buildLegacyNavRememberAppliedDayCoach(input: {
  rememberedCount: number;
  applied: boolean;
  nextGameDay: number;
}): LegacyNavRememberAppliedDayCoach {
  if (!input.applied || input.rememberedCount <= 0) {
    return { rememberedCount: 0, coachCopy: null };
  }
  const noun = input.rememberedCount === 1 ? 'panel' : 'panels';
  return {
    rememberedCount: input.rememberedCount,
    coachCopy: `Day ${input.nextGameDay}: Auto-remembered ${input.rememberedCount} legacy nav ${noun} for deep-link reachability.`,
  };
}
