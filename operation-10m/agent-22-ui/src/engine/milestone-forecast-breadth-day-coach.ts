import type { MilestoneForecastEntry } from './milestone-forecast-coach.js';

export interface MilestoneForecastBreadthDayCoach {
  forecastCount: number;
  coachCopy: string | null;
}

export function buildMilestoneForecastBreadthDayCoach(input: {
  entries: MilestoneForecastEntry[];
  nextGameDay: number;
}): MilestoneForecastBreadthDayCoach {
  if (!input.entries.length) {
    return { forecastCount: 0, coachCopy: null };
  }
  return {
    forecastCount: input.entries.length,
    coachCopy: `Day ${input.nextGameDay}: ${input.entries.length} upcoming milestone${input.entries.length === 1 ? '' : 's'} in the progression forecast.`,
  };
}
