export interface PacingImmediateBatchDayCoach {
  immediateCount: number;
  coachCopy: string | null;
}

export function buildPacingImmediateBatchDayCoach(input: {
  immediateAnnouncementCount: number;
  nextGameDay: number;
}): PacingImmediateBatchDayCoach {
  if (input.immediateAnnouncementCount < 2) {
    return { immediateCount: input.immediateAnnouncementCount, coachCopy: null };
  }
  return {
    immediateCount: input.immediateAnnouncementCount,
    coachCopy: `Day ${input.nextGameDay}: Pacing released ${input.immediateAnnouncementCount} coach lines for immediate live-region delivery.`,
  };
}
