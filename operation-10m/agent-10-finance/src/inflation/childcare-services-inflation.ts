import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ChildcareServicesPressureBand = 'stable' | 'rising' | 'sharp' | 'crisis';

export interface ChildcareServicesInflationAssessment {
  pressureBand: ChildcareServicesPressureBand;
  childcareIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Early childhood and care services in macro CPI metadata. */
export function assessChildcareServicesInflation(input: {
  capacityShortageBand: 'none' | 'moderate' | 'severe';
  wageAwardPassThrough: 'muted' | 'normal' | 'strong';
  subsidyIndexationLag: boolean;
  inflationBand: InflationConditionsBand;
  turn: number;
}): ChildcareServicesInflationAssessment {
  let pressure = 0;
  if (input.capacityShortageBand === 'severe') pressure += 0.4;
  else if (input.capacityShortageBand === 'moderate') pressure += 0.22;

  if (input.wageAwardPassThrough === 'strong') pressure += 0.26;
  else if (input.wageAwardPassThrough === 'normal') pressure += 0.12;

  if (input.subsidyIndexationLag) pressure += 0.18;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.07;
  }

  pressure = finClamp(pressure + input.turn * 0.004, 0, 1.05);
  const childcareIndex = finRound(100 + pressure * 15, 1);

  let pressureBand: ChildcareServicesPressureBand = 'stable';
  if (pressure >= 0.62) pressureBand = 'crisis';
  else if (pressure >= 0.4) pressureBand = 'sharp';
  else if (pressure >= 0.2) pressureBand = 'rising';

  const inflationScoreNudge =
    pressureBand === 'crisis'
      ? 0.08
      : pressureBand === 'sharp'
        ? 0.05
        : pressureBand === 'rising'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'crisis' || pressureBand === 'sharp'
      ? 'Childcare fees are lifting household cost-of-living and services CPI.'
      : pressureBand === 'rising'
        ? 'Childcare inflation rising — capacity and award pass-through in play.'
        : 'Childcare services inflation stable relative to headline basket.';

  return { pressureBand, childcareIndex, inflationScoreNudge, narrative };
}

export function childcareServicesInflationScoreAdjustment(band: ChildcareServicesPressureBand): number {
  if (band === 'crisis') return 4;
  if (band === 'sharp') return 3;
  if (band === 'rising') return 2;
  return 0;
}
