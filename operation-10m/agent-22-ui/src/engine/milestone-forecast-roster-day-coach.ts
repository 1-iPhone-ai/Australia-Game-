import type { MilestoneForecastEntry } from './milestone-forecast-coach.js';

export interface MilestoneForecastRosterDayCoach {
  forecastCount: number;
  coachCopy: string | null;
}

export function buildMilestoneForecastRosterDayCoach(input: {
  entries: MilestoneForecastEntry[];
  nextGameDay: number;
  limit?: number;
}): MilestoneForecastRosterDayCoach {
  const entries = input.entries.slice(0, input.limit ?? 2);
  if (!entries.length) {
    return { forecastCount: 0, coachCopy: null };
  }
  const next = entries[0];
  const eta =
    next.estimatedDaysAway != null ? ` (~${next.estimatedDaysAway} day${next.estimatedDaysAway === 1 ? '' : 's'})` : '';
  const extra = entries.length > 1 ? ` (+${entries.length - 1} more milestones tracked)` : '';
  return {
    forecastCount: entries.length,
    coachCopy: `Day ${input.nextGameDay}: Milestone forecast — ${next.title}${eta}${extra}.`,
  };
}
