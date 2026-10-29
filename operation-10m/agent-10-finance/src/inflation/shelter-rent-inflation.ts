import type { InflationConditionsBand } from '../definitions/types.js';
import { finClamp, finRound } from '../compute/math.js';

export type ShelterRentPressureBand = 'soft' | 'building' | 'hot' | 'overheated';

export interface ShelterRentInflationAssessment {
  pressureBand: ShelterRentPressureBand;
  shelterIndex: number;
  inflationScoreNudge: number;
  narrative: string;
}

/** Shelter and rent share of macro CPI basket (metadata; not housing asset prices). */
export function assessShelterRentInflation(input: {
  vacancyBand: 'loose' | 'balanced' | 'tight' | 'critical';
  rentGrowthBand: 'subdued' | 'moderate' | 'strong' | 'surging';
  urbanizationPressure: 'low' | 'medium' | 'high';
  inflationBand: InflationConditionsBand;
  turn: number;
}): ShelterRentInflationAssessment {
  let pressure = 0;
  if (input.vacancyBand === 'critical') pressure += 0.38;
  else if (input.vacancyBand === 'tight') pressure += 0.24;
  else if (input.vacancyBand === 'balanced') pressure += 0.08;

  if (input.rentGrowthBand === 'surging') pressure += 0.35;
  else if (input.rentGrowthBand === 'strong') pressure += 0.22;
  else if (input.rentGrowthBand === 'moderate') pressure += 0.1;

  if (input.urbanizationPressure === 'high') pressure += 0.12;
  else if (input.urbanizationPressure === 'medium') pressure += 0.06;

  if (input.inflationBand === 'elevated' || input.inflationBand === 'high') {
    pressure += 0.08;
  }

  pressure = finClamp(pressure + input.turn * 0.005, 0, 1);
  const shelterIndex = finRound(100 + pressure * 16, 1);

  let pressureBand: ShelterRentPressureBand = 'soft';
  if (pressure >= 0.62) pressureBand = 'overheated';
  else if (pressure >= 0.4) pressureBand = 'hot';
  else if (pressure >= 0.22) pressureBand = 'building';

  const inflationScoreNudge =
    pressureBand === 'overheated'
      ? 0.11
      : pressureBand === 'hot'
        ? 0.07
        : pressureBand === 'building'
          ? 0.03
          : 0;

  const narrative =
    pressureBand === 'overheated' || pressureBand === 'hot'
      ? 'Shelter and rent are a dominant macro CPI contributor in urban markets.'
      : pressureBand === 'building'
        ? 'Shelter inflation building — vacancy and rent growth elevated.'
        : 'Shelter rent pressure soft relative to services basket.';

  return { pressureBand, shelterIndex, inflationScoreNudge, narrative };
}

export function shelterRentInflationScoreAdjustment(band: ShelterRentPressureBand): number {
  if (band === 'overheated') return 5;
  if (band === 'hot') return 3;
  if (band === 'building') return 2;
  return 0;
}
