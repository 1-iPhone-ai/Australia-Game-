import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type CalendarSeasonInflationCarryoverBand = 'off_season' | 'normal' | 'peak' | 'carryover_shock';

export interface CalendarSeasonInflationCarryoverAssessment {
  carryoverBand: CalendarSeasonInflationCarryoverBand;
  calendarIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Calendar season and multi-turn inflation carryover (Agent 02). */
export function assessCalendarSeasonInflationCarryover(input: {
  calendarSeasonBand: 'off_peak' | 'normal' | 'peak_demand';
  policyReviewWindowOpen: boolean;
  multiTurnInflationCarryover: number;
  fiscalCalendarInflationLatch: boolean;
  multiTurnCarryoverBand: 'muted' | 'building' | 'persistent';
  inflationBand: InflationConditionsBand;
  turn: number;
}): CalendarSeasonInflationCarryoverAssessment {
  let pressure = 0;
  if (input.calendarSeasonBand === 'peak_demand') {
    pressure += 0.2;
  } else if (input.calendarSeasonBand === 'normal') {
    pressure += 0.06;
  }
  pressure += finClamp(input.multiTurnInflationCarryover, 0, 1) * 0.28;
  if (input.policyReviewWindowOpen && input.calendarSeasonBand === 'peak_demand') {
    pressure += 0.1;
  }
  if (input.fiscalCalendarInflationLatch) {
    pressure += 0.14;
  }
  if (input.multiTurnCarryoverBand === 'persistent') {
    pressure += 0.2;
  } else if (input.multiTurnCarryoverBand === 'building') {
    pressure += 0.1;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const calendarIndex = finRound(100 + pressure * 15, 1);

  let carryoverBand: CalendarSeasonInflationCarryoverBand = 'off_season';
  if (pressure >= 0.54) carryoverBand = 'carryover_shock';
  else if (pressure >= 0.34) carryoverBand = 'peak';
  else if (pressure >= 0.15) carryoverBand = 'normal';

  const inflationScoreNudge =
    carryoverBand === 'carryover_shock'
      ? 0.086
      : carryoverBand === 'peak'
        ? 0.054
        : carryoverBand === 'normal'
          ? 0.024
          : 0;

  const narrative =
    carryoverBand === 'carryover_shock' || carryoverBand === 'peak'
      ? 'Calendar season and multi-turn carryover lifting CPI through peak demand windows.'
      : carryoverBand === 'normal'
        ? 'Seasonal inflation carryover building across turn boundaries.'
        : 'Calendar carryover subdued versus headline CPI.';

  return { carryoverBand, calendarIndex, inflationScoreNudge, narrative };
}

export function calendarSeasonInflationCarryoverScoreAdjustment(band: CalendarSeasonInflationCarryoverBand): number {
  if (band === 'carryover_shock') return 4;
  if (band === 'peak') return 3;
  if (band === 'normal') return 2;
  return 0;
}
