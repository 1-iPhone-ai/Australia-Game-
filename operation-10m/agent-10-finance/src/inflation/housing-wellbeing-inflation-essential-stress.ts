import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type HousingWellbeingInflationEssentialStressBand = 'stable' | 'strained' | 'critical' | 'acute';

export interface HousingWellbeingInflationEssentialStressAssessment {
  stressBand: HousingWellbeingInflationEssentialStressBand;
  shelterIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Housing mortgage and wellbeing essential inflation stress (Agent 14). */
export function assessHousingWellbeingInflationEssentialStress(input: {
  mortgageStressBand: 'low' | 'elevated' | 'severe';
  wellbeingCostBand: 'stable' | 'strained' | 'critical';
  essentialServicesInflationFlag: boolean;
  shelterEssentialInflationLatch: boolean;
  mortgageWellbeingStressBand: 'stable' | 'strained' | 'acute';
  inflationBand: InflationConditionsBand;
  turn: number;
}): HousingWellbeingInflationEssentialStressAssessment {
  let pressure = 0;
  if (input.mortgageStressBand === 'severe') {
    pressure += 0.2;
  } else if (input.mortgageStressBand === 'elevated') {
    pressure += 0.1;
  }
  if (input.wellbeingCostBand === 'critical') {
    pressure += 0.18;
  } else if (input.wellbeingCostBand === 'strained') {
    pressure += 0.09;
  }
  if (input.essentialServicesInflationFlag) {
    pressure += 0.12;
  }
  if (input.shelterEssentialInflationLatch) {
    pressure += 0.14;
  }
  if (input.mortgageWellbeingStressBand === 'acute') {
    pressure += 0.22;
  } else if (input.mortgageWellbeingStressBand === 'strained') {
    pressure += 0.11;
  }

  if (input.inflationBand === 'high' || input.inflationBand === 'scenario_runaway') {
    pressure += 0.05;
  }

  pressure = finClamp(pressure + input.turn * 0.0035, 0, 1.05);
  const shelterIndex = finRound(100 + pressure * 15, 1);

  let stressBand: HousingWellbeingInflationEssentialStressBand = 'stable';
  if (pressure >= 0.55) stressBand = 'acute';
  else if (pressure >= 0.35) stressBand = 'critical';
  else if (pressure >= 0.16) stressBand = 'strained';

  const inflationScoreNudge =
    stressBand === 'acute'
      ? 0.089
      : stressBand === 'critical'
        ? 0.056
        : stressBand === 'strained'
          ? 0.027
          : 0;

  const narrative =
    stressBand === 'acute' || stressBand === 'critical'
      ? 'Mortgage and wellbeing essential stress feeding shelter CPI metadata.'
      : stressBand === 'strained'
        ? 'Shelter essential inflation latch building under mortgage pressure.'
        : 'Housing wellbeing essential stress stable versus headline CPI.';

  return { stressBand, shelterIndex, inflationScoreNudge, narrative };
}

export function housingWellbeingInflationEssentialStressScoreAdjustment(
  band: HousingWellbeingInflationEssentialStressBand,
): number {
  if (band === 'acute') return 4;
  if (band === 'critical') return 3;
  if (band === 'strained') return 2;
  return 0;
}
