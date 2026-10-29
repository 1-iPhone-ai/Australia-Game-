import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type WaterUtilitiesPressureBand = 'stable' | 'firming' | 'sharp' | 'drought_crisis';

export interface WaterUtilitiesInflationAssessment {
  pressureBand: WaterUtilitiesPressureBand;
  utilitiesIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Water and sewer utilities in macro CPI metadata (distinct from energy utilities). */
export function assessWaterUtilitiesInflation(input: {
  droughtStressBand: 'none' | 'moderate' | 'severe';
  infrastructureTariffShock: boolean;
  recyclingCostPassThrough: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): WaterUtilitiesInflationAssessment {
  let pressure = 0;
  if (input.droughtStressBand === 'severe') pressure += 0.46;
  else if (input.droughtStressBand === 'moderate') pressure += 0.24;

  if (input.infrastructureTariffShock) pressure += 0.2;
  if (input.recyclingCostPassThrough === 'high') pressure += 0.16;
  else if (input.recyclingCostPassThrough === 'medium') pressure += 0.08;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.06;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1.05);
  const utilitiesIndex = finRound(100 + pressure * 17, 1);

  let pressureBand: WaterUtilitiesPressureBand = 'stable';
  if (pressure >= 0.65) pressureBand = 'drought_crisis';
  else if (pressure >= 0.42) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'firming';

  const inflationScoreNudge =
    pressureBand === 'drought_crisis'
      ? 0.09
      : pressureBand === 'sharp'
        ? 0.06
        : pressureBand === 'firming'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'drought_crisis' || pressureBand === 'sharp'
      ? 'Water utilities are lifting regulated-charge CPI through drought and tariff stacks.'
      : pressureBand === 'firming'
        ? 'Water pass-through firming — infrastructure and recycling costs elevated.'
        : 'Water utilities inflation stable relative to energy basket.';

  return { pressureBand, utilitiesIndex, inflationScoreNudge, narrative };
}

export function waterUtilitiesInflationScoreAdjustment(band: WaterUtilitiesPressureBand): number {
  if (band === 'drought_crisis') return 4;
  if (band === 'sharp') return 3;
  if (band === 'firming') return 2;
  return 0;
}
