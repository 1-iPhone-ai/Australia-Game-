export interface CalmRecoveryAutoAppliedDayCoach {
  applied: boolean;
  coachCopy: string | null;
}

export function buildCalmRecoveryAutoAppliedDayCoach(input: {
  applied: boolean;
  nextGameDay: number;
}): CalmRecoveryAutoAppliedDayCoach {
  if (!input.applied) {
    return { applied: false, coachCopy: null };
  }
  return {
    applied: true,
    coachCopy: `Day ${input.nextGameDay}: Calm recovery auto-applied — coaching snoozed and spacing widened for upcoming days.`,
  };
}
