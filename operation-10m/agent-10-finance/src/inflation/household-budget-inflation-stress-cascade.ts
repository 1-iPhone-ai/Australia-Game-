import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type HouseholdBudgetInflationStressCascadeBand = 'contained' | 'building' | 'ruptured' | 'budget_collapse';

export interface HouseholdBudgetInflationStressCascadeAssessment {
  cascadeBand: HouseholdBudgetInflationStressCascadeBand;
  stressIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Household budget inflation stress cascade (Agent 09). */
export function assessHouseholdBudgetInflationStressCascade(input: {
  wageGrowthBand: 'subdued' | 'moderate' | 'elevated' | 'surge';
  costOfLivingStress: 'low' | 'moderate' | 'high' | 'extreme';
  wave38BudgetInflationLatch: boolean;
  householdStressCascadeBand: 'contained' | 'building' | 'ruptured';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HouseholdBudgetInflationStressCascadeAssessment {
  let pressure = 0;
  if (input.wageGrowthBand === 'surge') pressure += 0.2;
  else if (input.wageGrowthBand === 'elevated') pressure += 0.11;
  if (input.costOfLivingStress === 'extreme') pressure += 0.22;
  else if (input.costOfLivingStress === 'high') pressure += 0.12;
  if (input.wave38BudgetInflationLatch) pressure += 0.13;
  if (input.householdStressCascadeBand === 'ruptured') pressure += 0.21;
  else if (input.householdStressCascadeBand === 'building') pressure += 0.1;

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') pressure += 0.05;

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const stressIndex = finRound(100 + pressure * 16, 1);

  let cascadeBand: HouseholdBudgetInflationStressCascadeBand = 'contained';
  if (pressure >= 0.57) cascadeBand = 'budget_collapse';
  else if (pressure >= 0.38) cascadeBand = 'ruptured';
  else if (pressure >= 0.17) cascadeBand = 'building';

  const inflationScoreNudge =
    cascadeBand === 'budget_collapse'
      ? 0.091
      : cascadeBand === 'ruptured'
        ? 0.058
        : cascadeBand === 'building'
          ? 0.027
          : 0;

  const narrative =
    cascadeBand === 'budget_collapse' || cascadeBand === 'ruptured'
      ? 'Household budget stress cascade feeding CPI wage-cost metadata.'
      : cascadeBand === 'building'
        ? 'Cost-of-living latch building under wage growth stress.'
        : 'Household budget inflation stress contained versus headline CPI.';

  return { cascadeBand, stressIndex, inflationScoreNudge, narrative };
}

export function householdBudgetInflationStressCascadeScoreAdjustment(
  band: HouseholdBudgetInflationStressCascadeBand,
): number {
  if (band === 'budget_collapse') return 4;
  if (band === 'ruptured') return 3;
  if (band === 'building') return 2;
  return 0;
}
