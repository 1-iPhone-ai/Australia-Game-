export interface CoachAnnouncementVolumeDayCoach {
  announcementCount: number;
  coachCopy: string | null;
}

export function buildCoachAnnouncementVolumeDayCoach(input: {
  coachAnnouncementCount: number;
  nextGameDay: number;
  minCount?: number;
}): CoachAnnouncementVolumeDayCoach {
  const min = input.minCount ?? 2;
  if (input.coachAnnouncementCount < min) {
    return { announcementCount: input.coachAnnouncementCount, coachCopy: null };
  }
  return {
    announcementCount: input.coachAnnouncementCount,
    coachCopy: `Day ${input.nextGameDay}: ${input.coachAnnouncementCount} unlock coach announcements prepared for this day advance.`,
  };
}
