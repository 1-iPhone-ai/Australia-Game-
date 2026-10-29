import type { MilestoneForecastEntry } from './milestone-forecast-coach.js';

export interface NearestMilestoneEtaDayCoach {
  milestoneId: string | null;
  daysAway: number | null;
  coachCopy: string | null;
}

export function buildNearestMilestoneEtaDayCoach(input: {
  entries: MilestoneForecastEntry[];
  nextGameDay: number;
}): NearestMilestoneEtaDayCoach {
  const nearest = input.entries.find(e => e.estimatedDaysAway != null && e.estimatedDaysAway > 0);
  if (!nearest || nearest.estimatedDaysAway == null) {
    return { milestoneId: null, daysAway: null, coachCopy: null };
  }
  const days = nearest.estimatedDaysAway;
  const dayWord = days === 1 ? 'day' : 'days';
  return {
    milestoneId: nearest.milestoneId,
    daysAway: days,
    coachCopy: `Day ${input.nextGameDay}: "${nearest.title}" may arrive in about ${days} ${dayWord}.`,
  };
}
