import type { ProgressionSignalSnapshot } from '../types/progression.js';
import {
  forecastUpcomingMilestones,
  milestoneForecastCoachCopy,
} from './milestone-forecast-coach.js';

export interface MilestoneForecastDayCoach {
  forecastCount: number;
  coachCopy: string | null;
}

export function buildMilestoneForecastDayCoach(input: {
  signals: ProgressionSignalSnapshot;
  nextGameDay: number;
  limit?: number;
}): MilestoneForecastDayCoach {
  const entries = forecastUpcomingMilestones(input.signals, input.limit ?? 2);
  const base = milestoneForecastCoachCopy(entries);
  const coachCopy = base ? `Day ${input.nextGameDay}: ${base}` : null;
  return {
    forecastCount: entries.length,
    coachCopy,
  };
}
