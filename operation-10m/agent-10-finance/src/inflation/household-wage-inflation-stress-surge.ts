import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type HouseholdWageInflationStressSurgeBand = 'contained' | 'building' | 'surge' | 'wage_crisis';

export interface HouseholdWageInflationStressSurgeAssessment {
  surgeBand: HouseholdWageInflationStressSurgeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Household wage inflation stress surge (Agent 09, round 46). */
export function assessHouseholdWageInflationStressSurge(input: {
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  wave46HouseholdStressLatch: boolean;
  wageStressSurgeBand: 'contained' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HouseholdWageInflationStressSurgeAssessment {
  let pressure = 0;
  if (input.wageGrowthBand === 'surge') pressure += 0.21;
  else if (input.wageGrowthBand === 'elevated') pressure += 0.11;
  if (input.costOfLivingStress === 'extreme') pressure += 0.19;
  else if (input.costOfLivingStress === 'high') pressure += 0.09;
  if (input.wave46HouseholdStressLatch) pressure += 0.13;
  if (input.wageStressSurgeBand === 'ruptured') pressure += 0.22;
  else if (input.wageStressSurgeBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0037, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 15, 1);

  let surgeBand: HouseholdWageInflationStressSurgeBand = 'contained';
  if (pressure >= 0.57) surgeBand = 'wage_crisis';
  else if (pressure >= 0.37) surgeBand = 'surge';
  else if (pressure >= 0.16) surgeBand = 'building';

  const inflationScoreNudge =
    surgeBand === 'wage_crisis'
      ? 0.091
      : surgeBand === 'surge'
        ? 0.058
        : surgeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    surgeBand === 'wage_crisis' || surgeBand === 'surge'
      ? 'Household wage stress surge feeding CPI essential metadata.'
      : surgeBand === 'building'
        ? 'Wage stress latch building under cost-of-living pressure.'
        : 'Household wage stress surge contained versus headline CPI.';

  return { surgeBand, stressIndex, inflationScoreNudge, narrative };
}

export function householdWageInflationStressSurgeScoreAdjustment(
  band: HouseholdWageInflationStressSurgeBand,
): number {
  if (band === 'wage_crisis') return 4;
  if (band === 'surge') return 3;
  if (band === 'building') return 2;
  return 0;
}
