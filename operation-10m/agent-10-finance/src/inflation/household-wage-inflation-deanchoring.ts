import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type HouseholdWageInflationDeanchoringBand = 'anchored' | 'drifting' | 'deanchored' | 'spiral';

export interface HouseholdWageInflationDeanchoringAssessment {
  deanchoringBand: HouseholdWageInflationDeanchoringBand;
  householdIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Household wage growth and expectations de-anchoring (Agent 09). */
export function assessHouseholdWageInflationDeanchoring(input: {
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  householdExpectationsDeanchoring: boolean;
  wagePriceSpiralLatch: boolean;
  householdDeanchoringBand: 'anchored' | 'drifting' | 'unmoored';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HouseholdWageInflationDeanchoringAssessment {
  let pressure = 0;
  if (input.wageGrowthBand === 'surge') {
    pressure += 0.24;
  } else if (input.wageGrowthBand === 'elevated') {
    pressure += 0.13;
  }
  if (input.costOfLivingStress === 'extreme') {
    pressure += 0.2;
  } else if (input.costOfLivingStress === 'high') {
    pressure += 0.1;
  }
  if (input.householdExpectationsDeanchoring) {
    pressure += 0.16;
  }
  if (input.wagePriceSpiralLatch) {
    pressure += 0.14;
  }
  if (input.householdDeanchoringBand === 'unmoored') {
    pressure += 0.22;
  } else if (input.householdDeanchoringBand === 'drifting') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0036, 0, 1.05);
  const householdIndex = finRound(100 + pressure * 16, 1);

  let deanchoringBand: HouseholdWageInflationDeanchoringBand = 'anchored';
  if (pressure >= 0.56) deanchoringBand = 'spiral';
  else if (pressure >= 0.36) deanchoringBand = 'deanchored';
  else if (pressure >= 0.16) deanchoringBand = 'drifting';

  const inflationScoreNudge =
    deanchoringBand === 'spiral'
      ? 0.091
      : deanchoringBand === 'deanchored'
        ? 0.058
        : deanchoringBand === 'drifting'
          ? 0.027
          : 0;

  const narrative =
    deanchoringBand === 'spiral' || deanchoringBand === 'deanchored'
      ? 'Household wage expectations de-anchoring lifting CPI metadata.'
      : deanchoringBand === 'drifting'
        ? 'Wage-price spiral latch building under cost-of-living stress.'
        : 'Household wage inflation expectations anchored versus headline.';

  return { deanchoringBand, householdIndex, inflationScoreNudge, narrative };
}

export function householdWageInflationDeanchoringScoreAdjustment(
  band: HouseholdWageInflationDeanchoringBand,
): number {
  if (band === 'spiral') return 4;
  if (band === 'deanchored') return 3;
  if (band === 'drifting') return 2;
  return 0;
}
